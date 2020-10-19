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
    KeyboardAvoidingView,
    FlatList,
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
      INFO_ICON,
      NORMAL_COLOR,
      ERROR_COLOR,
      CHECK_BOX,
      APPLE_ICON,CREDIT_ICON,
      RED_COLOR,GREEN_COLOR,
      SQUARE_ICON,CLASSIC_ICON,SWITCH_ICON,SWITCH_ON,
      CONTINUE_WITH_FB, APP_RED_COLOR, CREATE_ACCOUNT_WITH_MOBILE, 
      BACK_ARROW,
      STANDARD_CREATE_ACCOUNT, CUSTOMER_DASHBOARD, FORGOT_PASSWORD, PROFILE_SCREEN, getTokenFromAsync, APP_LOGO, BG_LIGHT, BOLD_COLOR, LINK_HIGHLIGHT_COLOR, WHITE_BG_NO_BORDER } from '../Utils/ConstantClass';
      import * as Progress from 'react-native-progress';
import ShowLoader from '../Utils/ShowLoader';
import { CUSTOMER_LOGIN_URL, LOGIN_URL, _DATA ,LOGIN_TYPE, OTHER_LOGIN, CUSTOMER_PROFILE, EXPIRY_FORMAT} from '../Utils/UrlClass';
import ErrorMessageTextView from '../Utils/ErrorMessageTextView';
import * as T from '../Utils/AppTranslations';
import { WebView } from 'react-native-webview';
import stripe from 'tipsi-stripe'
import Spoiler from '../Utils/Spoiler'
import { Content, Item, Input } from 'native-base';
import { Grid, Col } from 'react-native-easy-grid';
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";



class CreditCardScreen extends Component{
    static title = 'Card Text Field'
    constructor(props){
        super(props)
        this.xhec = false
        this.CN = false
        this.state={ otp:[],
            isLoading:false,
            user_id : '',
            token: null,
            error: null,
            text:'',
            number: '',
            cardHolderName:'',
            cvv:'',
            errorCVV:'',
            errorCardName:'',
            errorCardNumber:'',
            errorExpiryDate:'',
            showError:''
        }
    }

    handleFieldParamsChange = (valid, params) => {
        this.setState({
          valid,
          params,
        })
      }
  
    componentDidMount() {
        
     this._getUserData()
        
    }

   
    _getUserData(){ 
        AsyncStorage.getItem('data').then((value) => {
            if(value!=null){
                const parsedData = JSON.parse(value)
                console.log('user_id', value)
                this.setState({user_id:parsedData.user._id},()=>{
                        if(this.props.navigation.getParam('from')==='toEdit'){
                            const parsedDataq = JSON.parse(this.props.navigation.getParam('data'))
                            this.setState({cardHolderName : parsedDataq.name,text :

                                parseInt(parsedDataq.exp_month)<10?
                                        '0'+parsedDataq.exp_month+'/'+(parsedDataq.exp_year+'').substring(2, 4):
                                        parsedDataq.exp_month+'/'+(parsedDataq.exp_year+'').substring(2, 4)})
                        }
                })
            }
        }).done();    
    }

    fixCardText(text){
        if(text.length === 2 && this.state.text.length === 1){
          text += '/'
        }else if(text.length == 2 && this.state.text.length == 3){
          text = text.substring(0 , text.length-1)
        }
        this.setState({text:text}) 
      }


