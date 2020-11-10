import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity, Dimensions,Animated} from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';
import {SwipeListView} from 'react-native-swipe-list-view'


import { RFValue } from "react-native-responsive-fontsize";
export default class SwipableFlatList extends React.Component{
    constructor(props){
     super(props)
     this.state={
       allNotifications:this.props.allNotifications
     }
    
    }

    updateMarkAsRead=(notification)=>{
        db.collection("all_notifications").doc(notification.doc_id).update({
            "notification_status":"read"
        })

    }



    onSwipeValueChange=(swipeData) => {
       var allNotifications =  this.state.allNotifications
       const {key,value} = swipeData    
       if (value<-Dimensions.get('window').width) {
           const newData = [...allNotifications]
           const preIndex = allNotifications.findIndex((item)=>{
               this.updateMarkAsRead(allNotifications[preIndex]);
               newData.splice(preIndex,1)
               this.setState({
                   allNotifications:newData
               })
           })
       } 
    }

    renderItem=(data)=>{
      <Animated.View>
       <ListItem
       title={data.item.book_name}
       titleStyle={{color:"black" ,fontWeight:"bold" , }}
       subtitle={data.item.message}
       leftComponent={
         <Icon name="book" type="font-awesome" color="#696969" />
       }
       bottomDivider
       />
      </Animated.View>
    }

    renderHiddenItem=()=>{
     <View style={styles.rowBack}>
      <View style={[styles.backTextWhite,styles.backRightBtnRight]}>
        <Text style={styles.backTextWhite}></Text>
      </View>
     </View>
    }
    render(){
        return(
            <View>
            <SwipeListView
            disableRigthSwipe
            data={this.state.allNotifications}
            renderItem={this.renderItem}
            renderHiddenItem={this.renderHiddenItem}
            rightOpenValue={-Dimensions.get('window').width}
            previewRowKey={"0"}
            previewOpenValue={-40}
            previewOpenDelay={3000}
            onSwipeValueChange={this.onSwipeValueChange()}
            />
            </View>
        )
    }
}

const styles = StyleSheet.create({ 
container: { backgroundColor: 'white', flex: 1, },
 backTextWhite: { color: '#FFF', fontWeight:'bold', fontSize:RFValue(15) }, 
 rowBack: { alignItems: 'center', backgroundColor: '#29b6f6', flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 15, },
 backRightBtn: { alignItems: 'center', bottom: RFValue(0), justifyContent: 'center', position: 'absolute', top:RFValue(0), width:RFValue(100), },
 backRightBtnRight: { backgroundColor: '#29b6f6', right: RFValue(0), }, 
 });