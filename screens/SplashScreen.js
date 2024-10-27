import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, TextInput, SafeAreaView, Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { StackActions } from '@react-navigation/native';
import React, { useEffect, useState }from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  
    const db = SQLite.openDatabaseSync("StarWarsApp1.db");
    db.withTransactionSync(() => {
      db.runSync(
        `create table if not exists users (userid integer primary key not null, email text unique, firstname text
        , lastname text, password text, job text, photo text);`
      );
      db.runSync(
        `create table if not exists groups (groupid integer primary key not null, groupname text, description text, createdby integer);`
      );
      db.runSync(
        `create table if not exists groupmembers (groupid integer not null,userid text, inviteaccepted integer);`
      );
      db.runSync(
        `create table if not exists preferances (key text not null,intvalue integer, textvalue text );`
      );
    });
    return db;
  }
  
  const db = openDatabase();

const SplashScreen = ({ navigation }) => {


    const gotoInitialRoute = async() =>{
        try {

            var result = db.getFirstSync(`select count(*) as currentusercount from preferances where key = ?`,'currentuser');
            var count = JSON.parse(result.currentusercount);

            // const value = await AsyncStorage.getItem('userid');
            if (count==0) {
                console.log("login goto");
                navigation.dispatch(
                    StackActions.replace('Login')
                  );
            }
            else {
                console.log("home goto");
                navigation.dispatch(
                    StackActions.replace('Home')
                  );
            }
          } catch (error) {
            alert(error);
            return;
          }
    }

    useEffect( () => {
    
        gotoInitialRoute();
    
      }, []);
      

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.maincontainer}>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
});