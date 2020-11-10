import React from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    TouchableOpacity, 
    ScrollView, 
    KeyboardAvoidingView,
    Alert,
    TextInput, 
    Modal,
    FlatList,
} from 'react-native';
import db from "../config";
import firebase from "firebase";
import { ListItem } from 'react-native-elements'
import MyHeader from '../components/MyHeader'

import { RFValue } from "react-native-responsive-fontsize";


export default class MyRecievedBooks extends React.Component {
    constructor(){
        super()
        this.state = {
          userId:firebase.auth().currentUser.email,
          Recieved_Books : []
        }
      this.requestRef= null
      }
      
  MyRecievedBooks=()=>{
   this.requestRef =  db.collection("recieved_books")
   .where("email_id","==",this.state.userId)
   .where("book_status","==","recieved")
    .onSnapshot((snapshot)=>{
      var Recieved_Books = snapshot.docs.map(document => document.data())
      this.setState({Recieved_Books:Recieved_Books})
    })
  }

  componentDidMount=()=>{
    this.MyRecievedBooks();
  }
   
  keyExtractor = (item, index) => index.toString()

    renderItem = ({ item, i }) => {
        return(
            <ListItem
                key={i}
                title={item.book_name}
                subtitle={item.book_status}
                titleStyle={{color:"black", fontWeight:"bold"}}
                rightElement={
                   <TouchableOpacity style={styles.button}>
                   <Text style={{color:'#ffff'}}>Recieved</Text>
                   </TouchableOpacity>
                }
                bottomDivider
            />
        )
    }
  render(){
      return(
         <View style={{flex:1}}>
                <MyHeader title="Recieved Books" navigation={this.props.navigation}/>
                <View style={{flex:1}}>
                    {
                        this.state.Recieved_Books.length === 0 ? 
                        (
                            <View style={styles.subContainer}>
                                <Text style={{fontSize:RFValue(20)}}>List Of All Recieved Items</Text>
                            </View>
                        ) 
                        :(
                            <FlatList
                                data={this.state.Recieved_Books}
                                keyExtractor={this.keyExtractor}
                                renderItem={this.renderItem}
                            />
                        )
                    }
                </View>
            </View>
      )
  }
}

const styles = StyleSheet.create({
    subContainer : {
        flex:1, 
        fontSize:RFValue(20),
        justifyContent:"center",
        alignItems:"center"
    },
     button:{
      width:"15%",
      height:RFValue(50),
      justifyContent:'center',
      alignItems:'center',
      borderRadius:RFValue(10),
      backgroundColor:"#ff5722",
      shadowColor: "#000",
      shadowOffset: {
         width: RFValue(0),
         height: RFValue(8),
      },
      shadowOpacity: RFValue(0.44),
      shadowRadius: RFValue(10.32),
      elevation: RFValue(16),
      marginTop:RFValue(20)
      }
})