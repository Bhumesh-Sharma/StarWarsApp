import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Platform, Button, Image, TouchableOpacity, ScrollView } from 'react-native';
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

  const db = SQLite.openDatabaseSync("StarWarsApp2910.db");
  return db;
}

const db = openDatabase();

const AddGroupScreen = ({ navigation }) => {

  let [groupname, setGroupName] = useState('');
  let [description, setDescription] = useState('');
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

  let create_group = () => {

    if (!groupname) {
      alert('Please enter your group name');
      return;
    }
    if (!description) {
      alert('Please enter group description');
      return;
    }

    if (!imageString) {
      alert('Please capture your groups photo');
      return;
    }

    var result1 = db.getFirstSync(`select intvalue  from preferances where key = ?`,'currentuser');
    var userid = result1.intvalue;

    db.runSync(`insert into groups (groupname, description, groupphoto, createdby) values (?,?,?,?)`
        , groupname,description,imageString, userid);

    alert("Group successfully created");

    navigation.dispatch(StackActions.pop(2));
    navigation.navigate("GroupList");
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.mainContainer}>
          <View style={styles.appBar}>
            <Icon name='angle-left' size={28} onPress={() => navigation.dispatch(StackActions.pop())}/>
            <Text style={styles.titleText}>Create Group</Text>
            <Text style={styles.saveButton} onPress={create_group}>Save</Text>
          </View>
          <TouchableOpacity style={{marginBottom: 40}} onPress={captureImage}>
            <Image style={{ width: 100, height: 100,backgroundColor: '#fff'}} source={{uri: imageString}}/>
            <Icon style={{position: 'absolute', top: 80, left: 80}} name='plus' size={28}/>
          </TouchableOpacity>
          <TextInput
              style={[styles.inputBox,{marginBottom: 40}]}
              placeholder="Group Name"
              onChangeText={(groupname) => setGroupName(groupname)}
            />
            <TextInput
              style={[styles.inputBox,{marginBottom: 2}]}
              placeholder="Description"
              multiline={true}
              numberOfLines={3}
              onChangeText={(description) => setDescription(description)}
            />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddGroupScreen;

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