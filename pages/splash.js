import React, {useEffect} from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

import apiConfig from '../config/api'
import COLORS from '../config/color';

export default function SplashPage({navigation}) {

    const storeData = async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('authToken', jsonValue)
        } catch (e) {
            sonsole.log(e)
        }
    }

    useEffect(() => {
        storeData(apiConfig.authToken);
        setTimeout(()=>{
            navigation.navigate('Home')
        },3000)
    }, []);

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={()=>navigation.navigate('Home')} >
                <Image source={require('../asset/logo.png')} resizeMode={'contain'} style={styles.img} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#2f80ed',
        alignItems:'center',
        justifyContent:'center'
    },
    img:{
        width:250,
        height:250
    }
})
