import React, { useState, useEffect } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import COLORS from "../config/color";

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export default function SizeModal (props) {
  const {
        modalVisible,
        setModalVisible,
        setSize
    } = props

  const priceList = () =>{
    let list = []
    
    for(let i=20; i<=200; i+=10){
        list.push(i)
    }

    return (
        <ScrollView style={styles.scrollPrice}>
            {list.map((item, index)=>{
                return (
                    <TouchableOpacity key={index} style={styles.priceItem}
                    onPress={() => {
                        setSize(item)
                        setModalVisible(!modalVisible)
                    }}>
                       <Text>{item}</Text> 
                    </TouchableOpacity>
                )
            })}
        </ScrollView>
    )
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
                <Text style={styles.modalText}>Size</Text>
                <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
                >
                    <Text style={styles.textStyle}>Tutup</Text>
                </Pressable>
            </View>
            <View style={styles.horizontalRuler}/>
            {priceList()}
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
    top: 50,
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
  scrollPrice:{
      padding: 10,
      alignSelf: 'flex-start',
      alignSelf:'stretch'
  },
  priceItem:{
      padding: 10
  }
});