   async _generateToken(){
    
   
    if(this.state.cardHolderName===''&&this.state.number===''
    &&this.state.text===''&&this.state.cvv===''){
        this.setState({showError:true},()=>{
            this.setState({errorCardName:'Please enter card holder name',errorCardNumber:'Please enter card number',
            errorExpiryDate :'Please enter card expiry date', errorCVV :'Please enter card CVV' })
        })
    }else if(this.state.cardHolderName===''){
        this.setState({showError:true},()=>{
            this.setState({errorCardName:'Please enter card holder name' })
        })
    }else if(this.state.number===''){
        this.setState({showError:true},()=>{
            this.setState({errorCardNumber:'Please enter card number' })
        })
    }else if(this.state.text===''){
        this.setState({showError:true},()=>{
            this.setState({errorExpiryDate :'Please enter card expiry date'})
        })  
    }
    else if(!EXPIRY_FORMAT.test(this.state.text+'')){
        this.setState({showError:true},()=>{
            this.setState({errorExpiryDate :'Please insert a valid expiry date'})
        })  
    }
  
    else if(this.state.cvv.length===0){
        console.log(this.state.text,' ',this.state.cardHolderName,' ',this.state.number,' ',this.state.cvv)
        this.setState({showError:true},()=>{
            this.setState({errorCVV :'Please enter card CVV' })
        })
    }else if(this.state.cvv.length<3){
        console.log(this.state.text,' ',this.state.cardHolderName,' ',this.state.number,' ',this.state.cvv)
        this.setState({showError:true},()=>{
            this.setState({errorCVV :'Please enter card CVV' })
        })
    }
    else if(this.state.text.length===5){
        var exp = this.state.text.split('/')
        var year = new Date().getFullYear();
        if(!(parseInt(exp[0])>0&&(parseInt(exp[0])<=12))){
            this.setState({showError:true},()=>{
                this.setState({errorExpiryDate :'Please insert a valid expiry month'})
            }) 
        }else if(parseInt(exp[1])<parseInt((year+'').substring(2,4))) {
            this.setState({showError:true},()=>{
                this.setState({errorExpiryDate :'Please insert a valid expiry year'})
            }) 
     
        }else{
            var v = this.state.text.toString().split('/')
            console.log(v[0],v[1])
            const params = {
                number: this.state.number.replace(/ /g,'')+'',
                expMonth: parseInt(v[0]),
                expYear: parseInt(v[1]),
                cvc: this.state.cvv.toString(),
                name: this.state.cardHolderName,
                currency: 'usd',
                addressLine1: '',
                addressLine2: '',
                addressCity: '',
                addressState: '',
                addressCountry: '',
                addressZip: '',
            }
            try{
                const token = await stripe.createTokenWithCard(params)
            
            if(token!=null||token!=''||token!=undefined){
                console.log(token)
                this._uploadCCDetails(token.tokenId)
            }else{
                alert('Please check you entered details before submitting')
            }
            }catch(error){
                alert(error.message)
              console.log(JSON.stringify(error))
            }
        }
    }
    else{
        this.setState({isLoading:true})
        var v = this.state.text.toString().split('/')
        console.log(v[0],v[1])
        const params = {
            number: this.state.number.replace(/ /g,'')+'',
            expMonth: parseInt(v[0]),
            expYear: parseInt(v[1]),
            cvc: this.state.cvv.toString(),
            name: this.state.cardHolderName,
            currency: 'usd',
            addressLine1: '',
            addressLine2: '',
            addressCity: '',
            addressState: '',
            addressCountry: '',
            addressZip: '',
        }
        const token = await stripe.createTokenWithCard(params)
        
        if(token!=null||token!=''||token!=undefined){
            console.log(token)
            this._uploadCCDetails(token.tokenId)
        }else{
            alert('Please check you entered details before submitting')
        }
            
        }
        
    }

