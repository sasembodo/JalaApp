import React, {useEffect, useState} from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Dimensions, Linking, Share, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { InAppBrowser } from 'react-native-inappbrowser-reborn'
import Icon from 'react-native-vector-icons/MaterialIcons';

import apiConfig from '../config/api';
import COLORS from '../config/color';

const deviceWidth = Dimensions.get('screen').width

export default function NewsCard({}) {

    const [authToken, setAuthToken] = useState({});
    const [news, setNews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pageCurrent, setPageCurrent] = useState(1);

    const openLink = async(url) => {
        try {
          if (await InAppBrowser.isAvailable()) {
            const result = await InAppBrowser.open(url, {
              showTitle: true,
              toolbarColor: COLORS.lBlue,
              secondaryToolbarColor: 'black',
              navigationBarColor: 'black',
              navigationBarDividerColor: 'white',
              enableUrlBarHiding: true,
              enableDefaultShare: true,
              forceCloseOnRedirection: false,
              animations: {
                startEnter: 'slide_in_right',
                startExit: 'slide_out_left',
                endEnter: 'slide_in_left',
                endExit: 'slide_out_right'
              },
              headers: {
                'my-custom-header': 'my custom header value'
              }
            })
          }
          else Linking.openURL(url)
        } catch (error) {
          consoel.log(error.message)
        }
      }

    const getAuthToken = async () => {
        try {
            const value = await AsyncStorage.getItem('authToken')
            if(value !== null) {
                return JSON.parse(value)
            }
        } catch(e) {
            console.log(e)
        }
    }

    const callApi = token =>{
        const url = apiConfig.baseURL + 'api/posts?per_page=15&page=' + pageCurrent + '&with=creator' 
        axios.get(url, { headers: token })   
        .then(response => {
            setNews([...news, ...response.data.data]);
            setIsLoading(false)
        })   
        .catch((error) => {
            setIsLoading(false)
            console.log('error ' + error);   
        });
    }

    const regexBody = txt =>{
        const regex = /(<([^>]+)>)/ig;
        const result = txt.replace(regex, '');
        return result
    }


    const convertDate = dateStr =>{
        let result = dateStr.split(" ")[0]
      
          const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
          "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];
    
          result = result.split("-")
        result = `${result[2]} ${monthNames[parseInt(result[1])-1]} ${result[0]}`
        return result
    }


    useEffect(() => {
        getAuthToken();

        let isMounted = true;

        getAuthToken().then(data => {
          if (isMounted) {
              callApi(data)
              setAuthToken(data);
          }
        })

        return () => { isMounted = false };
    }, [pageCurrent]);


    const onShare = async (txt) => {
        try {
            const result = await Share.share({
                message:apiConfig.baseURL+'/posts/'+txt,
            });
        } catch (error) {
            alert(error.message);
        }
    };


    const handleLoadMore = () =>{
        setPageCurrent(pageCurrent+1)
        setIsLoading(true)
    }

    const loadingView = () =>{
        if(isLoading){
            return (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={COLORS.lBlue} />
                </View>
            )
        }else{
            return (
                <View></View>
            )
        }
    }

    return (
        <View style={styles.container}>
            {news.length ? (
                <FlatList
                    data={news}
                    renderItem={({item,index}) =>
                        <View style={styles.card}>
                            <TouchableOpacity 
                            style={styles.main}
                            onPress={()=>openLink(apiConfig.baseURL + '/web_view/posts/' + item.id)}>
                                <View style={styles.imgWrapper}>
                                    <Image 
                                        source={item.image ? { uri : apiConfig.baseURL + 'storage/' + item.image} : require('../asset/photo.png')} 
                                        resizeMode={'cover'} 
                                        style={{
                                            width:'100%',
                                            height:'100%',
                                            borderTopRightRadius:15,
                                            borderTopLeftRadius:15
                                        }}
                                    />
                                </View>
                                <Text style={styles.txtTitle} >{item.title}</Text>
                            </TouchableOpacity>
                            <View style={styles.content}>
                                <Text numberOfLines={3} ellipsizeMode='tail' style={styles.txtContent}> 
                                    {regexBody(item.body)}
                                </Text>
                                <View style={styles.footer}>
                                    <Text>{convertDate(item.updated_at)}</Text>
                                    <TouchableOpacity onPress={()=>onShare(item.id)} >
                                        <Icon name='share' size={20} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    }
                    keyExtractor={(item, index) => index.toString()}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={2}
                    ListFooterComponent={()=>loadingView()}
                />
            ):(
                <View>
                    {loadingView()}
                </View>
            )}
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
        backgroundColor:COLORS.clean,
        marginHorizontal:'3%',
        marginVertical:10,
        borderRadius:15
    },
    imgWrapper:{
        width: deviceWidth*0.94,
        height: deviceWidth*0.67,
        aspectRatio: 1 * 1.4
    },
    content:{
        paddingHorizontal:'7%'
    },
    footer:{
        flexDirection:'row',
        justifyContent:'space-between',
        paddingVertical:20
    },
    loading:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    txtTitle:{
        paddingTop:15,
        paddingHorizontal:'7%',
        textAlign:'justify',
        fontSize:18,
        fontWeight:'bold'
    },
    txtContent:{
        textAlign:'justify',
        paddingTop:15
    },
})
