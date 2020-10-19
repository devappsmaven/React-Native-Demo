import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
import { Platform, Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo'
import GetLocation from 'react-native-get-location';

export const APP_HEADER_AND_PRIMARY_COLOR =  '#3E474A';
export const APP_DARK_HEADER_AND_PRIMARY_COLOR =  '#2B3336';
export const APP_THEME_COLOR = "#6cbf35";
export const INPUT_FIELD_COLOR = '#EFF2ED';
export const APP_TEXT_COLOR =  '#3E474A';
export const APP_BLUE_COLOR =  '#3B5998';
export const APP_BLACK_COLOR =  '#000000';
export const APP_WHITE_COLOR =  '#ffffff';
export const APP_GREY_COLOR =  '#979797';
export const APP_HIGHLIGHT_COLOR =  '#272E31';
export const APP_YELLOW_COLOR =  '#9B9414';
export const GRADIENT_YELLOW_SHADE =  '#F7E400';
export const GRADIENT_ORANGE_SHADE =  '#FACB00';
export const GRADIENT_DARK_ORANGE_SHADE =  '#FEA500';
export const APP_GREEN_COLOR =  '#049232';
export const APP_LIGHT_GREEN_COLOR =  '#1DB00A';
export const APP_RED_COLOR = '#f44336';
export const LIST_ITEM_BACKGROUND = '#2B3336';
export const LIGHT_BLUE = "#43ABEC";
export const LIGHT_SEA_GREEN = "#43ECCC";
export const LIGHT_YELLOW = "#F8D800";
export const LIGHT_GREEN = "#64DC8B";

export const APP_MAJOR_BACKGROUND_COLOR =  '#f6f6f6';
export const BOLD_COLOR = "#3f3f3f";
export const LINK_HIGHLIGHT_COLOR = "#80bd58";
export const NORMAL_COLOR = "#666666";
export const WHITE_BG_NO_BORDER = "#bbbbbb";
export const ERROR_COLOR = '#ec6666';


export const RED_COLOR = '#ec6666'
export const GREY_COLOR = '#ededed'
export const LIGHT_RED_COLOR = '#fdcccc'
export const GREEN_COLOR = '#ccfdcf'


export const REQUIRED = 'Required';
export const BUTTON_HEIGHT =  56;
export const BORDER_RADIUS = 30;
export const PROFILE_IMAGE_SIZE = 85;
export const PROFILE_IMAGE_HEADER_SIZE = 35;
export const PROFILE_BACK_HEADER_SIZE = 20;

export const INSTALLATION_TEXT = 14;
export const FONT_WEIGHT = '500';
// export const DEFAULT_IMAGE = 'http://139.59.77.223/1578636737648_placeholder@3x.png';
export const DEFAULT_IMAGE = 'https://dl3.pushbulletusercontent.com/AtYAwlDyxneT6pyw4OsTseULQiJXHBjl/placeholder@3x.png';
export const BACK_BUTTON_IMAGE = require("../../Assets/top_arrow.png")
export const CUSTOMER_IMAGE = require("../../Assets/top_arrow.png")
export const INSTALLER_IMAGE = require("../../Assets/top_arrow.png")
export const ADD_WITHOUT_SHADOW = require("../../Assets/top_arrow.png")
export const ADD_WITH_SHADOW = require("../../Assets/top_arrow.png")
export const INSTALLER_LOGIN_LOGO = require("../../Assets/top_arrow.png")
export const NOTIFICATION = require("../../Assets/top_arrow.png")
export const PHONE_ICON = require("../../Assets/top_arrow.png")
export const WALLET_SACK = require("../../Assets/top_arrow.png")
export const BACK_BUTTON_GREY = require("../../Assets/top_arrow.png")
export const RIGHT_ARROW = require("../../Assets/top_arrow.png")
export const INSTALLER_HOME_PLUS = require("../../Assets/top_arrow.png")
export const PROFILE_PLACEHOLDER = require("../../Assets/top_arrow.png")
export const OPEN_MENU = require("../../Assets/top_arrow.png")
export const WALLET_STAR_IMAGE = require("../../Assets/top_arrow.png")
export const ANALYTICS = require("../../Assets/top_arrow.png")
export const DOWN_IMAGE = require("../../Assets/top_arrow.png")
export const DOWN_IMAGE_INSTALLER = require("../../Assets/top_arrow.png")
export const PLUS_IMAGE = require("../../Assets/top_arrow.png")
export const SEND_BUTTON = require("../../Assets/top_arrow.png")
export const SCAN_OUTER = require("../../Assets/top_arrow.png")
export const APP_LOGO = require("../../Assets/logo.png")
export const MENU_ICON = require("../../Assets/menu.png")
export const CAMERA_ICON = require("../../Assets/camera.png")
export const UP_ARROW = require("../../Assets/top_arrow.png")
export const CROSS_ICON = require("../../Assets/cross.png")
export const GIFT_ICON = require("../../Assets/gift.png")
export const CLASSIC_ICON = require("../../Assets/classic.png")
export const CLASSIC_ICON_DISABLED = require("../../Assets/classic_disable.png")
export const SQUARE_ICON = require("../../Assets/square.png")
export const SQUARE_ICON_ENABLED = require("../../Assets/square_enable.png")
export const SWITCH_ON = require("../../Assets/switch_on.png")
export const SWITCH_ICON = require("../../Assets/switch.png")
export const BG_LIGHT = require("../../Assets/bg_light.png")
export const BG_DARK = require("../../Assets/bg_dark.png")
export const T_ONE = require("../../Assets/tutorial_1.png")
export const T_TWO = require("../../Assets/tutorial_2.png")
export const T_THREE = require("../../Assets/tutorial_3.png")
export const DOWN_ARROW = require("../../Assets/down_arrow.png")
export const ADD_ALBUM = require("../../Assets/add_album.png")
export const BACK_ARROW = require("../../Assets/back_arrow.png")
export const KLEEN_HUB_ICON = require("../../Assets/kleen_hub_icon.png")
export const CHECK_ICON = require("../../Assets/check.png")
export const INFO_ICON = require("../../Assets/info.png")
export const WIFI_ICON = require("../../Assets/wifi.png")
export const CREDIT_ICON = require("../../Assets/credit_card.png")
export const APPLE_ICON = require("../../Assets/apple_pay.png")
export const GOOGLE_ICON = require("../../Assets/google-play.png")
export const GOOGLE_WALLET = require("../../Assets/google-wallet.png")
export const HOME_ICON = require("../../Assets/home.png")
export const POINTER_ICON = require("../../Assets/pointer.png")
export const BOXES_ICON = require("../../Assets/Boxes.png")
export const RESTAURANTS_ICON = require("../../Assets/Restaurants.png")
export const ACCOUNTS_ICON = require("../../Assets/Account.png")
export const CHECK_BOX = require("../../Assets/checkbox.png")
export const AWARD_ICON = require("../../Assets/award.png")
export const TEXT_LOGO = require("../../Assets/text_logo.png")
export const CHECKED_BOX = require("../../Assets/checked_box.png")
export const SPLASH_VIDEO = require("../../Assets/splash_video.gif")
export const SPLASH_VIDEO_ORIGINAL = require("../../Assets/splash_original.mp4")
export const ANCHOR_ICON = require("../../Assets/anchor_icon.png")
export const LOGO_ALPHA = require("../../Assets/logoalpha.png")
export const NEW_ICON = require("../../Assets/new_icon.jpg")
//App Screen Constants

export const MONTH_ARRAY = ['JAN','FEB','MAR','APR','MAY','JUN','JULY','AUG,SEP','OCT','NOV','DEC'];



export function addNetworkCheckListener(callback){
NetInfo.addEventListener(callback)
}

export function isNetworkAvailable(callback){
    NetInfo.fetch().then(state=>{
callback(state.isConnected)
    })
    }

    export const getTokenFromAsync = async () => {
        try {
            const value = await AsyncStorage.getItem('fcmToken');
            if (value != null) {
                return value;
            }
          } catch (error) {
            return '';
          }
      }
    
      export const fetchTokenFromFirebase = async () => {
       
          let value = '';
        try{
          if(Platform.OS==='android'){
            value = await firebase.messaging().getToken();
          }else{
            value = await firebase.messaging().ios.getAPNSToken();
          }
          if(value){
            console.log('>>inside',value)
            AsyncStorage.setItem('fcmToken', value);
          }else{
            console.log('>>inside','empty')
          }
        }catch(error){
          console.log('>>inside',error)
          return '';
        }
    }
    
    
    var notification;
    export const makeNotification=(title, body)=>{
      const channel = new firebase.notifications.Android.Channel(
        'channelId',
        'Channel Name',
        firebase.notifications.Android.Importance.High
      ).setDescription('A natural description of the channel');
      firebase.notifications().android.createChannel(channel);
    
     if(Platform.OS==='android'){
      notification = new firebase.notifications.Notification()
      .setNotificationId('notificationId')
      .setTitle(title)
      .setBody(body)
      .android.setSmallIcon('ic_stat_notification')
      .android.setAutoCancel(true)
      .android.setChannelId('channelId')
      .android.setPriority(firebase.notifications.Android.Priority.High);
      firebase.notifications().displayNotification(notification)
     }else{
      notification = new firebase.notifications.Notification()
      .setNotificationId('notificationId')
        .setTitle(title)
        .setBody(body);
      firebase.notifications().displayNotification(notification)
     }
    }
    




export const _getLatLong = async () => {
  try{
   
    let location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      })
    return location;
  }catch(error){
    return error.code
  } 
}

    







