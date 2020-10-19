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
      GREEN_COLOR,RED_COLOR,
      STANDARD_CREATE_ACCOUNT, CUSTOMER_DASHBOARD, FORGOT_PASSWORD, PROFILE_SCREEN, getTokenFromAsync,
      APP_LOGO, BG_LIGHT, LINK_HIGHLIGHT_COLOR, WHITE_BG_NO_BORDER, ERROR_COLOR } from '../../Utils/ConstantClass';
      import * as Progress from 'react-native-progress';
import ShowLoader from '../../Utils/ShowLoader';
import { CUSTOMER_LOGIN_URL, LOGIN_URL, _DATA ,LOGIN_TYPE, OTHER_LOGIN, CUSTOMER_PROFILE} from '../../Utils/UrlClass';
import ErrorMessageTextView from '../../Utils/ErrorMessageTextView';
import * as T from '../../Utils/AppTranslations';
import { WebView } from 'react-native-webview';
class EditAccount extends Component{
    constructor(props){
        super(props)
        
        this.state={
            isLoading:false,
            user_id : '',
            fullName:'',
            phoneNumber:'',
            zipCode:'',
            email:'',
            password:'' ,
            canSave:false,
            errorName:'',
            errorZip:'',
        editName:false,
    editZip:false,
editLastName:false,
errorLastName:'',
lastName:''}
    }


    componentDidMount(){
     this._getUserData()
    }
   
