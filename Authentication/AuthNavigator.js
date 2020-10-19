import React, { Component } from 'react';
import {View , Text , Button ,Image, ScrollView,TouchableHighlight} from 'react-native';
import { createAppContainer } from "react-navigation";
import { createStackNavigator, CardStyleInterpolators } from 'react-navigation-stack';

import LoginScreen from "../Authentication/LoginScreen";
import RegisterScreen from "../Authentication/RegisterScreen";
import Dashboard from "../Screens/Dashboard";
import PaymentScreen from "../Screens/PaymentScreen";
import DeleteAccountConfirmation from "../Screens/DeleteAccountConfirmation";
import WebScreen from "../Screens/WebScreen";
import NewPassword from "../Authentication/NewPassword";
import ForgotPassword from "../Authentication/ForgotPassword";
import RegisterSms from "../Authentication/RegisterSms";
import BorrowScreen from '../Screens/BorrowScreen';

import ReturnScreen from '../Screens/ReturnScreen';
import Tutorial from '../Screens/Tutorial';
import TermsAndCondition from "../Authentication/TermsAndCondition";
import CreditCardScreen from '../Screens/CreditCardScreen';
import VerifyRestaurant from '../Authentication/VerifyRestaurant';
const AuthNavigator = createStackNavigator({
  
  Dashboard : {
        screen:Dashboard ,
        navigationOptions:()=>({
          headerShown:false,    
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, 
      }),
      
      },LoginScreen: {
        screen: LoginScreen,
        navigationOptions:()=>({
          headerShown:false,    
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      })
    },RegisterScreen: {
      screen: RegisterScreen,
      navigationOptions:()=>({
        headerShown:false,  
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,  
    })

  },BorrowScreen: { screen: BorrowScreen ,
    navigationOptions:()=>({
      headerShown:false
  })},ReturnScreen: { screen: ReturnScreen,
    navigationOptions:()=>({
      headerShown:false,    
  }), },WebScreen: {
  screen: WebScreen,
  navigationOptions:()=>({
    headerShown:false,    
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
})
},NewPassword: {
  screen: NewPassword,
  navigationOptions:()=>({
    headerShown:false,   
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
     
})
},ForgotPassword: {
  screen: ForgotPassword,
  navigationOptions:()=>({
    headerShown:false,   
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, 
})
},RegisterSms: {
  screen: RegisterSms,
  navigationOptions:()=>({
    headerShown:false,    
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
})
},DeleteAccountConfirmation: {
  screen: DeleteAccountConfirmation,
  navigationOptions:()=>({
    headerShown:false,    
})
},PaymentScreen: {
  screen: PaymentScreen,
  navigationOptions:()=>({
    headerShown:false,   
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, 
})
},CreditCardScreen: {
  screen: CreditCardScreen,
  navigationOptions:()=>({
    headerShown:false,    
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
})
},TermsAndCondition: {
  screen: TermsAndCondition,
  navigationOptions:()=>({
    headerShown:false,   
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, 
})
},VerifyRestaurant: {
  screen: VerifyRestaurant,
  navigationOptions:()=>({
    headerShown:false,    
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, 
})
},Tutorial: {
  screen: Tutorial,
  navigationOptions:()=>({
    headerShown:false,    
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, 
})
}
  },
      //stack settings
      {
      
      
       headerMode:'none',
        mode: 'modal',
        defaultNavigationOptions: { gesturesEnabled: false },
      }
);
  
export default createAppContainer(AuthNavigator);