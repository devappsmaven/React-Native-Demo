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
      CONTINUE_WITH_FB, APP_RED_COLOR, CREATE_ACCOUNT_WITH_MOBILE, 
      STANDARD_CREATE_ACCOUNT, CUSTOMER_DASHBOARD, FORGOT_PASSWORD, PROFILE_SCREEN, getTokenFromAsync, APP_LOGO, BG_LIGHT, BG_DARK, LINK_HIGHLIGHT_COLOR, HUB_ICON, TEXT_LOGO, ERROR_COLOR } from '../Utils/ConstantClass';
var v ;
import ShowLoader from '../Utils/ShowLoader';
import { CUSTOMER_LOGIN_URL, LOGIN_URL, _DATA ,LOGIN_TYPE, OTHER_LOGIN, CUSTOMER_PROFILE, EMAIL_EXPRESSION_CHECK} from '../Utils/UrlClass';
import ErrorMessageTextView from '../Utils/ErrorMessageTextView';
import * as T from '../Utils/AppTranslations';



class LoginScreen extends Component{
    constructor(props){
        super(props)
        
        this.state={
            emailString:'',
            passwordString:'',
            errorEmail:'',
            errorPassword:'',
            showError:false,
            isLoading:false,
            current : new Animated.Value(0),
            pan : new Animated.ValueXY(),
            user_id:'',
            fcmToken:''
        }
      
        console.log('>>loginParam' , this.props.navigation.getParam('hello'))
    }
    
    _getUserData(){     
        AsyncStorage.getItem('data').then((value) => {
            if(value!=null){
                const parsedData = JSON.parse(value)
                console.log('user_id', parsedData.id)
                this.setState({user_id:parsedData.id},()=>{
                    
                })
            }
        }).done();     
    }
    componentDidMount(){
        this._getUserData()
        getTokenFromAsync().then(value=>{
            console.log('>toke', value)
            this.setState({fcmToken:value})
        })
    }
   

    _method_login(){
        if(this.state.emailString===''&&this.state.passwordString===''){
            this.setState({showError:true},()=>{
                this.setState({errorEmail:'Please enter email',errorPassword:'Please enter password' })
            })
        }else if(this.state.emailString===''){
            this.setState({showError:true},()=>{
                this.setState({errorEmail:'Please enter email' })
            })
        }else if(!EMAIL_EXPRESSION_CHECK.test(this.state.emailString.toLowerCase())){
            this.setState({showError:true},()=>{
                this.setState({errorEmail:'Please insert valid email'})
            })
           
        }else if(this.state.passwordString===''){
            this.setState({showError:true},()=>{
                this.setState({errorPassword:'Please enter password' })
            })
        }else{
            this.api_login()
        }
    }
    
