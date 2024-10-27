import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, TextInput, SafeAreaView, Platform } from 'react-native';
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

  const db = SQLite.openDatabaseSync("StarWarsApp1.db");
  return db;
}

const db = openDatabase();

const HomeScreen = ({ navigation }) => {

  let logout = () => {
    db.runSync(`delete from preferances where key = ?`
      ,'currentuser');
    
    navigation.dispatch(
      StackActions.replace('Splash')
    );

  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.mainContainer}>
        <View style={styles.appBar}>
          <Icon name='angle-left' size={28} onPress={() => BackHandler.exitApp()}/>
          <Text style={styles.titleText}>Home</Text>
          <Menu>
            <MenuTrigger >
              <Icon name='ellipsis-v' size={28} />
            </MenuTrigger>
            <MenuOptions>
              <MenuOption onSelect={() => navigation.navigate('Profile')} text='Profile' />
              <MenuOption onSelect={logout} text='Logout' />
            </MenuOptions>
          </Menu>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

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
});