import React from 'react';
import { createAppContainer, createSwitchNavigator,} from 'react-navigation';
import HomeScreen from './screens/HomeScreen';
import WelcomeScreen from './screens/WelcomeScreen'
import {AppStackNavigator} from './components/AppStackNavigation'

export default function App() {
  return (
    <AppContainer/>
  );
}


const SwitchNavigator = createSwitchNavigator({
    
   HomeScreen:HomeScreen,
   AppStackNavigator:AppStackNavigator,
  
})

const AppContainer = createAppContainer(SwitchNavigator)