    async api_login(){
        console.log(this.state.emailString,
            this.state.passwordString)
        this.setState({isLoading:true})
        const credentials={
            email:this.state.emailString,
            password:this.state.passwordString,
            userDeviceInfo:{token:this.state.fcmToken,deviceType:Platform.OS+''}
        }
        console.log('>>pa',JSON.stringify(credentials))
        try {
          let response = await fetch(
            LOGIN_URL,
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
                            AsyncStorage.setItem('data', JSON.stringify(data.data),()=>{
                                this.props.navigation.dispatch(resetStack);
                            });
                        break;
                    default:
                            this.setState({isLoading:false,passwordString:''},()=>{
                                alert(data.message)
                            })
                        break;
                }
             });
          }else {
            this.setState({isLoading:false,passwordString:''},()=>{
                alert('Something went wrong'+'\n'+response.status)
            })
        }
        } catch (error) {
            this.setState({isLoading:false,passwordString:""},()=>{
                alert('Error in processing request')
            })
        }
    
}
   
    

    render(){
        return(
            <View style={{flex:1,flexDirection:'column'}}>
            <SafeAreaView style={{backgroundColor:APP_MAJOR_BACKGROUND_COLOR}}/>
                    <StatusBar barStyle={'dark-content'}/>
           
                               <KeyboardAvoidingView 
                                    style={{ flex: 1, 
                                    flexDirection: 'column',justifyContent: 'center',}} 
                                    behavior={Platform.OS=='ios'?'padding' :''}
                                    enabled
                                    keyboardVerticalOffset={Platform.OS=='ios'?20:10}>
                                    <ScrollView 
style={{flex:1}}
contentContainerStyle={{flex:1}}
                                    keyboardDismissMode='on-drag'
                                    keyboardShouldPersistTaps='always'
                                    >
                                        <View style={{
                                            padding:16,
                                            flex:1,
                                            marginStart:26,marginRight:26,
                                            justifyContent:'center',
                                            alignContent:'center',
                                            flexDirection:'column'}}>
                                            
                                             <Image
                                             style={{alignSelf:'center'}}
                                             source={KLEEN_HUB_ICON}/>  
                                            <Image
                                                resizeMode='contain'
                                             style={{marginTop:5,width:150,height:50,alignSelf:'center'}}
                                             source={TEXT_LOGO}/>   
 

                                                <TextInput style={{
                                                    marginTop:35,
                                                    fontFamily:'Karla-Regular',
                                                    color:NORMAL_COLOR,
                                                    borderRadius:12,padding:10,backgroundColor:'white'}}
                                                    onChangeText={(text)=>{this.setState({emailString:text,errorEmail:''})}}
                                                    value= {this.state.emailString}
                                                placeholder='Email'/>
                                                    {this.state.errorEmail.length>0 && 
                                                        <Text style={{marginTop:8,fontFamily:'Karla-Regular', color:ERROR_COLOR}}>
                                                        {this.state.errorEmail}
                                                    </Text>}
                                                <TextInput style={{
                                                               marginTop:10,
                                                    fontFamily:'Karla-Regular',
                                                    borderRadius:12,
                                                
                                                    color:NORMAL_COLOR,padding:10,backgroundColor:'white'}}
                                                    onChangeText={(text)=>{this.setState({passwordString:text,errorPassword:''})}}
                                                    value= {this.state.passwordString}
                                                    secureTextEntry={true}
                                                placeholder='Password'/>
                                                    {this.state.errorPassword.length>0 && 
                                                        <Text style={{marginTop:8,fontFamily:'Karla-Regular', color:ERROR_COLOR}}>
                                                        {this.state.errorPassword}
                                                    </Text>}
                                          
                                         
                                              
                                                
                                                <TouchableOpacity 
                                                 activeOpacity={1}
                                                onPress={()=>{
                                                    this._method_login()
                                                    
                                                }}
                                                activeOpacity={.8}
                                                style={{marginTop:35,
                                                    alignSelf:'center',
                                                    backgroundColor:LINK_HIGHLIGHT_COLOR,
                                                    width:100,
                                                    marginLeft:16,marginRight:16,
                                                    borderRadius:10,padding:8}}>
                                                    <Text style={{fontFamily:'Karla-Regular',textAlign:'center',color:'white'}}>
                                                    Login
                                                    </Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity 
                                                 activeOpacity={1}
                                                onPress={()=>{
                                                   
                                                    this.props.navigation.navigate('NewPassword');
                                                }}
                                                activeOpacity={.8}
                                                style={{
                                                    alignSelf:'center',
                                                    marginTop:5,
                                                    marginLeft:16,marginRight:16,
                                                    borderRadius:10,padding:8}}>
                                                    <Text style={{fontFamily:'Chivo-Bold',textAlign:'center',color:LINK_HIGHLIGHT_COLOR}}>
                                                    Forgot Password
                                                    </Text>
                                                </TouchableOpacity>
                                        </View>
                                </ScrollView>
                                </KeyboardAvoidingView>
                               
                          
                    
                     <TouchableOpacity 
                      activeOpacity={1}
                                                onPress={()=>{
                                                    this.props.navigation.navigate('RegisterScreen')
                                                }}
                                                activeOpacity={.8}
                                                style={{
                                                  
                                                    margin:16,
                                                    justifyContent:'flex-end',
                                                    borderRadius:10,padding:8}}>
                                                    <Text style={{fontFamily:'Chivo-Bold',textAlign:'center',color:LINK_HIGHLIGHT_COLOR}}>
                                                    Sign Up
                                                    </Text>
                                                </TouchableOpacity>  
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
export default LoginScreen;
