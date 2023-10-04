
import React, {useState, useEffect} from 'react'
import { SafeAreaView, StyleSheet, Text, View, FlatList, Pressable, ActivityIndicator, TextInput, Alert, ScrollView } from 'react-native'

import { collection, addDoc, setDoc, Timestamp, doc, getDocs, getDoc, deleteDoc  } from "firebase/firestore"
import db from '../database/firebase'   
 
const SearchUsersScreen = () =>{
    const [usersRegisterConverted, setUsersRegisterConverted] =useState(null)
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [update, setUpdate] = useState(false)
    const [search, setSearch] = useState('');

    useEffect(()=>{
        getUsersRegister()   
    },[update])

    const searchFilterFunction = (text) => {
        if (text) {
          const newData = usersRegisterConverted.filter(
            function (item) {
              const itemData = item.RUT
                ? item.RUT.toUpperCase()
                : ''.toUpperCase();
              const textData = text.toUpperCase();
              return itemData.indexOf(textData) > -1;
          });
          setFilteredDataSource(newData);
          setSearch(text);
        } else {
          setFilteredDataSource(usersRegisterConverted);
          setSearch(text);
        }
      };
 
    const getUsersRegister= async ()=>{
        let usersRegisterArray = []
        const querySnapshot = await getDocs(collection(db, "usersRegister"))
            querySnapshot.forEach((doc) => {
            usersRegisterArray.push(doc.data())
        }) 
        setUsersRegisterConverted(usersRegisterArray)
        setFilteredDataSource(usersRegisterArray);
    }

    const deleteUser = async (rut) =>{
        await deleteDoc(doc(db, "usersRegister", rut))
        setUpdate(!update)
    }

    const askBeforeDelete = (rut)=>{
        Alert.alert(
            "¿Esta Seguro que desea eliminar este usuario ?", "",
            [{ text: "Cancelar", onPress: () => { return }, },
                { text: "Aceptar", onPress: () => {deleteUser(rut)},},
            ],
            { cancelable: true }
          )
    }
    
    const ItemSeparatorView = () => {
        return (
          <View style={{ height: 0.5, width: '100%', backgroundColor: '#C8C8C8' }} />
        );
      };

    const RenderItem =(item,index)=>{
        return(
            <>
            <View style={{flexDirection:'row',marginTop:10, marginBottom:10}} >
                <View style= {{width:'61%',height:'100%'}} >
                    <Text style={{left:5}} >{item['item']['Nombre Completo']} {"\n" }Rut: {item['item'].RUT} {"\n" }  </Text>
                </View>
                    <Pressable style={styles.button} onPress={()=>{askBeforeDelete(item['item'].RUT)} }>
                        <Text style={styles.text}>Eliminar</Text>
                    </Pressable>
            </View>
            </>
        )
    }

    return(
        <>
            <View style={styles.container}>
                <SafeAreaView>
                    <TextInput
                        style={styles.textInputStyle}
                        onChangeText={(text) => searchFilterFunction(text)}
                        value={search}
                        underlineColorAndroid="transparent"
                        placeholder="Ingrese el Rut" />  
                        <View style={styles.mainBox} >
                            { usersRegisterConverted ?
                                <>
                                <FlatList 
                                    data={filteredDataSource} 
                                    renderItem={RenderItem} 
                                    ItemSeparatorComponent={ItemSeparatorView}
                                    keyExtractor={(item, index) => index} />
                                </>
                                :
                                <>
                                    <ActivityIndicator style={styles.activityStyle} />      
                                </>
                            }
                            </View>
                </SafeAreaView>
            </View> 
        </>
    )
}

export default SearchUsersScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:'#FFEAD3'
    },
    mainBox:{
        marginTop: 10,
        paddingVertical: 8,
        borderWidth: 0,
        borderRadius: 6,
        backgroundColor: "#F3F3F3",
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold",
        width:'85%',
        height:'84%',
        alignSelf:'center',
        borderWidth:0.5,
        borderColor:'gray'
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
        width:'36%',
        height:'85%',
        backgroundColor:'red',
        alignSelf:'flex-end',
        right:10,
      },
      text: {
        fontSize: 10,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
      },
      activityStyle:{
        marginTop:250
      },
      textInputStyle: {
        height: 40,
        borderWidth: 0.5,
        paddingLeft: 20,
        margin: 5,
        borderColor: 'gray',
        backgroundColor: '#FFFFFF',
        width:'85%',
        alignSelf:'center',
        textAlign:'center',
        borderRadius:10,
        marginTop:30
      }
})