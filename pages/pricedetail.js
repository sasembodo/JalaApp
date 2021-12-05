import React, {useEffect, useState} from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ActivityIndicator, Linking } from 'react-native'
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';

import apiConfig from '../config/api';
import COLORS from '../config/color';

export default function PriceDetailPage({ route, navigation }) {

    const { priceId } = route.params;

    const [isLoading, setIsLoading] = useState(true);
    const [price, setPrice] = useState({});

    const apiCall = () =>{
        const url = apiConfig.baseURL + 'api/shrimp_prices/' + priceId + '?with=region,creator&region_id='
        axios.get(url)   
        .then(response => {
            setPrice(response.data.data);
            setIsLoading(false)
        })   
        .catch((error) => {
            console.log('error ' + error);   
        });
    }

    const numberWithCommas = number => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    useEffect(() => {
        apiCall();
    }, []);

    const convertDate = dateStr =>{
        let result = dateStr.split(" ")[0]
      
          const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
          "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];
    
          result = result.split("-")
        result = `${result[2]} ${monthNames[parseInt(result[1])-1]} ${result[0]}`
        return result
    }

    const priceList = data =>{
        let priceData = []
        for(let i=20;i<=200;i+=10){
            const priceVal = data["size_"+i]
            if(priceVal){
                priceData.push({
                    "size": i,
                    "price": priceVal
                })
            }
        }

        return (
            <View>
                {priceData.map((item, index)=>{
                    return (
                        <View style={styles.pricePool} key={index}>
                            <Text style={styles.txtSize}>Size {item.size}</Text>
                            <Text >Rp {numberWithCommas(item.price)}</Text>
                        </View>
                    )
                })}
            </View>
        )
        
    }

    return (
        <ScrollView style={styles.container}>
            {isLoading?(
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={COLORS.lBlue} />
                </View>
            ):(
                <View>
                    <View style={styles.location}>
                        <Text style={styles.txtProv}>{price.region.province_name}</Text>
                        <Text style={styles.txtCity}>{price.region.regency_name}</Text>
                    </View>
                    <View style={{backgroundColor:COLORS.light, height:4}}></View>
                    <View style={styles.content}>
                        <View style={styles.card}>
                            <View style={styles.lBlock}>
                                <Text style={styles.txtDate}>{convertDate(price.date)}</Text>
                                <View style={styles.main}>
                                    <Image source={{ uri : apiConfig.baseURL + 'storage/' + price.creator.avatar }} 
                                    resizeMode={'contain'} 
                                    style={{width:50, height:50, borderRadius:250}} />
                                    <View style={styles.title}>
                                        <Text style={styles.txtSupp} >Supplier</Text>
                                        <Text style={styles.txtName} >{price.creator.name}</Text>
                                    </View>
                                </View>
                                <Text style={styles.txtSupp} >Kontak</Text>
                                <Text style={styles.txtContact} >{price.creator.phone.slice(0, -3) + 'XXX'}</Text>
                            </View>
                            <View style={styles.rBlock}>
                                {
                                    price.creator.buyer?
                                    <View style={[styles.verifiedWrapper,{backgroundColor:'#FFF8E7'}]}>
                                        <View style={{width:20,height:20,backgroundColor:'#F6A62C',borderRadius:10}}>
                                            <Icon name='star' size={20} color={'#FFF8E7'} />
                                        </View>
                                        <Text style={styles.txtVerified}>Terverifikasi</Text>
                                    </View>
                                    :
                                    <View style={[styles.verifiedWrapper,{backgroundColor:'#E5E5E5'}]}>
                                        <Text style={styles.txtVerified}>Belum Verifikasi</Text>
                                    </View>
                                }
                                <TouchableOpacity style={styles.button} onPress={()=>{Linking.openURL(`tel:${price.creator.phone}`);}}>
                                    <View>
                                        <Text style={styles.txtButton}>Hubungi</Text>
                                    </View>
                                </TouchableOpacity>                        
                            </View>
                        </View>
                        <Text style={styles.txtSubtitle}>Daftar Harga</Text>
                            {priceList(price)}
                        {price.remark?
                            <View>
                                <Text style={styles.txtSubtitle}>Catatan</Text>
                                <Text>{price.remark}</Text>
                            </View>
                        :
                            <View></View>
                        }
                    </View>
                </View>
            )}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:COLORS.clean,
    },
    location:{
        paddingVertical:10,
        paddingHorizontal:'5%',
        marginBottom:4
    },
    content:{
        height:'100%',
        paddingHorizontal:'5%',
        paddingVertical:15
    },
    card:{
        flexDirection:'row',
    },
    main:{
        flexDirection:'row',
        paddingVertical:10
    },
    title:{
        paddingLeft:10
    },
    lBlock:{
        width:'60%'
    },
    rBlock:{
        width:'40%',
        alignItems:'center'
    },
    verifiedWrapper:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        height:26,
        paddingHorizontal:5,
        borderRadius:15,
    },
    pricePool:{
        flexDirection:'row'
    },
    button:{
        backgroundColor:COLORS.lBlue,
        borderRadius:5,
        width:'80%',
        height:30,
        alignItems:'center',
        justifyContent:'center',
        position:'absolute',
        bottom:10,
    },
    loading:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    txtSize:{
        width:120
    },
    txtSupp:{
        color:'#859ED1',
        fontSize:12,
        fontWeight:'400'
    },
    txtName:{
        color:COLORS.black,
        fontSize:14,
        fontWeight:'600'
    },
    txtProv:{
        color:COLORS.black,
        fontSize:16,
        fontWeight:'700'
    },
    txtCity:{
        color:COLORS.dark,
        fontSize:16,
        fontWeight:'600'
    },
    txtDate:{
        color:COLORS.dark,
        fontSize:14,
        fontWeight:'400'
    },
    txtContact:{
        color:COLORS.black,
        fontSize:16,
        fontWeight:'700'
    },
    txtSubtitle:{
        color:COLORS.black,
        fontSize:16,
        fontWeight:'700',
        marginVertical:5
    },
    txtVerified:{
        marginHorizontal:10,
        fontSize:12
    },
    txtButton:{
        color:COLORS.white,
        fontSize:14,
        fontWeight:'600'
    },
})
