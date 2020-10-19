import React, {Component} from 'react';
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
    KeyboardAvoidingView
    ,
    Alert,
    Platform,
    Dimensions,} from 'react-native';
    import AsyncStorage from '@react-native-community/async-storage';
import { APP_TEXT_COLOR, APP_MAJOR_BACKGROUND_COLOR, GRADIENT_YELLOW_SHADE,
     BACK_BUTTON_IMAGE, APP_WHITE_COLOR, APP_GREY_COLOR,
      GRADIENT_ORANGE_SHADE, GRADIENT_DARK_ORANGE_SHADE, 
      BUTTON_HEIGHT, APP_BLUE_COLOR, BORDER_RADIUS, 
      APP_LIGHT_GREEN_COLOR,
      CROSS_ICON,
      SQUARE_ICON,CLASSIC_ICON,SWITCH_ICON,SWITCH_ON,
      CONTINUE_WITH_FB, APP_RED_COLOR, CREATE_ACCOUNT_WITH_MOBILE, 
      BACK_ARROW,
      NORMAL_COLOR,
      BOLD_COLOR,
      INFO_ICON,
      AWARD_ICON,
      ERROR_COLOR,
      GREEN_COLOR,RED_COLOR,
      STANDARD_CREATE_ACCOUNT, CUSTOMER_DASHBOARD, FORGOT_PASSWORD, PROFILE_SCREEN, getTokenFromAsync,
      APP_LOGO, BG_LIGHT, LINK_HIGHLIGHT_COLOR, WHITE_BG_NO_BORDER } from '../../Utils/ConstantClass';
      import * as Progress from 'react-native-progress';
import ShowLoader from '../../Utils/ShowLoader';
import { CUSTOMER_LOGIN_URL, LOGIN_URL, _DATA ,LOGIN_TYPE, OTHER_LOGIN, CUSTOMER_PROFILE, SPECIAL_CHARACTER_CHECK, ATLEAST_A_NUMBER} from '../../Utils/UrlClass';
import ErrorMessageTextView from '../../Utils/ErrorMessageTextView';
import * as T from '../../Utils/AppTranslations';
import { WebView } from 'react-native-webview';
class EditPassword extends Component{
    constructor(props){
        super(props)
        
        this.state={
            isLoading:false,
            user_id : '',
            stringOldPassword:'',
            errorOldPassword:'',
            stringNewPassword:'',
            errorNewPassword:'',
            stringConfirmPassword:'',
            errorConfirmPassword:'',
            currentPassword:''
        }
    }


    componentDidMount(){
     this._getUserData()
    }
    _editPassowrd(){
        if(this.state.stringOldPassword===''&&this.state.stringNewPassword===''
        &&this.state.stringConfirmPassword===''){
            this.setState({errorOldPassword:'Please enter old password',
            errorNewPassword:'Please enter new password',
            errorConfirmPassword:'Please confirm new password'})
    }else if(this.state.stringOldPassword!=this.props.navigation.getParam('ppassword')){
        this.setState({errorOldPassword:'Old password is not correct'})
    }else if(this.state.stringOldPassword===''){
            this.setState({errorOldPassword:'Please enter password'})
    }else if(this.state.stringOldPassword.length<8){
        this.setState({errorOldPassword:'Passwords must be 8 characters long and contain at least 1 number'})
    }else if(SPECIAL_CHARACTER_CHECK.test(this.state.stringOldPassword.toLowerCase())){
        this.setState({errorOldPassword:'Passwords must not contain more than 2 special characters'})
    }else if(!ATLEAST_A_NUMBER.test(this.state.stringOldPassword.toLowerCase())){
        this.setState({errorOldPassword:'Passwords must be 8 characters long and contain at least 1 number'})
    }

else if(this.state.stringNewPassword===''){
      
    this.setState({errorNewPassword:'Please enter new password'})

}else if(this.state.stringNewPassword.length<8){

this.setState({errorNewPassword:'Passwords must be 8 characters long and contain at least 1 number'})

}else if(SPECIAL_CHARACTER_CHECK.test(this.state.stringNewPassword.toLowerCase())){

this.setState({errorNewPassword:'Passwords must not contain more than 2 special characters'})

}else if(!ATLEAST_A_NUMBER.test(this.state.stringNewPassword.toLowerCase())){

this.setState({errorNewPassword:'Passwords must be 8 characters long and contain at least 1 number'})

}

else if(this.state.stringConfirmPassword===''){
    this.setState({errorConfirmPassword:'Please confirm new password'})
}else if(this.state.stringConfirmPassword.length<8){

this.setState({errorConfirmPassword:'Passwords must be 8 characters long and contain at least 1 number'})

}else if(SPECIAL_CHARACTER_CHECK.test(this.state.stringConfirmPassword.toLowerCase())){

this.setState({errorConfirmPassword:'Passwords must not contain more than 2 special characters'})

}else if(!ATLEAST_A_NUMBER.test(this.state.stringConfirmPassword.toLowerCase())){

this.setState({errorConfirmPassword:'Passwords must be 8 characters long and contain at least 1 number'})

}else if(this.state.stringNewPassword===this.state.stringOldPassword){
    this.setState({errorNewPassword:'New password and old password cannot be same'})
}else if(this.state.stringNewPassword!=this.state.stringConfirmPassword){
    this.setState({errorConfirmPassword:'Passwords do not match'})
}else{
    this._updateProfile()
}

    }


