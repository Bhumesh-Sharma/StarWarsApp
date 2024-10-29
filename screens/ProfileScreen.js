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

const ProfileScreen = ({ navigation }) => {

    let [email, setEmail] = useState('');
    let [firstname, setFirstname] = useState('');
    let [lastname, setLastname] = useState('');
    let [job, setjob] = useState('');
    let [imageString, setimageString] = useState('');

    let [height, setHeight] = useState('');
    let [mass, setMass] = useState('');
    let [birthyear, setBirthYear] = useState('');
    let [gender, setGender] = useState('');

  let loadProfile = () => {

    var result1 = db.getFirstSync(`select intvalue  from preferances where key = ?`,'currentuser');
    var userid = result1.intvalue;

    result1 = db.getFirstSync(`select email, firstname, lastname, job, photo  from users where userid = ?`,userid);

    setEmail(result1.email);
    setFirstname(result1.firstname);
    setLastname(result1.lastname);
    setjob(result1.job);
    setimageString(result1.photo);


    getDataFromApiAsync(result1.firstname);

  }

  const getDataFromApiAsync = async (firstname) => {
    try {
      const response = await fetch(
        'https://swapi.dev/api/people/?search='+firstname,
      );
      const json = await response.json();
      setHeight(json.results[0].height);
      setMass(json.results[0].mass);
      setBirthYear(json.results[0].birth_year);
      setGender(json.results[0].gender);
    } catch (error) {
      console.error(error);
      setHeight("NA");
      setMass("NA");
      setBirthYear("NA");
      setGender("NA");
    }
  };

  useEffect( () => {
    
    loadProfile();

  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.mainContainer}>
          <View style={styles.appBar}>
            <Icon name='angle-left' size={28} onPress={() => navigation.dispatch(StackActions.pop())}/>
            <Text style={styles.titleText}>Profile</Text>
            <View></View>
          </View>
          <Image style={{ marginBottom: 40, width: 100, height: 100,backgroundColor: '#fff'}} source={{uri: imageString}}/>
          <View style={{width: "100%",marginBottom: 2, padding: 8, flexDirection: 'row', backgroundColor: '#fff'}}>
              <Text>
                  Email: 
              </Text>
              <Text>
                  {' '+email}
              </Text>
          </View>
          <View style={{width: "100%",marginBottom: 2, padding: 8, flexDirection: 'row', backgroundColor: '#fff'}}>
              <Text>
                  Name: 
              </Text>
              <Text>
                  {' '+firstname + ' '+ lastname}
              </Text>
          </View>
          <View style={{width: "100%",marginBottom: 40, padding: 8, flexDirection: 'row', backgroundColor: '#fff'}}>
              <Text>
                  Job: 
              </Text>
              <Text>
                  {' '+job}
              </Text>
          </View>
          <View style={{width: "100%",marginBottom: 2, padding: 8, flexDirection: 'row', backgroundColor: '#fff'}}>
              <Text>
                  Height: 
              </Text>
              <Text>
                  {' '+height}
              </Text>
          </View>
          <View style={{width: "100%",marginBottom: 2, padding: 8, flexDirection: 'row', backgroundColor: '#fff'}}>
              <Text>
                  Mass: 
              </Text>
              <Text>
                  {' '+mass}
              </Text>
          </View>
          <View style={{width: "100%",marginBottom: 2, padding: 8, flexDirection: 'row', backgroundColor: '#fff'}}>
              <Text>
                  Birthyear: 
              </Text>
              <Text>
                  {' '+birthyear}
              </Text>
          </View>
          <View style={{width: "100%",marginBottom: 2, padding: 8, flexDirection: 'row', backgroundColor: '#fff'}}>
              <Text>
                  Gender: 
              </Text>
              <Text>
                  {' '+gender}
              </Text>
          </View>
        </View>
      </ScrollView>  
    </SafeAreaView>
  );
};

export default ProfileScreen;

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
});