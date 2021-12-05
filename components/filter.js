import React, {useState} from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';

import SizeModal from '../components/sizemodal'
import RegionModal from '../components/regionmodal'
import COLORS from '../config/color'

export default function Filter(props) {

    const {
        setPrice,
        size,
        setSize,
        region,
        setRegion,
    } = props

    const [sizeModalVisible, setSizeModalVisible] = useState(false);
    const [regionModalVisible, setRegionModalVisible] = useState(false);

    const sizeModalHandler = () => {
        setSizeModalVisible((sizeModalVisible) => sizeModalVisible = !sizeModalVisible )
    }

    const regionModalHandler = () => {
        setRegionModalVisible((regionModalVisible) => regionModalVisible = !regionModalVisible )
    }

    const truncateRegion = str => {
        let value = "INDONESIA"
        if(str){
            if(str.length > 7){
               value = str.substring(0, 7) + '...'
            }else{
               value = str
            }
        }
        return value;
    };

    return (
        <View style={styles.container}>
            <View style={styles.filter}>
                <View style={styles.btnFilterWrapper}>
                    <TouchableOpacity style={styles.btnFilterSize}
                    onPress={()=>sizeModalHandler()}
                    >
                        <Icon name='weight' size={16} color={COLORS.white} style={{paddingRight:10}} />
                        <View>
                            <Text style={[styles.txtBtnFilter,{fontSize:12}]}>Size</Text>
                            <Text style={styles.txtBtnFilter}>{size}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnFilterLocation}
                    onPress={()=>regionModalHandler()}
                    >
                        <Icon name='map-marker-alt' size={16} color={COLORS.white} style={{paddingRight:10}} />
                        <Text style={[styles.txtBtnFilter,{fontSize:16}]}>{truncateRegion(region.name)}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <SizeModal modalVisible={sizeModalVisible} setModalVisible={setSizeModalVisible} setSize={setSize}/>
            <RegionModal modalVisible={regionModalVisible} setModalVisible={setRegionModalVisible} setPrice={setPrice} setRegion={setRegion}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        justifyContent:'center'
    },
    filter:{
        zIndex:999,
        position:'absolute',
        bottom:60,
        left:'20%'
    },
    btnFilterWrapper:{
        flexDirection:'row',
        height:40,
        width:'75%',
        justifyContent:'center',
    },
    btnFilterSize:{
        flexDirection: 'row',
        width:'40%',
        height: 50,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:COLORS.dBlue,
        borderTopLeftRadius:25,
        borderBottomLeftRadius:25,
        elevation:10,
        shadowColor:COLORS.black
    },
    btnFilterLocation:{
        flexDirection: 'row',
        width:'60%',
        height: 50,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:COLORS.lBlue,
        borderTopRightRadius:25,
        borderBottomRightRadius:25,
        elevation:10,
        shadowColor:COLORS.black
    },
    txtBtnFilter:{
        color:COLORS.white,
        fontWeight:'700',
    }
})
