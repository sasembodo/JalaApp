import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Share } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

import apiConfig from './config/api';

import SplashPage from './pages/splash';
import PricePage from './pages/price';
import NewsPage from './pages/news';
import DiseasePage from './pages/disease';
import PriceDetailPage from './pages/pricedetail';
import COLORS from './config/color';

export default function App() {

  const onShare = async id => {
    try {
        const result = await Share.share({
            message:apiConfig.baseURL+'/posts/'+id,
        });
        if (result.action === Share.sharedAction) {
            if (result.activityType) {} 
            else {}
        } else if (result.action === Share.dismissedAction) {
        }
    } catch (error) {
        alert(error.message);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" >
        <Stack.Screen name="Splash" component={SplashPage} options={{headerShown:false}} />
        <Stack.Screen name="Home" component={MyTabs} options={{
          title:'Jala Media',
          headerStyle:{backgroundColor:COLORS.lBlue},
          headerTintColor:COLORS.white
          }} />
        <Stack.Screen name="PriceDetail" component={PriceDetailPage} options={({ route }) => ({
           title:'Harga Udang',
           headerStyle:{backgroundColor:COLORS.lBlue},
           headerTintColor:COLORS.white,
           headerRight:()=>(
             <TouchableOpacity onPress={()=>onShare(route.params.priceId)}>
               <Icon name='share' size={20} color={COLORS.white} />
             </TouchableOpacity>
           )
          })}/>
          
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const MyTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Price" component={PricePage} options={{title:'Harga Udang'}} />
      <Tab.Screen name="News" component={NewsPage} options={{title:'Kabar Udang'}} />
      <Tab.Screen name="Disease" component={DiseasePage} options={{title:'Penyakit'}} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({})
