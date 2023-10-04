import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Foundation } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons'; 

import SearchUsersScreen from './screens/SearchUsersScreen'
import ScannerScreen from './screens/ScannerScreen'

const Tab = createBottomTabNavigator();

const MainNavigator = () => {

  return(
    <>
    <NavigationContainer>
    <Tab.Navigator
    initialRouteName='ScannerScreen'
    screenOptions={({route}) =>({
      tabBarActiveTintColor:'#DA8221',
      headerStyle:{backgroundColor:'#DA8221'},
      headerTitleAlign:'center',
      tabBarInactiveBackgroundColor:'#DA8221',
      tabBarLabelStyle:{color:'black'},
      tabBarActiveBackgroundColor:'#fa8401',
      tabBarShowLabel:true,
      headerShown:false,
      tabBarIcon: ({focused, size, color })=>{
        let iconName;
        if(route.name === 'ScannerScreen'){
          iconName = 'qr-code-scanner'
          size = focused ? 32 : 35
          return (<MaterialIcons name={iconName} size={size} color="#000000" />)
        }
        if(route.name === 'SearchUsersScreen'){
          iconName = 'magnifying-glass'
          size = focused ? 30 : 32
          return (<Foundation name={iconName} size={size} color="#000000" />)
        } 
      }
    })
    }>
    <Tab.Screen name='ScannerScreen'component={ScannerScreen} options={{ tabBarLabel: 'Scanner',unmountOnBlur:false}} />
    <Tab.Screen name='SearchUsersScreen'   component={SearchUsersScreen} options={{ tabBarLabel: 'Buscar', unmountOnBlur:true}} />
    </Tab.Navigator>
    </NavigationContainer>
  </>
  )}

export default MainNavigator;