    async _updateProfile(){
        console.log('param',
        this.state.user_id,
        this.state.stringNewPassword,
        this.props.navigation.getParam('ppassword'),
        this.props.navigation.getParam('pzip'),
        this.props.navigation.getParam('pname'))
        this.setState({isLoading:true})
        const crendetials = {
            userId:this.state.user_id,
            password:this.state.stringNewPassword,
            oldPassword:this.props.navigation.getParam('ppassword'),
            zipCode:this.props.navigation.getParam('pzip'),
            fullName:this.props.navigation.getParam('pname')
        }
        try {
          let response = await fetch(
           UPDATE_PROFILE_URL,
            {
                'method': 'POST',
                headers: {
                    'Accept': 'application/json',
                   'Content-Type': 'application/json',
                },
                 body: JSON.stringify(crendetials)
            }
          );
       
          if (response.status == 200) {
                response.json().then(data => {
                this.setState({isLoading:false})
                console.log('>>successResponse',JSON.stringify(data))
                switch (data.status) {
                    case 1:
                        this.setState({stringNewPassword:'',
                        stringOldPassword:'',stringConfirmPassword:''})
                        Alert.alert(
                            'Edit Password',
                             data.message,
                            [
                              { text: 'OK', onPress: () => this.props.navigation.goBack()}
                            ],
                            { cancelable: false }
                          );
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

    

    _getUserData(){     
        AsyncStorage.getItem('data').then((value) => {
            if(value!=null){
                const parsedData = JSON.parse(value)
                console.log('>>userData',value)
                this.setState({user_id:parsedData.user._id,
                currentPassword:parsedData.user.password},()=>{   
                })
            }
        }).done();     
    }
   
    render(){
        return(
            <View style={{flex:1,flexDirection:'column',backgroundColor:APP_MAJOR_BACKGROUND_COLOR}}>
            <SafeAreaView style={{backgroundColor:APP_MAJOR_BACKGROUND_COLOR}}/>
            <StatusBar barStyle={'dark-content'}/>
                    <KeyboardAvoidingView 
                                    style={{ flex: 1, 
                                    flexDirection: 'column',justifyContent: 'center',}} 
                                    behavior={Platform.OS=='ios'?'padding' :''}
                                    enabled
                                    keyboardVerticalOffset={Platform.OS=='ios'?20:10}>
                                    <ScrollView 

                                    contentContainerStyle={{flex:1,}}
                                    keyboardDismissMode='on-drag'
                                    keyboardShouldPersistTaps='always'
                                    >
                    <View style={{flex:1,backgroundColor:APP_MAJOR_BACKGROUND_COLOR,padding:20,marginLeft:10,marginRight:10}}>  
                        <Text style={{marginTop:25,fontFamily:'Chivo-Bold',color:BOLD_COLOR,fontSize:28}}>
                            Edit Password
                        </Text>

                        <View style={{flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center',
                        alignContent:'center'}}>
                                        
                                    <TextInput 
                                    placeholderTextColor={WHITE_BG_NO_BORDER}
                                    style={{
                                                    marginTop:5,
                                                    color:BOLD_COLOR,
                                                    width:'100%',
                                                    fontFamily:'Karla-Regular',
                                                    borderRadius:12,padding:8,backgroundColor:'white'}}
                                                    onChangeText={(text)=>{this.setState({stringOldPassword:text,
                                                        errorOldPassword:''})}}
                                                    value= {this.state.stringOldPassword}
                                                placeholder='Old Password'
                                                secureTextEntry={true}/>

{this.state.errorOldPassword.length>0 && 
                                                        <Text style={{marginTop:8,fontFamily:'Karla-Regular', 
                                                        marginBottom:8,width:'100%',
                                                        color:ERROR_COLOR}}>
                                                        {this.state.errorOldPassword}
                                                    </Text>}

                                                  <TextInput
                                                     placeholderTextColor={WHITE_BG_NO_BORDER} style={{

                                                    marginTop:5,
                                                    width:'100%',
                                                    fontFamily:'Karla-Regular',
                                                    color:BOLD_COLOR,
                                                    borderRadius:12,padding:8,backgroundColor:'white'}}
                                                    onChangeText={(text)=>{this.setState({stringNewPassword:text,
                                                        errorNewPassword:''})}}
                                                    value= {this.state.stringNewPassword}
                                                placeholder='New Password'
                                                secureTextEntry={true}/>

                                                
{this.state.errorNewPassword.length>0 && 
                                                        <Text style={{marginTop:8,fontFamily:'Karla-Regular', 
                                                        marginBottom:8,width:'100%',color:ERROR_COLOR}}>
                                                        {this.state.errorNewPassword}
                                                    </Text>}
                                                 <TextInput 
                                                    placeholderTextColor={WHITE_BG_NO_BORDER}style={{

                                                    marginTop:5,
                                                    width:'100%',
                                                    fontFamily:'Karla-Regular',
                                                    color:BOLD_COLOR,
                                                    borderRadius:12,padding:8,backgroundColor:'white'}}
                                                    onChangeText={(text)=>{this.setState({stringConfirmPassword:text,
                                                        errorConfirmPassword:''})}}
                                                    value= {this.state.stringConfirmPassword}
                                                placeholder='Confirm Password'
                                                secureTextEntry={true}/>
                                                                                                
{this.state.errorConfirmPassword.length>0 && 
                                                        <Text style={{marginTop:8,fontFamily:'Karla-Regular',
                                                        marginBottom:8,width:'100%', color:ERROR_COLOR}}>
                                                        {this.state.errorConfirmPassword}
                                                    </Text>}
                                                <TouchableOpacity 
                                                 activeOpacity={1}
                                                onPress={()=>this._editPassowrd()} style={{justifyContent:'flex-end',margin:16,justifyContent:'center',alignContent:'center',
                                                alignItems:'center'}}>
                                                                    <Text style={{fontFamily:'Chivo-Bold',color:LINK_HIGHLIGHT_COLOR,fontSize:21}}>
                                                                        Continue
                                                                    </Text>
                                                </TouchableOpacity>
                        </View>
                   </View>
                    </ScrollView>
                    </KeyboardAvoidingView>   
                    <TouchableOpacity 
                     activeOpacity={1}
                    onPress={()=>this.props.navigation.goBack()} style={{justifyContent:'flex-end',margin:20,justifyContent:'center',alignContent:'center',
                    alignItems:'center'}}>
                                        <Text style={{             fontFamily:'Chivo-Bold',fontSize:21,color:LINK_HIGHLIGHT_COLOR}}>
                                            Back
                                        </Text>
                    </TouchableOpacity>    
                    {this.state.isLoading?<ShowLoader/>:null}     
            </View>
        );
    }
}

export default EditPassword;