    _getUserData(){     
        AsyncStorage.getItem('data').then((value) => {
            if(value!=null){
                const parsedData = JSON.parse(value)
                console.log('user_id', value)
                this.setState({user_id:parsedData.user._id},()=>{
                    this.getProfile()
                })
            }
        }).done();     
    }
    async getProfile(){
        this.setState({isLoading:true})
        const credentials={
            userId:this.state.user_id,
        }
        try {
          let response = await fetch(
           GET_PROFILE_URL,
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
                console.log('>>profile',JSON.stringify(data))
                switch (data.status) {
                    case 1:
                            this.setState({
                                fullName:data.data.user.firstName,
                                lastName:data.data.user.lastName,
                                phoneNumber:data.data.user.phoneNumber,
                                email:data.data.user.email,
                                zipCode:data.data.user.zipCode,
                                password:data.data.user.password,
                            },()=>{
                                this.setState({isLoading:false})
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

async _updateProfile(){
    if(this.state.fullName===''&&this.state.lastName===''&&this.state.zipCode===''){
        Alert.alert('Account','All fields are required')
    }else if(this.state.fullName===''){  
        this.setState({errorName:'Please enter first name'})
    }else if(this.state.lastName===''){  
        this.setState({errorLastName:'Please enter last name'})
    }else if(this.state.zipCode===''){  
        this.setState({errorZip:'Please enter Zip Code'})
    }else if(this.state.zipCode.length<4){
        this.setState({errorZip:'Please insert a valid Zip Code'})
    }else if(parseInt(this.state.zipCode)<1000 || this.state.zipCode.length<4){
        this.setState({errorZip:'Please insert a valid Zip Code'})
    }else{
        this.setState({isLoading:true})
        const crendetials = {
                    userId:this.state.user_id,
            password:this.state.password,
            oldPassword:'',
            zipCode:this.state.zipCode,
            firstName:this.state.fullName,
            lastName:this.state.lastName
        }
        try {
        let response = await fetch(
        'UPDATE_PROFILE_URL',
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
                            this.setState({isLoading:false,
                                errorName:'',errorLastName:'',errorZip:'',
                                canSave:false,editLastName:false , editName:false, editZip:false},()=>{
                                AsyncStorage.setItem('data', JSON.stringify(data.data),()=>{
                                    this.getProfile()
                                });
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
                    {this.state.isLoading?<ShowLoader/>:
                        <View style={{flex:1,backgroundColor:APP_MAJOR_BACKGROUND_COLOR,padding:20,marginLeft:10,marginRight:10}}>  
                        <Text style={{ marginTop:25,fontFamily:'Chivo-Bold',color:BOLD_COLOR,fontSize:28}}>
                            Edit Account
                        </Text>

                        <View style={{flexDirection:'column',marginTop:35}}>
                                        
                            
                            <View>
                                <Text style={{ fontFamily:'Karla-Regular',color:WHITE_BG_NO_BORDER,fontSize:17}}>
                                    First name
                                </Text> 
                                <TextInput 
                                ref={(ref) => { this.fullNameField = ref }}
                                editable = {this.state.editName}
                                style={{  fontFamily:'Karla-Regular',color:BOLD_COLOR,height:36,paddingLeft:-3}}
                                value={this.state.fullName}
                                placeholder='-'
                                onChangeText={(text)=>this.setState({fullName:text,canSave:true})}>
                                </TextInput>
                                {!this.state.editName?
                                <TouchableOpacity 
                                activeOpacity={1}
                                onPress={()=>this.setState({editName:!this.state.editName},()=>{
                                    this.fullNameField.focus()
                                })}
                                style={{position:'absolute',right:0}}>
                                <Text style={{fontFamily:'Chivo-Bold',color:LINK_HIGHLIGHT_COLOR,fontSize:17}}>
                                   edit
                                </Text>
                            </TouchableOpacity>:null}
                                {this.state.errorName.length>0 ?
                                    <Text style={{fontFamily:'Karla-Regular', color:ERROR_COLOR}}>
                                    {this.state.errorName}
                                </Text>:null}
                            </View>

                            <View>
                                <Text style={{ fontFamily:'Karla-Regular',color:WHITE_BG_NO_BORDER,fontSize:17}}>
                                    Last name
                                </Text> 
                                <TextInput 
                                ref={(ref) => { this.lastNameField = ref }}
                                editable = {this.state.editLastName}
                                style={{  fontFamily:'Karla-Regular',color:BOLD_COLOR,height:36,paddingLeft:-3}}
                                value={this.state.lastName}
                                placeholder='-'
                                onChangeText={(text)=>this.setState({lastName:text,canSave:true})}>
                                </TextInput>
                                {!this.state.editLastName?
                                <TouchableOpacity 
                                activeOpacity={1}
                                onPress={()=>this.setState({editLastName:!this.state.editLastName},()=>{
                                    this.lastNameField.focus()
                                })}
                                style={{position:'absolute',right:0}}>
                                <Text style={{fontFamily:'Chivo-Bold',color:LINK_HIGHLIGHT_COLOR,fontSize:17}}>
                                   edit
                                </Text>
                            </TouchableOpacity>:null}
                                {this.state.errorLastName.length>0 ?
                                    <Text style={{fontFamily:'Karla-Regular', color:ERROR_COLOR}}>
                                    {this.state.errorLastName}
                                </Text>:null}
                            </View>

                            <View>
                            <Text style={{   fontFamily:'Karla-Regular',color:WHITE_BG_NO_BORDER,fontSize:17,marginTop:15}}>
                                Phone number
                            </Text>
                            <TextInput 
                              editable={false}
                              style={{   fontFamily:'Karla-Regular',color:BOLD_COLOR,height:36,paddingLeft:-2}}
                            placeholder='-'
                            keyboardType='phone-pad'
                            value={this.state.phoneNumber}
                            onChangeText={(text)=>this.setState({phoneNumber:text,canSave:true})}>
                            </TextInput>
                           
                            </View>
                            
                            <Text style={{   fontFamily:'Karla-Regular',color:WHITE_BG_NO_BORDER,fontSize:17,marginTop:10}}>
                                Email
                            </Text>
                            <TextInput
                            editable={false}
                            style={{  
                                 fontFamily:'Karla-Regular',color:BOLD_COLOR,height:36,paddingLeft:-2}}
                            placeholder='-'
                            value={this.state.email}
                            onChangeText={(text)=>this.setState({email:text,canSave:true})}>
                            </TextInput>

                            <View>
                                <Text style={{fontFamily:'Karla-Regular',color:WHITE_BG_NO_BORDER,
                                fontSize:17,marginTop:10}}>
                                    Zip code
                                </Text>
                                <TextInput 
                                ref={(ref) => { this.ZipField = ref }}
                                keyboardType='numeric'
                                maxLength={4}
                                editable = {this.state.editZip}
                                style={{   fontFamily:'Karla-Regular',color:BOLD_COLOR,height:36,
                                paddingLeft:-2}}
                                placeholder='-'
                                value={this.state.zipCode}
                                onChangeText={(text)=>this.setState({zipCode:text,canSave:true})}>
                                </TextInput>
                                {!this.state.editZip?
                                <TouchableOpacity 
                                activeOpacity={1}
                                onPress={()=>this.setState({editZip:!this.state.editZip},()=>{
                                    this.ZipField.focus()
                                })}
                                style={{position:'absolute',right:0 ,top:9}}>
                                <Text style={{   fontFamily:'Chivo-Bold',color:LINK_HIGHLIGHT_COLOR,fontSize:17}}>
                                edit
                                </Text>
                            </TouchableOpacity>:null}
                                {this.state.errorZip.length>0 ?
                                    <Text style={{fontFamily:'Karla-Regular', color:ERROR_COLOR}}>
                                    {this.state.errorZip}
                                </Text>:null}
                            </View>
                            
                            <View>
                                <Text style={{ fontFamily:'Karla-Regular',color:WHITE_BG_NO_BORDER,fontSize:17,marginTop:10}}>
                                    Password
                                </Text>
                                    <Text style={{marginLeft:1, marginTop:8,  fontFamily:'Karla-Regular',color:BOLD_COLOR,height:36,paddingLeft:-2}}
                                    secureTextEntry={true}>
                                        ********
                                    </Text>
                           
                                <TouchableOpacity 
                                 activeOpacity={1}
                                   onPress={()=>this.props.navigation.navigate('EditPassword' , {
                                    pzip : this.state.zipCode,
                                    ppassword : this.state.password,
                                    pname : this.state.fullName,
                                })}
                                    style={{position:'absolute',right:0 ,top:9}}>
                                    <Text style={{   fontFamily:'Chivo-Bold',fontSize:17,color:LINK_HIGHLIGHT_COLOR}}>
                                    edit
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            
                        </View>
                   </View>
                    }
                    </ScrollView>
                    </KeyboardAvoidingView>   

                    {this.state.canSave?
                    <TouchableOpacity 
                    activeOpacity={1}
                    onPress={()=>this._updateProfile()} 
                    style={{justifyContent:'flex-end',margin:20,justifyContent:'center',alignContent:'center',
                    alignItems:'center'}}>
                                        <Text style={{   fontFamily:'Chivo-Bold',fontSize:21,color:LINK_HIGHLIGHT_COLOR}}>
                                            Save Details
                                        </Text>
                    </TouchableOpacity>  :null}


                    <TouchableOpacity 
                     activeOpacity={1}
                     onPress={()=>this.props.navigation.goBack()} style={{justifyContent:'flex-end',margin:20,justifyContent:'center',alignContent:'center',
                    alignItems:'center'}}>
                                        <Text style={{   fontFamily:'Chivo-Bold',fontSize:21,color:LINK_HIGHLIGHT_COLOR}}>
                                            Back
                                        </Text>
                    </TouchableOpacity>         
            </View>
        );
    }
}

export default EditAccount;