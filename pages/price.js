import React, {useState} from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

import PriceList from '../components/pricelist'
import Filter from '../components/filter'
import COLORS from '../config/color'

export default function PricePage({navigation}) {

    const [size, setSize] = useState(100);
    const [region, setRegion] = useState({});

    return (
        <View style={styles.container}>
            <Text style={styles.txtTitle} >Harga Terbaru</Text>
            <PriceList size={size} region={region}/>
            <Filter size={size} setSize={setSize} region={region} setRegion={setRegion}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        height:'100%'
    },
    txtTitle:{
        color:COLORS.dBlue,
        textAlign:'center',
        height:'7%',
        fontSize:20,
        fontWeight:'700',
        paddingTop:'3%'
    }
})
