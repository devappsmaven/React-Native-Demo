import React, { Component } from 'react';
import {View , Text , Button ,Image, ScrollView,TouchableHighlight} from 'react-native';
import { createAppContainer } from "react-navigation";
import { createStackNavigator, TransitionSpecs, HeaderStyleInterpolators, CardStyleInterpolators, TransitionPresets } from 'react-navigation-stack';

import LoginScreen from "../Authentication/LoginScreen";
import RegisterScreen from "../Authentication/RegisterScreen";
import Dashboard from "../Screens/Dashboard";
import WebScreen from "../Screens/WebScreen";
import PaymentScreen from "../Screens/PaymentScreen";
import DeleteAccountConfirmation from "../Screens/DeleteAccountConfirmation";
import NewPassword from "../Authentication/NewPassword";
import ForgotPassword from "../Authentication/ForgotPassword";
import RegisterSms from "../Authentication/RegisterSms";
import TermsAndCondition from "../Authentication/TermsAndCondition";
import BorrowScreen from '../Screens/BorrowScreen';
import ReturnScreen from '../Screens/ReturnScreen';
import CreditCardScreen from '../Screens/CreditCardScreen';
import VerifyRestaurant from '../Authentication/VerifyRestaurant';

const forFade = ({ current, closing }) => ({
  overlayStyle: {
    
    opacity: current.progress,
  },
});
const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};
const AppNavigator = createStackNavigator({
  
  LoginScreen: {
        screen: LoginScreen,
        navigationOptions:()=>({
          headerShown:false,    
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
         
      }),
      },RegisterScreen: {
        screen: RegisterScreen,
        navigationOptions:()=>({
          headerShown:false,  
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          // ...TransitionPresets.SlideFromRightIOS
      })
    },BorrowScreen: { screen: BorrowScreen ,
      navigationOptions:()=>({
        headerShown:false
    })},ReturnScreen: { screen: ReturnScreen,
      navigationOptions:()=>({
        headerShown:false,    
       
    }), },Dashboard: {
      screen: Dashboard,
      navigationOptions:()=>({
        headerShown:false, 
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,    
    })
  },WebScreen: {
  screen: WebScreen,
  navigationOptions:()=>({
    headerShown:false,    
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
}
  },
      //stack settings
      {
       
      
       headerMode:'none',
        mode: 'card',
        cardOverlayEnabled: true,
         ...TransitionPresets.SlideFromRightIOS,
        defaultNavigationOptions: { gesturesEnabled: false },
      }
);
  
export default createAppContainer(AppNavigator);