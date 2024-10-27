import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, TextInput, SafeAreaView, Platform } from 'react-native';
import React, { useEffect, useState }from 'react';
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/native';


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

const LoginScreen = ({ navigation }) => {
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  // useEffect(() => {
    
  // }, []);

  let login_user = ()  => {
    console.log(email, password);

    console.log(JSON.stringify(db.getAllSync(`select * from users`)));

    if (!email) {
      alert('Please enter your email');
      return;
    }
    if (!password) {
      alert('Please enter your password');
      return;
    }

    db.withTransactionSync( async () => {
      var result = db.getFirstSync(`select count(*) as usercount from users where email = ?`,email);
      var count = JSON.parse(result.usercount);

      if(count==0){
        alert("Email is not registered in our app.");
        return;
      }

      var pass, userid;
      try {
        console.log(JSON.stringify(db.getFirstSync(`select password, userid  from users where email = ?`,email)));
      var result1 = db.getFirstSync(`select password, userid  from users where email = ?`,email);
       pass = result1.password;
       userid = result1.userid;
      }
      catch(e){
        alert(e);
        return;
      }



      if(password!=pass){
        alert("Incorrect Password!");
        return;
      }
      else {
        // try {
        //   await AsyncStorage.setItem(
        //     'userid',
        //     JSON.stringify(userid),
        //   );
        // } catch (error) {
        //   alert(error);
        //   return;
        // }

        db.runSync(`insert into preferances (key, intvalue) values (?,?)`
          ,'currentuser',userid);
        
        navigation.dispatch(
          StackActions.replace('Home')
        );
      }
      

    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.maincontainer}>
        <Text style={styles.titleText}>StarWars App</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.inputBox}
            placeholder="Email Address"
            onChangeText={(email) => setEmail(email)}
          />
          <TextInput
            style={styles.inputBox}
            placeholder="Password"
            onChangeText={(password) => setPassword(password)}
          />
          <Text style={styles.buttonStyle} onPress={login_user}>LOGIN</Text>
          <Text style={styles.tertiaryButtonStyle}>Forgot Password</Text>
          <View style={styles.dividerStyle}></View>
          <Text style={{marginBottom: 15}}>You don't have your account?</Text>
          <Text style={styles.secondaryButtonStyle} onPress={() => navigation.navigate("Registration")} >CREATE ACCOUNT</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
    marginTop: 24
  },
  titleText: {
    fontSize: 40,
    marginHorizontal: 20,
    marginVertical: 80,
    textAlign: 'center'
  },
  card: {
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical:40,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'start',
    elevation: 5
  },
  inputBox: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#e1e3e1',
    padding: 8,
    marginBottom: 15
  },
  buttonStyle: {
    width: "100%",
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#2196F3',
    textAlign: "center",
    marginBottom: 10,
    fontSize: 20,
    color: "white"
  },
  secondaryButtonStyle: {
    width: "100%",
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#31eb25',
    textAlign: "center",
    fontSize: 20,
    color: "white"
  },
  tertiaryButtonStyle: {
    marginBottom: 20,
    fontSize: 20,
    color: "#2196F3"
  },
  dividerStyle: {
    height: 2,
    backgroundColor: '#e1e3e1',
    width: "100%",
    marginBottom:20
  }
});