    async _uploadCCDetails(token){

        
        const credentials={
            userId : this.state.user_id,
            token : token
        }
        console.log(JSON.stringify(credentials))
        try {
          let response = await fetch(
           ADD_CUSTOMER,
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
                        Alert.alert(
                            'Add Payment',
                            data.message,
                            [
                              {
                                text: 'Close',
                                onPress: () => {this.props.navigation.dispatch(resetStack)},
                                style: 'cancel'
                              }
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
        const { loading, token, error, params, errorParams } = this.state
        return(
            <View style={{flex:1,flexDirection:'column',backgroundColor:APP_MAJOR_BACKGROUND_COLOR}}>
            <SafeAreaView style={{backgroundColor:APP_MAJOR_BACKGROUND_COLOR}}/>
            <StatusBar barStyle={'dark-content'}/>
                    <View style={{flex:1,backgroundColor:APP_MAJOR_BACKGROUND_COLOR,padding:20,marginLeft:10,marginRight:10}}>  
                        <Text style={{marginTop:25,fontFamily:'Chivo-Bold',color:BOLD_COLOR,fontSize:28}}>
                            {this.props.navigation.getParam('from')==='toEdit'||
                            this.props.navigation.getParam('from')==='editPayment'?'Edit':'Enter'} Card Details
                        </Text>
                       
                        <View style={{flex:1,flexDirection:'column',marginTop:55}}>                                    
                                                <TextInput 
                                                    multiline={false}
                                                    placeholder='Card Holder Name'
                                                    style={{
                                                    marginTop:20,
                                                    fontFamily:'Karla-Regular',
                                                    color:NORMAL_COLOR,
                                                    borderRadius:12,padding:10,backgroundColor:'white'}}
                                                    onChangeText={(e)=>this.setState({cardHolderName:e,errorCardName:''})}
                                                    value={this.state.cardHolderName}/>
                                                     {this.state.errorCardName.length>0 && 
                                                        <Text style={{marginTop:8,fontFamily:'Karla-Regular', color:ERROR_COLOR}}>
                                                        {this.state.errorCardName}
                                                    </Text>}
                                                <TextInput 
                                                    keyboardType='numeric'
                                                    placeholder={this.props.navigation.getParam('from')==='toEdit'?
                                                    'xxxx xxxx xxxx '+JSON.parse(this.props.navigation.getParam('data')).last4:'Card Number'}
                                                    maxLength={16}
                                                    style={{
                                                    marginTop:20,
                                                    fontFamily:'Karla-Regular',
                                                    color:NORMAL_COLOR,
                                                    borderRadius:12,padding:10,backgroundColor:'white'}}
                                                    onChangeText={(e)=>this.setState({number:e , errorCardNumber:''})}
                                                    value={this.state.number}/>
                                                    {this.state.errorCardNumber.length>0 && 
                                                        <Text style={{marginTop:8,fontFamily:'Karla-Regular', color:ERROR_COLOR}}>
                                                        {this.state.errorCardNumber}
                                                    </Text>}
                                                   
                                                <TextInput 
                                                    maxLength={5}
                                                    keyboardType='numeric'
                                                    placeholder='Expiration Date'
                                                    style={{
                                                    marginTop:20,
                                                    fontFamily:'Karla-Regular',
                                                    color:NORMAL_COLOR,
                                                    borderRadius:12,padding:10,backgroundColor:'white'}}
                                                    onChangeText={(text)=>{ 
                                                        this.setState({errorExpiryDate:''})
                                                    this.fixCardText(text)}}
                                                   
                                                    value={this.state.text}/>

                                                    {this.state.errorExpiryDate.length>0 && 
                                                        <Text style={{marginTop:8,fontFamily:'Karla-Regular', color:ERROR_COLOR}}>
                                                        {this.state.errorExpiryDate}
                                                    </Text>}
                                                <TextInput 
                                                secureTextEntry={true}
                                                    maxLength={3}
                                                    value={this.state.cvv}
                                                    onChangeText={(e)=>this.setState({cvv:e , errorCVV:''})}
                                                    keyboardType='numeric'
                                                    placeholder='CVV'
                                                    style={{
                                                    marginTop:20,
                                                    fontFamily:'Karla-Regular',
                                                    color:NORMAL_COLOR,
                                                    borderRadius:12,padding:10,backgroundColor:'white'}}
                                                />
                                                    {this.state.errorCVV.length>0 && 
                                                        <Text style={{marginTop:8,fontFamily:'Karla-Regular', color:ERROR_COLOR}}>
                                                        {this.state.errorCVV}
                                                    </Text>}
                                            <TouchableOpacity 
                                                                onPress={()=>{
                                                                    this._generateToken()
                                                                }}
                                                                style={{
                                                                    justifyContent:'flex-end',
                                                                    margin:16,
                                                                    borderRadius:10,padding:8}}>
                                                                    <Text style={{fontFamily:'Chivo-Bold',fontSize:21,textAlign:'center',color:LINK_HIGHLIGHT_COLOR}}>
                                                                        {this.props.navigation.getParam('from')==='toEdit'?'Save':'Continue'}
                                                                    </Text>
                                                                </TouchableOpacity>
                              
                                 
                        </View>
                    {/* {this.props.navigation.getParam('from')==='editPayment'||
                    this.props.navigation.getParam('from')==='toEdit'?
                     :null}   */}
                     <TouchableOpacity 
                    onPress={()=>{
                        this.props.navigation.goBack()
                    }}

                    style={{
                        justifyContent:'flex-end',
                        margin:16,
                        borderRadius:10,padding:8}}>
                        <Text style={{fontFamily:'Chivo-Bold',fontSize:21,textAlign:'center',color:LINK_HIGHLIGHT_COLOR}}>
                            Back
                        </Text>
                    </TouchableOpacity>        
            </View>
            {this.state.isLoading?<ShowLoader/>:null}
            </View>
       
       );
    }
}
const resetStack = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Dashboard'})
        ],
});
export default CreditCardScreen;
