import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, TextInput, SafeAreaView, Platform, Image, ScrollView } from 'react-native';
import { useEffect, useState }from 'react';
import * as SQLite from 'expo-sqlite';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
 } from "react-native-popup-menu";
 import { StackActions } from '@react-navigation/native';
 import React, { BackHandler } from 'react-native';
 import { useRoute } from "@react-navigation/native"

 function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }

  const db = SQLite.openDatabaseSync("StarWarsApp2910.db");
  return db;
}

const db = openDatabase();

const GroupDetailsScreen = ({ navigation , route}) => {

    const groupid = route.params?.group_id;


    let [groupname, setGroupName] = useState('');
    let [description, setDescription] = useState('');
    let [imageString, setimageString] = useState('');
    let [adminName, setAdminName] = useState('');
    let [adminId, setAdminId] = useState('');
    let [adminInviteView, setAdminInviteView] = useState(<View></View>);
    let [adminDeleteView, setAdminDeleteView] = useState(<View></View>);
    let [adminNoneDeleteView, setAdminNoneDeleteView] = useState(<View></View>);
    let [adminNoneInviteView, setAdminNoneInviteView] = useState(<View></View>);
    let [inviteEmail, setInviteEmail] = useState('');
    let [currentUserId, setCurrentUserId] = useState('');
    const [groupMembers, setGroupMembers] = useState([]);

  let loadGroupDetails = () => {
    var result1 = db.getFirstSync(`select intvalue  from preferances where key = ?`,'currentuser');
    setCurrentUserId(result1.intvalue);

    result1 = db.getFirstSync(`select groupname, description, groupphoto, createdby  from groups where groupid = ?`,groupid);

    setGroupName(result1.groupname);
    setDescription(result1.description);
    setimageString(result1.groupphoto);

    var result2 = db.getFirstSync(`select firstname, lastname, userid  from users where userid = ?`,result1.createdby);

    setAdminName(result2.firstname + " "+result2.lastname ); 
    setAdminId(result2.userid);
    console.log(currentUserId + "--"+adminId);
    if(currentUserId==adminId){
        setAdminInviteView( 
        <View style={{width:"90%"}}>
            <TextInput
              style={{marginBottom: 20, width: "100%", backgroundColor: "#fff", padding: 8,}}
              placeholder="Email"
              onChangeText={(inviteEmail) => setInviteEmail(inviteEmail)}
            />
            <Button onPress={()=>inviteUser()} title='Invite'/>
        </View>);

        setAdminDeleteView(<Icon name='trash' size={28} onPress={() => deleteMember(userid)}/>);
    }
    else {
        setAdminInviteView(<View></View>);
        setAdminDeleteView(<View></View>);
    }
  };

  inviteUser = () => {

    if(!inviteEmail){
        alert("Please enter email to invite");
        return;
    }

    var result = db.getFirstSync(`select count(*) as usercount from users where email = ?`,inviteEmail);
      var count = JSON.parse(result.usercount);

      if(count==0){
        alert("Email is not registered in our app.");
        return;
      }

      var result1 = db.getFirstSync(`select userid from users where email = ?`,inviteEmail);
      var invitedUserId = JSON.parse(result1.userid);

      if(invitedUserId==adminId){
        alert("Already registered as Admin.");
        return;
      }

      var result2 = db.getFirstSync(`select count(*) as usercount from groupmembers where groupid = ?
        and userid = ?`,groupid,invitedUserId);
      var membercount = JSON.parse(result2.usercount);

      if(membercount!=0){
        alert("Already Invited.");
        return;
      }
     
      db.runSync(`insert into groupmembers (groupid, userid, inviteaccepted) values (?,?,?)`
        , groupid, invitedUserId, 0);

        alert("Invite sent successfully.");
        return;

  };

  loadGroupMembers = () => {
    
        setGroupMembers( db.getAllSync(
          `select a.firstname, a.lastname, a.photo, a.userid from users a
          left outer join groupmembers b
          on a.userid=b.userid
            where b.groupid == ? and b.inviteaccepted=?;`,groupid,1
        ));
  };

  deleteMember = (userid) => {
    db.runSync(`delete from groupmembers where userid=? and groupid=?`, userid,groupid);
    loadGroupMembers();
  }


  useEffect( () => {
    loadGroupDetails();
    loadGroupMembers();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.mainContainer}>
          <View style={styles.appBar}>
            <Icon name='angle-left' size={28} onPress={() => navigation.dispatch(StackActions.pop())}/>
            <Text style={styles.titleText}>{groupname}</Text>
            <View></View>
          </View>
          <Image style={{ marginBottom: 40, width: 100, height: 100,backgroundColor: '#fff'}} source={{uri: imageString}}/>
          <View style={{marginBottom: 20, padding:8, flexDirection: 'row'}}>
              <Text style={{flex:1, flexWrap:"wrap",textAlign: "center"}}>
                  {'Description: '+description}
              </Text>
          </View>
          <View style={{marginBottom: 40, padding:8, flexDirection: 'row'}}>
              <Text style={{flex:1, flexWrap:"wrap", textAlign: "center"}}>
                  {'Admin: '+adminName}
              </Text>
          </View>
          {adminId==currentUserId?adminInviteView:adminNoneInviteView}
          <Text style={{marginTop: 40, marginBottom: 20}} >Group Members</Text>
                {groupMembers.map(({ firstname, lastname, photo, userid }) => (
               
                    <View style={styles.groupTile}>
                        <Image style={{ margin: 15,width: 30, height: 30,backgroundColor: '#fff'}} source={{uri: photo}}/>
                        <Text style={[styles.titleText, {flex: 8, marginRight: 8}]}>{firstname + " "+lastname}</Text>
                        <View style={{flex:2, alignItems:"flex-end"}}>
                        {adminId==currentUserId?<Icon name='trash'  size={28} onPress={() => deleteMember(userid)}/>:adminNoneDeleteView}
                        </View>
                    </View>
            
            ))}
        </View>
      </ScrollView>  
    </SafeAreaView>
  );
};

export default GroupDetailsScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
    marginTop: 24,
    alignItems:'center'
  },
  appBar: {
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom:20,
    flexDirection: 'row',
    justifyContent: "space-between",
    marginBottom: 80
  },
  titleText: {
    fontSize: 20
  },
  groupTile: {
    width:"100%",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    marginBottom: 2,
    padding: 8,
    flexDirection: "row",
    alignItems: "center"
  }
});