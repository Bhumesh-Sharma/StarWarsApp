import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Platform, Button, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StackActions } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import React, { useEffect, useState }from 'react';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';

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

const RegistrationScreen = ({ navigation }) => {

  let [email, setEmail] = useState('');
  let [firstname, setFirstname] = useState('');
  let [lastname, setLastname] = useState('');
  let [password, setPassword] = useState('');
  let [confirmPassword, setConfrimPassword] = useState('');
  let [job, setjob] = useState('');
  let [imageString, setimageString] = useState('');
  

  let captureImage = async () => {

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1,1],
      quality: 0.10,
      base64: true,
    });

    setimageString('data:image/png;base64,'+result.assets[0].base64);
  };

  let register_user = () => {

    if (!email) {
      alert('Please enter your email');
      return;
    }
    if (!firstname) {
      alert('Please enter your first name');
      return;
    }

    if (!lastname) {
      alert('Please enter your last name');
      return;
    }
    if (!password) {
      alert('Please enter your password');
      return;
    }

    if (!confirmPassword) {
      alert('Please confirm your password');
      return;
    }

    if (password!=confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!job) {
      alert('Please enter your job');
      return;
    }

    if (!imageString) {
      alert('Please capture your photo');
      return;
    }

    try {
      db.runSync(`insert into users (email, firstname, lastname, password, job, photo) values (?,?,?,?,?,?)`
        , email,firstname,lastname,password,job, imageString);
    }
    catch(e){
      alert("Email already registered !");
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Account successfully created 👋'
    });

    alert("Account successfully created");

    navigation.navigate('Login');
  };

  return (
    <SafeAreaView>
    <View style={styles.mainContainer}>
      <View style={styles.appBar}>
        <Icon name='angle-left' size={28} onPress={() => navigation.dispatch(StackActions.pop())}/>
        <Text style={styles.titleText}>Create User Account</Text>
        <Text style={styles.saveButton} onPress={register_user}>Save</Text>
      </View>
      <TouchableOpacity style={{marginBottom: 40}} onPress={captureImage}>
        <Image style={{ width: 100, height: 100,backgroundColor: '#fff'}} source={{uri: imageString}}/>
        <Icon style={{position: 'absolute', top: 80, left: 80}} name='plus' size={28}/>
      </TouchableOpacity>
      <TextInput
          style={[styles.inputBox,{marginBottom: 40}]}
          placeholder="Email Address"
          onChangeText={(email) => setEmail(email)}
        />
        <TextInput
          style={[styles.inputBox,{marginBottom: 2}]}
          placeholder="First Name"
          onChangeText={(firstname) => setFirstname(firstname)}
        />
        <TextInput
          style={[styles.inputBox,{marginBottom: 40}]}
          placeholder="Last Name"
          onChangeText={(lastname) => setLastname(lastname)}
        />
        <TextInput
          style={[styles.inputBox,{marginBottom: 2}]}
          placeholder="Passsword"
          onChangeText={(password) => setPassword(password)}
        />
        <TextInput
          style={[styles.inputBox,{marginBottom: 40}]}
          placeholder="Confirm Password"
          onChangeText={(confirmPassword) => setConfrimPassword(confirmPassword)}
        />
        <TextInput
          style={[styles.inputBox]}
          placeholder="Job Title"
          onChangeText={(job) => setjob(job)}
        />
        <Toast />
    </View>
    </SafeAreaView>
  );
};

export default RegistrationScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
    marginTop: 24,
    alignItems: 'center'
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
  saveButton: {
    fontSize: 20,
    color: "#2196F3"
  },
  inputBox: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 8,
  },
});