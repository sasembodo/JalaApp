import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, Text, Pressable, View, Dimensions, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons'

import COLORS from "../config/color";
import apiConfig from '../config/api';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export default function RegionModal (props) {
  const {
        modalVisible,
        setModalVisible,
        setPrice,
        setRegion
    } = props

  const [textFilter, onChangeTextFilter] = useState("");
  const [regionList, setRegionList] = useState([]);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [notFound, setNotFound] = useState(false);

  const apiCall = () =>{
    const url = apiConfig.baseURL + 'api/regions?per_page=15&page='+pageCurrent+'&has=shrimp_prices&search=' + textFilter
    axios.get(url)   
    .then(response => {
        setRegionList([...regionList, ...response.data.data]);
        if(!response.data.data.length){
          setNotFound(true)
        }else{
          setNotFound(false)
        }
     })   
    .catch((error) => {
        console.log('error ' + error);   
    });
  }

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  const handleLoadMore = () =>{
    setPageCurrent(pageCurrent+1)
  }

  const handleTextFilter = str =>{
    onChangeTextFilter(str)
    setPageCurrent(1)
    setRegionList([])
  }

  useEffect(() => {
     apiCall();
  }, [textFilter, pageCurrent]);

  const regionSelect = () =>{
    if (!notFound){
        return (
            <ScrollView style={styles.scrollRegion}
            onScroll={({nativeEvent}) => {
                if (isCloseToBottom(nativeEvent)) {
                    handleLoadMore()
                }
            }}
            scrollEventThrottle={400}
            >
                {regionList.map((item, index)=>{
                    return (
                        <TouchableOpacity key={index} style={styles.regionItem}
                        onPress={() => {
                            setRegion({
                                "id": item.id,
                                "name": item.name
                            })
                            setPrice([])
                            setModalVisible(!modalVisible)
                        }}>
                            <Text>
                                {item.province_name ? item.province_name : ''}
                                {item.regency_name ? ', ' + item.regency_name : ''}
                                {item.name ? ', ' + item.name : ''}
                            </Text> 
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        )
    }else{
        return (
            <View style={styles.regionItem}>
                <Text>Wilayah tidak ditemukan</Text>
            </View>
        )
    }
  }

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
            setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.header}>
                <Text style={styles.modalText}>Kota/Kabupaten</Text>
                <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
                >
                    <Text style={styles.textStyle}>Tutup</Text>
                </Pressable>
            </View>
            <View style={styles.filterBar}>
              <View style={styles.inputWrapper}>
                <View style={styles.iconInput} >
                  <Icon name='search' size={20} />
                </View>
                <TextInput
                  style={styles.input}
                  onChangeText={e=>handleTextFilter(e)}
                  value={textFilter}
                  placeholder="Cari"
              />
              </View>
              <TouchableOpacity onPress={()=>onChangeTextFilter("")} style={styles.btnCancel} >
                <Icon name='cancel' size={20} />
              </TouchableOpacity>
            </View>
            <View style={styles.horizontalRuler}/>
            {regionSelect()}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    width: width,
    flexDirection: 'column',
    height: height,
    top: 120,
    margin: 20,
    paddingBottom:80,
    backgroundColor: "white",
    borderWidth:0.5,
    borderColor:COLORS.black,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  header:{
      width: width,
      paddingHorizontal:20,
      height: 40,
      alignItems:'center',
      flexDirection: "row",
      justifyContent: "space-between"
  },
  textStyle: {
    color: COLORS.lBlue,
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    fontWeight: "bold",
    textAlign: "center"
  },
  horizontalRuler:{
    borderBottomColor: COLORS.black,
    borderBottomWidth: 0.5,
    alignSelf:'stretch'
  },
  scrollRegion:{
      padding: 10,
      alignSelf: 'flex-start',
      alignSelf:'stretch'
  },
  regionItem:{
      padding: 10
  },
  filterBar: {
    flexDirection: 'row',
    margin: 10
  },
  inputWrapper: {
    flexDirection:'row',
    height: 40,
    width: '75%',
    borderWidth: 0.5,
    borderRadius: 5,
  },
  input:{
    height: 40,
    width: '75%',
    padding: 10,
    paddingLeft:0

  },
  iconInput:{
    width:40,
    alignItems:'center',
    justifyContent:'center'
  },
  btnCancel:{
    alignItems:'center',
    justifyContent:'center',
    padding:10
  },
});
