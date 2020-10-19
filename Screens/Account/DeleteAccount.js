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
    Modal,
    Alert,
    Animated,
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
      APP_LOGO, BG_LIGHT, LINK_HIGHLIGHT_COLOR, WHITE_BG_NO_BORDER, fetchTokenFromFirebase } from '../../Utils/ConstantClass';
      import * as Progress from 'react-native-progress';
import ShowLoader from '../../Utils/ShowLoader';
import { CUSTOMER_LOGIN_URL, LOGIN_URL, _DATA ,LOGIN_TYPE, OTHER_LOGIN, CUSTOMER_PROFILE} from '../../Utils/UrlClass';
import ErrorMessageTextView from '../../Utils/ErrorMessageTextView';
import * as T from '../../Utils/AppTranslations';
import { WebView } from 'react-native-webview';
import { BlurView } from '@react-native-community/blur';
class DeleteAccount extends Component{
    constructor(props){
        super(props)
        
        this.state={
            isLoading:false,
            user_id : '',
            deleteAccountConfirmation:false,
            userFeedbackString:''
        
        }
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
                  
                })
            }
        }).done();     
    }
   
   async _sendFeedback(){
        this.setState({isLoading:true})
        const credentials={
            userId:this.state.user_id,
            text : this.state.userFeedbackString
        }
        try {
          let response = await fetch(
           SEND_FEEDBACK_URL,
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
                    
                console.log('>>checkCount',JSON.stringify(data))
                switch (data.status) {
                    case 1:
                        Alert.alert(
                            "Feedback Submitted",
                            data.message,
                            [
                              { text: "OK", onPress: () => this.props.navigation.goBack() }
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
    async _deleteAccount(){
        this.setState({isLoading:true})
        const credentials={
            userId:this.state.user_id===''?'-1':this.state.user_id,
        }
        console.log('>>deleteApi',JSON.stringify(credentials))
        try {
          let response = await fetch(
           DELETE_ACCOUNT_URL,
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
                    
                console.log('>>checkCount',JSON.stringify(data))
                switch (data.status) {
                    case 1:
                        AsyncStorage.clear().then(() => {
                            AsyncStorage.setItem('isFirstTime','1').then(v=>{
                                fetchTokenFromFirebase().then(()=>{
                                    this.props.navigation.dispatch(resetStack);
                                });
                            })
                            
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
    render(){
        return(
            <View style={{flex:1,flexDirection:'column',backgroundColor:APP_MAJOR_BACKGROUND_COLOR}}>
            <SafeAreaView style={{backgroundColor:APP_MAJOR_BACKGROUND_COLOR}}/>
                    <StatusBar barStyle={'light-content'}/>
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
                        <Text style={{marginTop:25,color:BOLD_COLOR,fontSize:28
                    ,fontFamily:'Chivo-Bold'}}>
                            Delete Account
                        </Text>

                        <View style={{flex:1,flexDirection:'column'}}>
                        <Text style={{marginTop:35,color:NORMAL_COLOR,fontFamily:'Karla-Regular'}}>
                            We put a lot of effort to provide the best possible service to our customers.
                            If there is any thing
                            you would like us to imporve please let us know.
                        </Text>
                                    {/* <TextInput 
                                    multiline={true}
                                    placeholderTextColor={WHITE_BG_NO_BORDER}
                                    style={{
                                                    marginTop:25,
                                                    color:BOLD_COLOR,
                                                    fontFamily:'Karla-Regular',
                                                    height:120,
                                                    textAlign:'left',
                                                    textAlignVertical:'top',
                                                    borderRadius:12,padding:10,backgroundColor:'white'}}
                                                    onChangeText={(text)=>{this.setState({userFeedbackString:text})}}
                                                    value= {this.state.userFeedbackString}
                                                placeholder='Write here...'/>
                       <TouchableOpacity 
                        activeOpacity={1}
                        onPress={()=>this._sendFeedback()} style={{justifyContent:'flex-end',margin:16,justifyContent:'center',alignContent:'center',

                                                alignItems:'center'}}>
                                                                    <Text style={{   fontFamily:'Chivo-Bold',color:LINK_HIGHLIGHT_COLOR}}>
                                                                        Send
                                                                    </Text>
                                                </TouchableOpacity> */}
                       <View style={{justifyContent:'center',alignContent:'center',alignItems:'center',flex:1}}>
                                    

                                    <TouchableOpacity
                                     activeOpacity={1}
                                     onPress={()=>
                                                this.setState({deleteAccountConfirmation:true})} style={{justifyContent:'flex-end',margin:16,justifyContent:'center',alignContent:'center',
                                                alignItems:'center',marginTop:35}}>
                                                                    <Text style={{   
                                                                        fontFamily:'Chivo-Bold',color:LINK_HIGHLIGHT_COLOR,fontSize:21}}>
                                                                        Delete Account
                                                                    </Text>
                                                </TouchableOpacity>
                         
                       </View>
                       </View>
                   </View>
                    </ScrollView>
                    </KeyboardAvoidingView>   
                    <TouchableOpacity 
                     activeOpacity={1}
                    onPress={()=>this.props.navigation.goBack()} 
                    style={{justifyContent:'flex-end',margin:20,justifyContent:'center',alignContent:'center',
                    alignItems:'center',}}>
                                        <Text style={{   fontFamily:'Chivo-Bold',fontSize:21,color:LINK_HIGHLIGHT_COLOR}}>
                                            Back
                                        </Text>
                    </TouchableOpacity> 



                      <Modal
                                      presentationStyle='overFullScreen'
                                      animationType='none'
                                      visible={this.state.deleteAccountConfirmation}
                                      transparent={true}
                                      >
                                       
                              <BlurView
                    style={{position:'absolute',left:0,right:0,top:0,bottom:0}}
                    blurType='ultraThinMaterial'
                    blurAmount={2}
                    reducedTransparencyFallbackColor="white"
                    >
                        <View style={{flex:1, flexDirection:'column',
                        backgroundColor:'transparent', justifyContent:'center',alignContent:'center',
                        alignItems:'center'}}>
                                <Text style={{   fontFamily:'Karla-Regular',color:'white',textAlign:'center'}}>
                                    You are about to delete your{'\n'}account..
                                </Text>

                                <Text style={{   fontFamily:'Karla-Regular',color:'white',marginTop:15}}>
                                    Are you sure?
                                </Text>

                                <TouchableOpacity
                                 activeOpacity={1}
                                style={{position:'absolute',bottom:30,left:0,right:0}}
                                onPress={()=>
                                    this.setState({deleteAccountConfirmation:false})}>
                                    <Text style={{textAlign:'center',   fontFamily:'Chivo-Bold',color:LINK_HIGHLIGHT_COLOR,marginTop:20}}>
                                        No, go back
                                    </Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity
                                 activeOpacity={1}
                                onPress={()=>this._deleteAccount()}>
                                    <Text style={{   fontFamily:'Chivo-Bold',color:LINK_HIGHLIGHT_COLOR,marginTop:20}}>
                                        Yes, delete my account
                                    </Text>
                                </TouchableOpacity>
                                
                        </View>
                    </BlurView>           
                    </Modal> 
                     
              
              {this.state.isLoading?<ShowLoader/>:null}
            </View>
        );
    }
}

const resetStack = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'LoginScreen' })
        ],
});
export default DeleteAccount;