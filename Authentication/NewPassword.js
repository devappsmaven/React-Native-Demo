import React, {Component,useEffect,useRef} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions, NavigationActions } from 'react-navigation';
import { SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    View,
    Text,
    TextInput,
    Button,
    Image,
    StatusBar,
    ImageBackground,
    KeyboardAvoidingView,
    Animated,
    Alert,
    Platform,
    PanResponder,
    Dimensions,} from 'react-native';

import { APP_TEXT_COLOR, APP_MAJOR_BACKGROUND_COLOR, GRADIENT_YELLOW_SHADE,
     BACK_BUTTON_IMAGE, APP_WHITE_COLOR, APP_GREY_COLOR,
      GRADIENT_ORANGE_SHADE, GRADIENT_DARK_ORANGE_SHADE, 
      BUTTON_HEIGHT, APP_BLUE_COLOR, BORDER_RADIUS, 
      APP_LIGHT_GREEN_COLOR,
      NORMAL_COLOR,
      ERROR_COLOR,
      CONTINUE_WITH_FB, APP_RED_COLOR, CREATE_ACCOUNT_WITH_MOBILE, 
      STANDARD_CREATE_ACCOUNT, CUSTOMER_DASHBOARD, FORGOT_PASSWORD, PROFILE_SCREEN, getTokenFromAsync, APP_LOGO, BG_LIGHT, BG_DARK, LINK_HIGHLIGHT_COLOR, KLEEN_HUB_ICON, TEXT_LOGO } from '../Utils/ConstantClass';
var v ;
import ShowLoader from '../Utils/ShowLoader';
import { CUSTOMER_LOGIN_URL, LOGIN_URL, _DATA ,LOGIN_TYPE, OTHER_LOGIN, CUSTOMER_PROFILE, EMAIL_EXPRESSION_CHECK} from '../Utils/UrlClass';
import ErrorMessageTextView from '../Utils/ErrorMessageTextView';
import * as T from '../Utils/AppTranslations';



class NewPassword extends Component{
    constructor(props){
        super(props)
        
        this.state={
            errorEmail:'',
            stringEmail:'',
            isLoading:false,
        }
      
    }
    

    componentDidMount(){

    }
   
    async _getOtpOnPhone(){
        console.log(this.state.stringEmail)
        this.setState({isLoading:true})
        const credentials={
            email:this.state.stringEmail,
        }
        try {
          let response = await fetch(
            FORGOT_PASSWORD_URL,
            {
                'method': 'POST',
                headers: {
                    'Accept': 'application/json',
                   'Content-Type': 'application/json',
                },
                 body: JSON.stringify(credentials)
            }
          );
          if (response.status == 200) {
                response.json().then(data => {
                this.setState({isLoading:false})
                console.log('>>successResponse',JSON.stringify(data))
                switch (data.status) {
                    case 1:
                      
                            this.props.navigation.navigate('RegisterSms',{
                                type: 'password reset',
                                email:this.state.stringEmail
                            })
                        break;
                    default:
                            this.setState({isLoading:false},()=>{
                                alert(data.message)
                            })
                        break;
                }
             });
          }else {
            this.setState({isLoading:false},()=>{
                alert('Something went wrong'+'\n'+response.status)
            })
        }
        } catch (error) {
            this.setState({isLoading:false},()=>{
                alert('Error in processing request')
            })
        }
    
    }
   
    
   _newPassword(){
    if(this.state.stringEmail===''){
        
            this.setState({errorEmail:'Please enter your registered email'})
    
    }else if(!EMAIL_EXPRESSION_CHECK.test(this.state.stringEmail.toLowerCase())){
           
        this.setState({errorEmail:'Please insert a valid email'})

   
}else{
        this._getOtpOnPhone()
    }
   }

   
    render(){
        return(
            <View style={{flex:1,flexDirection:'column'}}>
            <SafeAreaView style={{backgroundColor:APP_MAJOR_BACKGROUND_COLOR}}/>
            <StatusBar barStyle={'dark-content'}/>
                  
                    <View style={{flex:1}}>  
                               <KeyboardAvoidingView 
                                    style={{ flex: 1, 
                                    flexDirection: 'column',justifyContent: 'center',}} 
                                    behavior={Platform.OS=='ios'?'padding' :''}
                                    enabled
                                    keyboardVerticalOffset={Platform.OS=='ios'?20:10}>
                                    <ScrollView 
                                    keyboardDismissMode='on-drag'
                                    keyboardShouldPersistTaps='always'
                                    >
                                        <View style={{
                                            padding:16,
                                            flex:1,
                                            justifyContent:'center',
                                            alignContent:'center',
                                            flexDirection:'column'}}>
                                            
                                             <Image
                                             style={{flex:1,alignSelf:'center'}}
                                             source={KLEEN_HUB_ICON}/>   
<Image
                                                resizeMode='contain'
                                             style={{marginTop:5,width:150,height:50,alignSelf:'center'}}
                                             source={TEXT_LOGO}/>  
                                            <Text style={{fontSize:19,alignSelf:'center',margin:20,color:LINK_HIGHLIGHT_COLOR ,fontFamily:'Chivo-Bold',}}>Change Password</Text>
                                                <TextInput
                                          
                                                 style={{
                                                    marginTop:35,
                                                    fontFamily:'Karla-Regular',
                                                    color:NORMAL_COLOR,
                                                
                                                    borderRadius:12,padding:10,backgroundColor:'white'}}
                                                    onChangeText={(text)=>{this.setState({stringEmail:text,errorEmail:''})}}
                                                    value= {this.state.stringEmail}
                                                placeholder='Enter your registered email'/>
                                                 {this.state.errorEmail.length>0 ? 
                                                        <Text style={{marginTop:8,fontFamily:'Karla-Regular', color:ERROR_COLOR}}>
                                                        {this.state.errorEmail}
                                                </Text>:null}

                                                <TouchableOpacity 
                                                onPress={()=>{
                                                    this._newPassword()
                                                }}
                                                activeOpacity={1}
                                                style={{marginTop:35,
                                                    alignSelf:'center',
                                                    width:100,
                                                    marginLeft:16,marginRight:16,
                                                    borderRadius:10,padding:8}}>
                                                    <Text style={{ fontFamily:'Chivo-Bold'
                                                    ,textAlign:'center',color:LINK_HIGHLIGHT_COLOR}}>
                                                    Submit
                                                    </Text>
                                                </TouchableOpacity>
                                        </View>
                                        
                                </ScrollView>
                               
                                </KeyboardAvoidingView>
                               
                     </View>
                                {this.state.isLoading?<ShowLoader/>:null}
            </View>
        );
    }
}
const resetStack = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Dashboard' })
        ],
});
export default NewPassword;