import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import { AppTabNavigator } from './AppTabNavigator'
import CustomSideBarMenu  from './CustomSideBarMenu';
import SettingScreen from '../screens/SettingScreen';
import MyDonationScreen from '../screens/MyDonationScreen';
import NotificationScreen from "../screens/NotificationScreen";
import MyRecievedBooks from '../screens/MyRecievedBooks';
import {Icon} from 'react-native-elements';
export const AppDrawerNavigator = createDrawerNavigator({
    Home : {
    screen : AppTabNavigator,
     navigationOptions:{
      drawerIcon : <Icon name="home" type ="fontawesome5" />
    }
    },
     MyDonations : {
    screen : MyDonationScreen,
     navigationOptions:{
      drawerIcon : <Icon name="gift" type ="fontawesome5" />
    }
    },
    Setting : {
    screen : SettingScreen,
     navigationOptions:{
      drawerIcon : <Icon name="settings" type ="fontawesome5" />
       drawerLabel : "Settings"
    }
   },
   MyRecievedBooks:{
     screen : MyRecievedBooks,
      navigationOptions:{
      drawerIcon : <Icon name="gift" type ="fontawesome5" />
    }
   },
   Notifications:{
     screen:NotificationScreen,
      navigationOptions:{
      drawerIcon : <Icon name="bell" type ="fontawesome5" />
    }
   }
},
  {
    contentComponent:CustomSideBarMenu
  },
  {
    initialRouteName : 'Home'
  })
