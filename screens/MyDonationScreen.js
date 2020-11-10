import React ,{Component} from 'react'
import {View, Text,TouchableOpacity,ScrollView,FlatList,StyleSheet} from 'react-native';
import {Card,Icon,ListItem,Input} from 'react-native-elements'
import MyHeader from '../components/MyHeader.js'
import firebase from 'firebase';
import db from '../config.js'


import { RFValue } from "react-native-responsive-fontsize";

export default class MyDonationScreen extends Component {
  static navigationOptions = { header: null };

   constructor(){
     super()
     this.state = {
       userId : firebase.auth().currentUser.email,
       allDonations : [],
       donorId:firebase.auth().currentUser.email,
       donorName:'',
     }
     this.requestRef= null
   }


   getAllDonations =()=>{
     this.requestRef = db.collection("all_donations")
     .where("donor_id" ,'==', this.state.userId)

     .onSnapshot((snapshot)=>{

       var allDonations = []
       snapshot.docs.map(document => {
         var donation = document.data()
         donation["doc_id"] = document.id
         allDonations.push(donation)
       });

       this.setState({
         allDonations : allDonations,
       });

     })

   }


   sendNotification=(bookDetails,requestStatus)=>{
   var requestId = bookDetails.request_id
   var donorId = bookDetails.donor_id
   db.collection("all_notifications")
   .where("request_id","==",requestId)
   .where("donor_id","==",donorId).get()

   .then(
     snapshot=>{

      snapshot.forEach((doc)=>{

        var message = ''

        if (requestStatus==="Book Sent") {
          message=this.state.donorName + " send you book "
        }else{
          message = this.state.donorName + " has shown intrest in donating the book "
        }
        db.collection("all_notifications").doc(doc.id).update({
           "message":message,
           "notification_status":"unread",
           "date":firebase.firestore.FieldValue.serverTimestamp(),
       })

      })

     }

   )
   }

   sendBook=(bookDetails)=>{
      if (bookDetails.request_status==="Book Sent") {
        var requestStatus = "Donor Interested"
        db.collection("all_donations").doc(bookDetails.doc_id).update({
          "request_status":requestStatus
        })
        this.sendNotification(bookDetails,requestStatus)
      } else{
        var requestStatus = "Book Sent"
        db.collection("all_donations").doc(bookDetails.doc_id).update({
          "request_status":requestStatus
        })
        this.sendNotification(bookDetails,requestStatus)
      }
   }

   getDonorDetails=()=>{
     db.collection("users").where("email_id","==",this.state.donorId)
    .get().then(
    snapshot=>{
      snapshot.forEach((doc)=>{
      this.setState({donorName:doc.data().first_name + " " + doc.data().last_name})
      })
    }
  )
   }

   componentDidMount(){
     this.getAllDonations();
     this.getDonorDetails();
   }

   componentWillUnmount(){
     this.requestRef();
   }

   keyExtractor = (item, index) => index.toString()

   renderItem = ( {item, i} ) =>(
     <ListItem
       key={i}
       title={item.book_name}
       subtitle={"Requested By : " + item.requested_by +"\nStatus : " + item.request_status}
       leftElement={<Icon name="book" type="font-awesome" color ='#696969'/>}
       titleStyle={{ color: 'black', fontWeight: 'bold' }}
       rightElement={
           <TouchableOpacity style={styles.button} onPress={(item)=>{
             this.sendBook(item)
           }}>
             <Text style={{color:'#ffff'}}>Send Book</Text>
           </TouchableOpacity>
         }
       bottomDivider
     />
   )

   render(){
     return(
       <View style={{flex:1}}>
         <MyHeader navigation={this.props.navigation} title="My Donations"/>
         <View style={{flex:1}}>
           {
             this.state.allDonations.length === 0
             ?(
               <View style={styles.subtitle}>
                 <Text style={{ fontSize: 20}}>List of all book Donations</Text>
               </View>
             )
             :(
               <FlatList
                 keyExtractor={this.keyExtractor}
                 data={this.state.allDonations}
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
  button:{
    width:RFValue(100),
    height:RFValue(30),
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: RFValue(0),
       height: RFValue(8)
     },
    elevation : RFValue(16)
  },
  subtitle :{
    flex:1,
    fontSize: RFValue(20),
    justifyContent:'center',
    alignItems:'center'
  }
})
