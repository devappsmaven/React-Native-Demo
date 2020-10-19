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
      APPLE_ICON,GOOGLE_WALLET,
      GREEN_COLOR,RED_COLOR,
      STANDARD_CREATE_ACCOUNT, CUSTOMER_DASHBOARD, FORGOT_PASSWORD, PROFILE_SCREEN, getTokenFromAsync,
      APP_LOGO, BG_LIGHT, LINK_HIGHLIGHT_COLOR, WHITE_BG_NO_BORDER } from '../../Utils/ConstantClass';
      import * as Progress from 'react-native-progress';
import ShowLoader from '../../Utils/ShowLoader';
import { CUSTOMER_LOGIN_URL, LOGIN_URL, _DATA ,LOGIN_TYPE, OTHER_LOGIN, CUSTOMER_PROFILE} from '../../Utils/UrlClass';
import ErrorMessageTextView from '../../Utils/ErrorMessageTextView';
import * as T from '../../Utils/AppTranslations';
import { WebView } from 'react-native-webview';
class EditPayment extends Component{
    constructor(props){
        super(props)
        
        this.state={
            isLoading:false,
            user_id : '',
            error : '',
            CCData:'',
            paymentType:'',
        
        }
    }

    _getUserData(){     
        AsyncStorage.getItem('data').then((value) => {
            if(value!=null){
                const parsedData = JSON.parse(value)
                console.log('user_id', parsedData)
                this.setState({user_id:parsedData.user._id, paymentType:parsedData.user.googleOrApplePay},()=>{
                    if(this.state.paymentType===''){
                        this._getCCDetails()
                    }else{
                        this.setState({isLoading:true},()=>{
                            this.setState({paymentType:parsedData.user.googleOrApplePay},()=>{
                                this.setState({isLoading:false})
                            })
                        })
                    }
                    
                })
            }
        }).done();     
    }
    componentDidMount(){
     this._getUserData()
    }
    async _getCCDetails(){

        this.setState({isLoading:true})
        const credentials={
            userId : this.state.user_id
        }
        console.log(JSON.stringify(credentials))
        try {
          let response = await fetch(
           GET_CARD_DETAILS,
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
                console.log('>>ccDetails',JSON.stringify(data))
                switch (data.status) {
                    case 1:
                        this.setState({CCData : data.data[0]},()=>{
                            this.setState({isLoading:false})
                        })
                        break;
                    default:
                        this.setState({error : '1',},()=>{
                            this.setState({isLoading:false})
                        })
                        break;
                }
             });
          }else {
            this.setState({error : '1',},()=>{
                this.setState({isLoading:false})
                alert('Something went wrong'+'\n'+response.status)
            })
        }
        } catch (error) {
            this.setState({isLoading:false},()=>{
                alert('Error in processing request')
            })
        }
    
    }
   
    async _deleteCard(){

        this.setState({isLoading:true})
        const credentials={
            userId : this.state.user_id,
        }
        console.log(JSON.stringify(credentials))
        try {
          let response = await fetch(
           'https://admin.kleenhub.com/api/v1/deleteCustId',
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
                console.log('>>restaurant_list',JSON.stringify(data))
                switch (data.status) {
                    case 1:
                            this._getCCDetails()
                        break;
                    default:
                            this.setState({isLoading:false},()=>{
                                alert(data.message)
                            })
                        break;
                }
             });
          }else {
            console.log('>>restaurant_list',response)
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
                            {this.state.paymentType===''?'Edit Payment':'Payment Method'}
                        </Text>

                        {
                            this.state.paymentType===''?
                            this.state.error==='1'?
                        <View>
                            <Text style={{marginTop:35,height:150,color:NORMAL_COLOR,fontFamily:'Karla-Regular'}}>
                            You don't have any payment{'\n'}method.
                            </Text>
                            <TouchableOpacity 
                             activeOpacity={1}
                            onPress={()=>this.props.navigation.navigate('CreditCardScreen' , {
                                from : 'editPayment'
                            })} 
                            style={{justifyContent:'flex-end',marginTop:55,marginRight:16,marginLeft:16,marginBottom:16,
                            justifyContent:'center',alignContent:'center',
                            alignItems:'center'}}>
                                                <Text style={{             fontFamily:'Chivo-Bold',color:LINK_HIGHLIGHT_COLOR}}>
                                                    Add payment
                                                </Text>
                            </TouchableOpacity>
                        </View>:     
                        <View style={{flex:1,flexDirection:'column',marginTop:55}}>
                                        
                            <View>
                            <Text style={{             fontFamily:'Karla-Regular',color:WHITE_BG_NO_BORDER}}>
                                Card Number
                            </Text>
                            <Text style={{            fontFamily:'Chivo-Bold',color:BOLD_COLOR,height:36,paddingLeft:-2}}
                                    secureTextEntry={true}>
                                        **** **** **** {this.state.CCData.last4}
                                    </Text>

                                <TouchableOpacity 
                                 activeOpacity={1}
                                onPress={()=>this.props.navigation.navigate('CreditCardScreen' , {
                                from : 'toEdit', 
                                data : JSON.stringify(this.state.CCData)
                                })}
                                style={{position:'absolute',right:0}}>
                                    <Text style={{             fontFamily:'Chivo-Bold',color:LINK_HIGHLIGHT_COLOR}}>
                                        edit
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={{    marginTop:5,          fontFamily:'Karla-Regular',color:WHITE_BG_NO_BORDER}}>
                                Expiration Date
                            </Text>
                            <Text style={{             fontFamily:'Chivo-Bold',color:BOLD_COLOR,height:36,paddingLeft:-2}}
                                    secureTextEntry={true}>
                                        {this.state.isLoading?'':
                                        parseInt(this.state.CCData.exp_month)<10?
                                        '0'+this.state.CCData.exp_month:
                                        this.state.CCData.exp_month}{'/'}{(this.state.CCData.exp_year+'').substring(2, 4)}
                                    </Text>

                            <Text style={{    marginTop:5,          fontFamily:'Karla-Regular',color:WHITE_BG_NO_BORDER}}>
                                CVV
                            </Text>
                            <Text style={{             fontFamily:'Chivo-Bold',color:BOLD_COLOR,height:36,paddingLeft:-2}}
                                secureTextEntry={true}>
                                    ***
                            </Text>
                            <TouchableOpacity 
                             activeOpacity={1}
                            onPress={()=>this._deleteCard()} style={{justifyContent:'flex-end',margin:16,justifyContent:'center',alignContent:'center',
                            alignItems:'center'}}>
                                                <Text style={{             fontFamily:'Chivo-Bold',color:LINK_HIGHLIGHT_COLOR}}>
                                                    Delete
                                                </Text>
                            </TouchableOpacity>
                        </View>
                            :
                            this.state.paymentType==='applePay'?
                            <View
                            style={{height:110,width:'40%',flexDirection:'column',padding:16,justifyContent:'center',
                            alignContent:'center',alignItems:'center'}}
                           >
                            <Image style={{alignSelf:'center',height:'60%'}}
                            resizeMode='contain' source={APPLE_ICON}/>
                                <Text style={{fontFamily:'Chivo-Bold',marginTop:16,color:LINK_HIGHLIGHT_COLOR}}>
                                    Apple Pay
                                </Text>

                            </View>:
                             <View 
                             style={{height:110,width:'30%',flexDirection:'column',padding:16,justifyContent:'center',
                             alignContent:'center',alignItems:'center'}}>
                             <Image style={{alignSelf:'center',height:'60%',tintColor:'black'}}
                             resizeMode='contain' source={GOOGLE_WALLET}/>
                                 <Text style={{fontFamily:'Chivo-Bold',marginTop:16,color:LINK_HIGHLIGHT_COLOR}}>
                                     Google Pay
                                 </Text>
 
                             </View>
                        }
                        
                   </View>
                    </ScrollView>
                    </KeyboardAvoidingView>   
                    <TouchableOpacity 
                     activeOpacity={1}
                    onPress={()=>this.props.navigation.goBack()} style={{justifyContent:'flex-end',margin:20,justifyContent:'center',alignContent:'center',
                    alignItems:'center'}}>
                                        <Text style={{             fontFamily:'Chivo-Bold',fontSize:21,
                                        
                                        color:LINK_HIGHLIGHT_COLOR}}>
                                            Back
                                        </Text>
                    </TouchableOpacity> 
                    {this.state.isLoading?<ShowLoader/>:null}        
            </View>
        );
    }
}

export default EditPayment;