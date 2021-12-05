import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

import NewsCard from '../components/newscard'
import COLORS from '../config/color.js'

export default function NewsPage({navigation}) {
    return (
        <View>
            <Text style={styles.txtTitle} >Kabar terbaru</Text>
            <NewsCard/>
        </View>
    )
}

const styles = StyleSheet.create({
    txtTitle:{
        color:COLORS.dBlue,
        height:'7%',
        fontSize:20,
        fontWeight:'700',
        paddingLeft:'6%',
        paddingTop:'3%'
    }
})
