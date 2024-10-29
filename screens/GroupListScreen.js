import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View, TextInput, SafeAreaView, Platform, TouchableOpacity, ScrollView } from 'react-native';
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

const GroupListScreen = ({ navigation }) => {

  const [groups, setGroups] = useState([]);

  let loadgroups = () => {

    var result1 = db.getFirstSync(`select intvalue  from preferances where key = ?`,'currentuser');
    var userid = result1.intvalue;

    
        setGroups( db.getAllSync(
          `select a.groupid, a.groupname, a.groupphoto from groups a
            where a.createdby == ? or a.groupid in (Select groupid from groupmembers where userid=? and inviteaccepted=1);`,userid,userid
        ));

  }

  useEffect( () => {
    
    loadgroups();

  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[styles.mainContainer,{flex: 1}]}>
        <View style={styles.appBar}>
          <Icon name='angle-left' size={28} onPress={() => navigation.dispatch(StackActions.pop())}/>
          <Text style={styles.titleText}>My Groups</Text>
          <View></View>
        </View>
        <ScrollView>
                {groups.map(({ groupid, groupname, groupphoto }) => (
                <TouchableOpacity onPress={() => navigation.navigate('GroupDetails',{group_id: groupid})}>
                    <View style={styles.groupTile}>
                        <Image style={{ margin: 15,width: 100, height: 100,backgroundColor: '#fff'}} source={{uri: groupphoto}}/>
                        <Text style={[styles.titleText,{flex:1,flexWrap: "wrap"}]}>{groupname}</Text>
                    </View>
                </TouchableOpacity> 
            ))}
        </ScrollView>
        <TouchableOpacity
            style={{
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            width: 70,
            position: 'absolute',
            bottom: 10,
            right: 10,
            height: 70,
            backgroundColor: '#fff',
            borderRadius: 100,
            }}
            onPress={() => navigation.navigate("AddGroup")}
        >
            <Icon name='plus' size={30} color='#2196F3' />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default GroupListScreen;

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