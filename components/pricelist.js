import React, {useEffect, useState} from 'react'
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';

import apiConfig from '../config/api';
import COLORS from '../config/color';

export default function PriceList(props) {
    const {
        price,
        setPrice,
        size,
        region
    } = props
    
    const [isLoading, setIsLoading] = useState(false);
    const [pageCurrent, setPageCurrent] = useState(1);
    const navigation = useNavigation();

    const apiCall = async () =>{
        setIsLoading(true)
        const url = apiConfig.baseURL + 'api/shrimp_prices?per_page=15&page=' + pageCurrent + '&with=region,creator&region_id=' + region.id
        console.log(url)
        axios.get(url)   
        .then(response => {
            setPrice([...price, ...response.data.data]);
            setIsLoading(false)
        })   
        .catch((error) => {
            setIsLoading(false)
            console.log('error ' + error);   
        });
    }

    const numberWithCommas = number => {
        let value = "";
        if(number){
            value = "IDR " + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
        return value
    }

    const handleLoadMore = () =>{
        if(price.filter(p => p["size_"+size]).length > 2){
            setPageCurrent(pageCurrent+1)
        }
    }

    useEffect(() => {
        setPageCurrent(1)
    }, [region])

    const loadingView = () =>{
        if(isLoading){
            return (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={COLORS.lBlue} />
                </View>
            )
        }else if(!price.filter(p => p["size_"+size]).length){
            return (
                <View>
                    <Text style={styles.txtEmpty}>Supllier Tidak ditemukan</Text>
                </View>
            )
        }else{
            return (
                <View></View>
            )
        }
    }

    const convertDate = dateStr =>{
        let result = dateStr.split(" ")[0]
      
        const monthNames = [
          "Januari", "Februari", "Maret", "April", "Mei", "Juni",
          "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];
    
        result = result.split("-")
        result = `${result[2]} ${monthNames[parseInt(result[1])-1]} ${result[0]}`
        return result
    }

    useEffect(() => {
        apiCall();
    }, [region, pageCurrent]);

    return (
        <View style={styles.container}>
            {price.filter(p => p["size_"+size]).length ? (
                <FlatList
                    data={price}
                    contentContainerStyle={{ paddingBottom:55}}
                    renderItem={({item,index}) =>{
                        if(item["size_"+size]){
                            return(
                                <View style={styles.card}>
                                    <View style={styles.lBlock}>
                                        <View style={styles.main}>
                                            <Image source={{ uri : apiConfig.baseURL + 'storage/' + item.creator.avatar }} 
                                            resizeMode={'contain'} 
                                            style={{width:50, height:50, borderRadius:250}} />
                                            <View style={styles.title}>
                                                <Text style={styles.txtSupp} >Supplier</Text>
                                                <Text style={styles.txtName} >{item.creator.name}</Text>
                                            </View>
                                        </View>
                                        <Text style={styles.txtSupp} >{convertDate(item.date)}</Text>
                                        <Text style={styles.txtProv} >{item.region.province_name}</Text>
                                        <Text style={styles.txtCity} >{item.region.name}</Text>
                                        <Text style={styles.txtSupp} >size {size}</Text>
                                        <Text style={styles.txtPrice} >{numberWithCommas(item["size_"+size])}</Text>
                                    </View>
                                    <View style={styles.rBlock}>
                                        {
                                            item.creator.buyer?
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
                                        <TouchableOpacity style={styles.button} onPress={() => {
                                            navigation.navigate('PriceDetail', {
                                                'priceId':item.id,
                                            })
                                        }}>
                                            <View>
                                                <Text style={styles.txtButton}>Lihat Detail</Text>
                                            </View>
                                        </TouchableOpacity>                        
                                    </View>
                                </View>
                            )
                        }
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={2}
                    ListFooterComponent={()=>loadingView()}
                />
            ) : (
                <View>
                    {loadingView()}
                </View>
            )
        }
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        height:'93%'
    },
    card:{
        borderWidth:0.5,
        borderColor:COLORS.light,
        flexDirection:'row',
        borderRadius:5,
        backgroundColor:COLORS.clean,
        paddingHorizontal:'3%',
        paddingVertical:10,
        marginHorizontal:'3%',
        marginVertical:10
    },
    main:{
        flexDirection:'row',
        paddingBottom:5
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
        fontSize:12,
        fontWeight:'500'
    },
    txtCity:{
        color:COLORS.black,
        fontSize:18,
        fontWeight:'700'
    },
    txtPrice:{
        color:COLORS.black,
        fontSize:22,
        fontWeight:'800'
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
    txtEmpty:{
        margin:50,
        fontWeight: "bold",
        textAlign: "center"
    }
})
