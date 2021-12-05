import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

import DiseaseCard from '../components/diseasecard'
import COLORS from '../config/color.js'

export default function DiseasePage({navigation}) {
    return (
        <View>
            <Text style={styles.txtTitle} >Penyakit Udang</Text>
            <DiseaseCard />
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
