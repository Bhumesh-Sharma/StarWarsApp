import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View, TextInput, SafeAreaView, Platform, TouchableOpacity, ScrollView, Button } from 'react-native';
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

const NotificationScreen = ({ navigation }) => {

  const [notifications, setNotifications] = useState([]);
  var userid;

  let loadNotifications = () => {

    var result1 = db.getFirstSync(`select intvalue  from preferances where key = ?`,'currentuser');
    userid = result1.intvalue;
    console.log(userid+"_");
    
        setNotifications( db.getAllSync(
          `select a.groupid, a.groupname, a.groupphoto from groups a
          inner join groupmembers b on a.groupid=b.groupid
            where b.userid=? and inviteaccepted=0;`,userid
        ));

  }

  let acceptInvite = (groupid) => {

    var result1 = db.getFirstSync(`select intvalue  from preferances where key = ?`,'currentuser');
    userid = result1.intvalue;

    console.log(userid+"__"+groupid);
    db.runSync(`update groupmembers set inviteaccepted=1 where groupid=? and userid=?`
        , groupid, userid);

    loadNotifications();
    alert("Invitation Accepted !");
  }

  let rejectInvite = (groupid) => {
    var result1 = db.getFirstSync(`select intvalue  from preferances where key = ?`,'currentuser');
    userid = result1.intvalue;

    db.runSync(`delete from groupmembers where groupid=? and userid=?`
        , groupid, userid);

        loadNotifications();
        alert("Invitation Rejected !");
  }

  useEffect( () => {
    
    loadNotifications();

  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[styles.mainContainer,{flex: 1}]}>
        <View style={styles.appBar}>
          <Icon name='angle-left' size={28} onPress={() => navigation.dispatch(StackActions.pop())}/>
          <Text style={styles.titleText}>My Notifications</Text>
          <View></View>
        </View>
        <ScrollView>
                {notifications.map(({ groupid, groupname, groupphoto }) => (
                    <View>
                        <View style={styles.groupTile}>
                            <Image style={{ margin: 15,width: 100, height: 100,backgroundColor: '#fff'}} source={{uri: groupphoto}}/>
                            <View style={{flex: 1}}>
                              <Text style={[styles.titleText,{marginBottom: 8, flexWrap:"wrap"}]}>{"Invite from: "+groupname}</Text>
                              <View style={{flexDirection: "row"}}>
                                <Text style={[styles.titleText,{flex:1,color:"#2196F3"}]} onPress={()=> acceptInvite(groupid)}>Accept</Text>
                                <Text style={[styles.titleText, {flex:1,color:"red"}]} onPress={()=> rejectInvite(groupid)}>Reject</Text> 
                              </View>
                            </View>
                        </View>
                        
                    </View>
            ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
    marginTop: 24
  },
  appBar: {
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
    backgroundColor: "#fff",
    marginBottom: 2,
    flexDirection: "row",
    alignItems: "center"
  }
});