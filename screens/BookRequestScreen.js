import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  TouchableHighlight,
  FlatList
  } from 'react-native';

import {SearchBar,ListItem,Input} from 'react-native-elements'
import {BookSearch} from 'react-native-google-books';

import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'


import { RFValue } from "react-native-responsive-fontsize";
var email;

export default class BookRequestScreen extends Component{
  constructor(){
    super();
    this.state ={
      userId : firebase.auth().currentUser.email,
      bookName:"",
      reasonToRequest:"",

      isBookRequestActive:'',
      requestedBookName:'',
      bookStatus:'',
      requestId:'',
      userDocId:'',
      docId:'',

      imageLink:"",
      dataSource:'',
      showFlatlist:false   
    }
  }

   getIsBookRequestActive = async () => {
  await db.collection("users")
  .where("email_id","==",this.state.userId)
  .onSnapshot((snapshot)=>{

   snapshot.forEach((doc)=>{

     this.setState({
       isBookRequestActive:doc.data().getIsBookRequestActive,
       userDocId:doc.id,
     })

   })

  })
  }
  
   getBookRequest=async()=>{
    await db.collection("requested_books")
     .where("email_id","==",this.state.userId)
     .onSnapshot((snapshot)=>{
       snapshot.forEach((doc)=>{
          if(doc.data().book_status!=="recieved"){
            this.setState({
              requestId:doc.data().request_id,
              requestedBookName:doc.data().book_name,
              bookStatus:doc.data().book_status,
              docId:doc.id
            })
          }
       })
     })
   }
  

  sendNotification=()=>{
  //to get the first name and last name
  db.collection('users').where('email_id','==',this.state.userId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      var name = doc.data().first_name
      var lastName = doc.data().last_name

      // to get the donor id and book nam
      db.collection('all_notifications').where('request_id','==',this.state.requestId).get()
      .then((snapshot)=>{
        snapshot.forEach((doc) => {
          var donorId  = doc.data().donor_id
          var bookName =  doc.data().book_name

          //targert user id is the donor id to send notification to the user
          db.collection('all_notifications').add({
            "targeted_user_id" : donorId,
            "message" : name +" " + lastName + " received the book " + bookName ,
            "notification_status" : "unread",
            "book_name" : bookName
          })
        })
      })
    })
  })
}

   updateBookRequestStatus=async()=>{
    await db.collection("requested_books")
    .doc(this.state.docId).update({
      book_status:"recieved"
    })
    
    await db.collection("users").where("email_id","==",this.state.userId)
    .onSnapshot((snapshot)=>{
      snapshot.forEach((doc)=>{
         db.collection("users").doc(doc.id).update({
          isBookRequestActive:false
        })
      })
    })
   }
    
   recievedBook= async (bookName)=>{
    var userId = this.state.userId
    var requestId = this.state.requestId
    await db.collection("recieved_books").add({
      "user_id":userId,
      "book_name":bookName,
      "request_id":requestId,
      "book_status":"recieved"
    })
   }

   componentDidMount=()=>{
     this.getBookRequest();
     this.getIsBookRequestActive();
   }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }

  addRequest =async(bookName,reasonToRequest)=>{
    var userId = this.state.userId
    var randomRequestId = this.createUniqueId()
    var books = await BookSearch.searchbook(
      bookName,
      "AIzaSyCdc1Xasp0_dzpaGEPZ5G91QHM7fEDBhoc"
    );

    db.collection('requested_books').add({
        "user_id": userId,
        "book_name":bookName,
        "reason_to_request":reasonToRequest,
        "request_id"  : randomRequestId,
        "book_status":"requested",
        "date":firebase.firestore.FieldValue.serverTimestamp(),
    })
    await this.getBookRequest();
    db.collection("users")
      .where("email_id", "==", userId)
      .get()
      .then()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection("users").doc(doc.id).update({
            IsBookRequestActive: true,
          });
        });
      });

    this.setState({
        bookName :'',
        reasonToRequest : '',
        IsBookRequestActive:true
    })

    return Alert.alert("Book Requested Successfully")
  }


  getBooksFromAPI=async(bookName)=>{
     this.setState({bookName:bookName,})
     if(bookName.length>2){
       var books = await BookSearch.searchbook(bookName,"AIzaSyCdc1Xasp0_dzpaGEPZ5G91QHM7fEDBhoc")
     this.setState({dataSource:books.data,showFlatlist:true})
     }
    
 
  }


   renderItem=({item,i})=>{
   let obj = {
     title:item.volumeInfo.title,
     selfLink:item.selfLink,
     buyLink:item.buyLink,
     imageLink:item.volumeInfo.imageLinks
     }
     return(
       <TouchableHighlight style={{
         alignItems:"center",
         backgroundColor:"#dbdbdb",
         width:"90%",
         }} 
         activeOpacity={RFValue(0.6)}
         underlayColor="#dbdbdb"
         onPress={()=>{
           this.setState({
           showFlatlist:false,
           bookName:item.volumeInfo.title
           })
         }}
          bottomDivider
         >
         <Text>{item.volumeInfo.title}</Text>
         
       </TouchableHighlight>
     )
   }


  render(){

    if(this.state.IsBookRequestActive === true){
      return(

        // Status screen

        <View style = {{flex:1,justifyContent:'center'}}>
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
          <Text>Book Name</Text>
          <Text>{this.state.requestedBookName}</Text>
          </View>
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
          <Text> Book Status </Text>

          <Text>{this.state.bookStatus}</Text>
          </View>

          <TouchableOpacity style={{borderWidth:1,borderColor:'orange',backgroundColor:"orange",width:300,alignSelf:'center',alignItems:'center',height:30,marginTop:30}}
          onPress={()=>{
            this.receivedBooks(this.state.requestedBookName)
            this.updateBookRequestStatus();
            this.sendNotification()
          }}>
          <Text>I recieved the book </Text>
          </TouchableOpacity>
        </View>
      )
    }
    else
    {
    return(
      // Form screen
        <View style={{flex:1}}>
          <MyHeader title="Request Book" navigation ={this.props.navigation}/>
          <View>
              <Input
                style ={styles.formTextInput}
                placeholder={"enter book name"}
                onChangeText={(text)=>{
                  this.getBooksFromAPI(text)
                }}
                onClear={(text)=>{
                  this.getBooksFromAPI("")
                }}
                value={this.state.bookName}
              />
              {
                this.state.showFlatlist?
                (
                  <FlatList
                  data={this.state.dataSource}
                  renderItem={this.renderItem}
                  keyExtractor = {(item,index)=> index.toString()} 
                  enableEmptySections={true}
                  style={{
                  marginTop:10
                  }}
                  />
                ) : (
                  <View style={{alignItems:"center"}}>
                  <Text
                   style ={[styles.formTextInput,{height:300}]}
                   multiline
                   numberOfLines ={8}
                   placeholder={"Why do you need the book"}
                    onChangeText ={(text)=>{
                    this.setState({
                        reasonToRequest:text
                    })
                }}
                value ={this.state.reasonToRequest}
              />

               <TouchableOpacity
                style={styles.button}
                onPress={()=>{ this.addRequest(this.state.bookName,this.state.reasonToRequest);
                }}
                >
                <Text>Request</Text>
              </TouchableOpacity>
                  </View>
                )
              }
            </View>
        </View>
    )
  }
}
}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:RFValue(35),
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:RFValue(10),
    borderWidth:RFValue(1),
    marginTop:RFValue(20),
    padding:RFValue(10),
  },
  button:{
    width:"75%",
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
    },
  }
)