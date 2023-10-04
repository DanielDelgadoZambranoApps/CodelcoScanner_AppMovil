import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, Button, Image, TouchableOpacity, ActivityIndicator, TextInput, SafeAreaView, Alert } from 'react-native'
import { collection, addDoc, setDoc, Timestamp, doc, getDocs, getDoc } from "firebase/firestore"
import { BarCodeScanner } from 'expo-barcode-scanner'
import { Foundation } from '@expo/vector-icons'
import db from '../database/firebase'

const ScannerScreen=()=> {
  const [text, setText] = useState('No hay informacion en la base de datos ...')
  
  const [hasPermission, setHasPermission] = useState(null)
  const [ShowLoading, setShowLoading] = useState(false)
  const [scanned, setScanned] = useState(false)
  const [rut, setRut] = useState(null)

  const getCameraPermission = () => {
    (async () => { 
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })()
  }

  useEffect(() => {
    getCameraPermission();
  }, [])

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Esperando permisos para usar la Camara ...</Text>
      </View>)
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
        <Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
      </View>)
  }

  const addUser =async (data)=>{
    await setDoc(doc(db, "usersRegister", data.RUT), data)
  }

  const searchRunManualFirebase =async()=>{
    setShowLoading(true)
    let docSnap 
    let docRef
    let data 
    let hour =""
    let date =""
    let name =""

    console.log("rut buscado --> " + rut )

    if(rut){
        docRef = doc(db, "users", rut)
        docSnap = await getDoc(docRef)
        

        if (docSnap.exists()) {
        data = docSnap.data()
        if(!data["Seleccione en qué rango horario asistirá el martes 22 de noviembre"]){
            hour = data["Seleccione en qué rango horario asistirá el miércoles 23 de noviembre"]
        } else {
            hour = data["Seleccione en qué rango horario asistirá el martes 22 de noviembre"]
        }
        date =data["Qué día asistirá a la Feria de Empleabilidad?"]
        name = data["Nombre Completo"] 
        setText("El usuario " + rut + " esta registrado"  + "\n" +"\n" + "Nombre :" + name +"\n" +
            " Fecha :" + date +"\n" + "Horario: " + hour)

            Alert.alert(
                "Este usuario existe", "¿Desea registrar su ingreso?",
                [{ text: "Cancelar", onPress: () => { return }, },
                    { text: "Aceptar", onPress: () => {addUser(data)},},
                ],
            )

        } else {
        setText("No hay informacion en la base de datos ...")
        console.log("No such document!");
        } 
    }
    setShowLoading(false)
  }


  const searchRunAutomatic = async ({ type, data }) => {
    setShowLoading(true)
    setScanned(true)
    
    let fullRun = ""
    let index = 52
    let name= ""
    let hour =""
    let date =""

    while(data[index]!='&'){
      fullRun = fullRun + data[index]
      index= index + 1
    }

    const docRef = doc(db, "users", fullRun)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      data = docSnap.data()
      if(!data["Seleccione en qué rango horario asistirá el martes 22 de noviembre"]){
        hour = data["Seleccione en qué rango horario asistirá el miércoles 23 de noviembre"]
      } else {
        hour = data["Seleccione en qué rango horario asistirá el martes 22 de noviembre"]
      }
      date =data["Qué día asistirá a la Feria de Empleabilidad?"]
      name = data["Nombre Completo"] 
      setText("El usuario " + fullRun + " esta registrado"  + "\n" +"\n" + "Nombre :" + name +"\n" +
         " Fecha :" + date +"\n" + "Horario: " + hour)

         Alert.alert(
            "Este usuario existe", "¿Desea registrar su ingreso?",
            [{ text: "Aceptar", onPress: () => addUser(data),},
             { text: "Cancelar", onPress: () => { return }, }  ,
            ],
            { cancelable: true }
          )
         
    } else {
      setText("No hay informacion en la base de datos ...")
      console.log("No such document!")
    }
    setShowLoading(false)
  //  setScanned(false)
  }

  const refresh =()=>{
    setScanned(false)
    setText("No hay informacion en la base de datos ...")
  }

  return (
    <>
    <View style={styles.container}>
      <SafeAreaView>    
        <Image source={require("../assets/Codelco_logo.png")} style={styles.logoStyle}/>
          <View style={{flexDirection:'row', marginTop:-10, width:'75%', left:5}}>
              <TextInput
                value={rut}
                onChangeText={(value)=>setRut(value)}
                style={styles.inputStyle}
                placeholder={"Ingresar Rut"}
                placeholderTextColor="#666"
                autoCapitalize="none" 
                />  
                <TouchableOpacity  style={{left:60, bottom:2}} onPress={()=>searchRunManualFirebase()} >
                <Foundation name="magnifying-glass" size={45} color="#DA8221" />
                </TouchableOpacity>
              </View>
          <View style={styles.barcodebox}>
            <BarCodeScanner style={styles.BarCodeStyle} onBarCodeScanned= {scanned ? undefined : searchRunAutomatic }/>
          </View>
          <View style={styles.textContainer}>
            { ShowLoading ?
            <>
              <ActivityIndicator size="small" color="#DA8221" />
            </>
            :
            <>
              <Text style={styles.textStyle}>{text}</Text>  
            </>
            } 
            </View>
            <TouchableOpacity style={styles.refreshButton} onPress={()=>{ refresh()} }  >
              <Text style={styles.ButtonText} >Refrescar </Text>
            </TouchableOpacity>
      </SafeAreaView>
    </View>
    </>
  )
} 

export default ScannerScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#FFEAD3'
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf:'center',
    height: 280,
    width: 280,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'tomato',
    marginTop:0
  },
  BarCodeStyle:{ 
    height: 300, 
    width: 300 
  },
  logoStyle:{
    width: "35%",
    height: 140,
    resizeMode: "contain",
    alignItems: "center",
    alignSelf:'center',
    marginTop:-20
  },
  textStyle:{
    fontSize:13,
    justifyContent:'center',
    alignItems:'center', 
    alignContent:'center',
    alignSelf:'center',
    textAlign:'center'
  },
  ButtonText:{
    fontSize:16,
    justifyContent:'center',
    alignItems:'center',
    alignContent:'center',
    alignSelf:'center',
    textAlign:'center',
    marginTop:10
  },
  textContainer:{
    marginTop:10,
    width:'100%',
    height:100,
    alignSelf:'center'
  },
  refreshButton:{
    width:'75%',
    height:40,
    backgroundColor:'#DA8221',
    borderRadius:30,
    elevation:10,
    alignSelf:'center',
    bottom:10
  },
  inputStyle: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign:'center',
    alignContent:'center',
    width:'40%',
    height: 42,
    color: "#000000",
    fontSize: 18,
    borderWidth: 1,
    borderBottomColor: "gray",
    borderTopColor:'gray',
    borderLeftColor:'gray',
    borderRightColor:'gray',
    borderRadius:10,
    marginBottom:15,
    left:50
  }
})
