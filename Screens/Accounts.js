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
    RefreshControl,
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
      STANDARD_CREATE_ACCOUNT, CUSTOMER_DASHBOARD, FORGOT_PASSWORD, PROFILE_SCREEN, getTokenFromAsync, APP_LOGO, BG_LIGHT, LINK_HIGHLIGHT_COLOR, LIGHT_RED_COLOR, LIGHT_GREEN, fetchTokenFromFirebase } from '../Utils/ConstantClass';
      import * as Progress from 'react-native-progress';
import ShowLoader from '../Utils/ShowLoader';
import { CUSTOMER_LOGIN_URL, LOGIN_URL, _DATA ,LOGIN_TYPE, OTHER_LOGIN, CUSTOMER_PROFILE} from '../Utils/UrlClass';
import ErrorMessageTextView from '../Utils/ErrorMessageTextView';
import * as T from '../Utils/AppTranslations';
import { WebView } from 'react-native-webview';

class Accounts extends Component{
    constructor(props){
        super(props)
        
        this.state={
            isLoading:false,
            user_id : '',
            hideInfo:false,
            pendingCount:0,
            totalCount:0,
            amountTotal : 0,
            progressCount:0,
            userName:'',
            refreshing:false,
            totalBorrowBox:0
        }
    }


    componentDidMount(){
        this._getUserData()
    }

    onRefresh =()=>{
        this.setState({refreshing:true},()=>{
            this._getAccountData()
        })
        console.log('refreshing')
    }
    async _getAccountData(){

        if(!this.state.refreshing){
            this.setState({isLoading:true})
        }
        const credentials={
            userId:this.state.user_id,
        }
        try {
          let response = await fetch(
           GET_TRANSACTION_COUNT,
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
                           this.setState({pendingCount:data.data.pendingCount, totalCount:data.data.boxCount,totalBorrowBox:data.data.countOfTotalBoxes},()=>{
                               this.setState({isLoading:false,
                            progressCount : this.state.pendingCount/10,},()=>console.log(this.state.progressCount))
                           })
                        break;
                    default:
                        this.setState({pendingCount:0,progressCount:0.00},()=>{
                            if(!this.state.refreshing){
                                this.setState({isLoading:false})
                            }else{
                                this.setState({refreshing:false})
                            }
                        })
                        
                        break;
                }
             });
          }else {
            if(!this.state.refreshing){
                this.setState({isLoading:false},()=>{
                    alert('Something went wrong'+'\n'+response.status)
                })
            }else{
                this.setState({refreshing:false})
            }
           
        }
        if(this.state.refreshing){
            if(!this.state.refreshing){
                this.setState({refreshing:false})
            }else{
                this.setState({refreshing:false})
            }
           
        }
        } catch (error) {
            if(!this.state.refreshing){
                this.setState({isLoading:false},()=>{
                    alert('Error in processing request')
                })
            }else{
                this.setState({refreshing:false})
            }
           
        }
    
} 
    _getUserData(){     
        AsyncStorage.getItem('data').then((value) => {
            if(value!=null){
                const parsedData = JSON.parse(value)
                console.log('user_id', parsedData.user)
                this.setState({user_id:parsedData.user._id, userName:parsedData.user.firstName},()=>{
                   this._getAccountData()
                })
            }
        }).done();     
    }
   


async _signOut(){
    console.log('>>user_id', this.state.user_id)
    this.setState({isLoading:true})
    const credentials={
        userId:this.state.user_id,
        userDeviceInfo:'{"token":"dsdasdasdasdasd","deviceType":"sjadjasbdjasdjbasdjhasd"}'
    }
    try {
      let response = await fetch(
       LOGOUT_URL,
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
                    AsyncStorage.clear().then(() => {
                        fetchTokenFromFirebase().then(()=>{
                            AsyncStorage.setItem('isFirstTime', '1').then(()=>{
                                this.props.navigation.dispatch(resetStack);
                            })
                            
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
            alert(T.s_something_went_wrong+'\n'+response.status)
        })
    }
    } catch (error) {
        this.setState({isLoading:false},()=>{
            alert(T.s_server_failed_to_process)
        })
    }

}


    render(){
        return(
            <View style={{flex:1,flexDirection:'column',backgroundColor:APP_MAJOR_BACKGROUND_COLOR}}>
            <SafeAreaView style={{backgroundColor:APP_MAJOR_BACKGROUND_COLOR}}/>
            <StatusBar barStyle={'dark-content'}/>
                    
                    <View style={{flex:1,backgroundColor:APP_MAJOR_BACKGROUND_COLOR,padding:20,marginLeft:10,marginRight:10}}>  
                        <View style={{marginTop:25, flexDirection:'row',justifyContent:'space-between'}}>
                        <Text style={{fontFamily:'Chivo-Bold',color:BOLD_COLOR,fontSize:28}}>
                            Account
                        </Text>
                            {/* <TouchableOpacity
                             activeOpacity={1}
                                     onPress={()=>this.setState({hideInfo:!this.state.hideInfo})}
                                    style={{justifyContent:'center',alignItems:'center',alignContent:'center'}}>
                                    <Image source={INFO_ICON}
                            style={{height:18,width:18}}/>
                            </TouchableOpacity> */}
                        </View>
                       
                        <KeyboardAvoidingView 
                                    style={{ flex: 1, 
                                    flexDirection: 'column',justifyContent: 'center',}} 
                                    behavior={Platform.OS=='ios'?'padding' :''}
                                    enabled
                                    keyboardVerticalOffset={Platform.OS=='ios'?20:10}>
                                    <ScrollView 
                                    refreshControl={
                                        <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
                                      }
                                    showsVerticalScrollIndicator={false}
                                    keyboardDismissMode='on-drag'
                                    keyboardShouldPersistTaps='always'
                                    >
                            <View style={{flexDirection:'column'}}>
                        <View style={{flexDirection:'column',height:40}}>
                            <Text style={{             fontFamily:'Karla-Regular',color:NORMAL_COLOR, fontSize:19}}>
                                {/* {this.state.pendingCount} transactions left before{'\n'}billing */}
                            </Text>  
                        
                            {/* <View style={{flex:1,flexDirection:'row',marginTop:10}}>
                                <View style={{flex:.8}}>
                                    <Progress.Bar 
                                    height={10}
                                    animated={false}
                                    unfilledColor='white'
                                    color={'#7CBA56'}
                                    borderWidth={0}
                                    
                                    indeterminate={false}
                                    progress={this.state.progressCount/10} 
                                    width= {Dimensions.get('window').width-120} />
                                </View>
                                <View style={{flex:.2,flexDirection:'column',
                                marginBottom:5,
                                    justifyContent:'center',alignContent:'center',alignItems:'flex-end',alignSelf:'center'}}>
                                        <Text style={{textAlign:'right',fontFamily:'Karla-Regular',color:NORMAL_COLOR, fontSize:14}}>
                                        10 DKK
                                        </Text>
                                        <Text style={{             fontFamily:'Karla-Regular',color:NORMAL_COLOR, fontSize:14}}>
                                        
                                        </Text>
                                </View>
                            </View>  */}

                            
                        </View>
                        <View style={{flexDirection:'row',flex:1,backgroundColor:'white',borderRadius:22,padding:16}}>
                            <Image source={AWARD_ICON}></Image>
                            <View style={{flexDirection:'column',paddingLeft:16}}>
                                        <Text style={{textAlign:'justify',fontFamily:'Karla-Regular',color:NORMAL_COLOR, fontSize:17}}>
                                    Great Job {this.state.userName}!
                                        </Text>
                                        <Text style={{            
                                             fontFamily:'Karla-Regular',marginTop:15,color:NORMAL_COLOR, fontSize:17}}>
                                            You have saved {this.state.totalBorrowBox} boxes.{'\n'}
                                            Equivalent to {parseInt(this.state.totalBorrowBox)*parseInt(40)>1000?
                                            (parseInt(this.state.totalBorrowBox)*parseInt(40)/1000).toFixed(2):
                                            parseInt(this.state.totalBorrowBox)*parseInt(40)}
                                            {parseInt(this.state.totalBorrowBox)*parseInt(40)>1000?'Kg':'g'} of {'\n'}plastic{' and '}

                                            {parseInt(this.state.totalBorrowBox)*parseInt(56)>1000?
                                            (parseInt(this.state.totalBorrowBox)*parseInt(56)/1000).toFixed(2):
                                            parseInt(this.state.totalBorrowBox)*parseInt(56)}
                                            {parseInt(this.state.totalBorrowBox)*parseInt(56)>1000?'Kg':'g'} of Co2
                                        </Text>
                            </View>
                        </View>

                        <View style={{flexDirection:'column',padding:16,marginTop:15,justifyContent:'center',alignItems:'center',alignContent:'center'}}>
                            <TouchableOpacity
                            activeOpacity={1}
                            onPress={()=>this.props.navigation.navigate('Tutorial',{justView:'0'})} >
                                        <Text style={{ fontFamily:'Chivo-Bold',color:LINK_HIGHLIGHT_COLOR,fontSize:21}}>
                                            How does it work?
                                        </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                             activeOpacity={1}
                             onPress={()=>this.props.navigation.navigate('EditAccount')} 
                            style={{marginTop:22}}>
                                        <Text style={{             fontFamily:'Chivo-Bold',color:LINK_HIGHLIGHT_COLOR,fontSize:21}}>
                                            Edit Account
                                        </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                             activeOpacity={1}
                             onPress={()=>this.props.navigation.navigate('EditPayment')}
                            style={{marginTop:22}}>
                                        <Text style={{             fontFamily:'Chivo-Bold',
                                        color:LINK_HIGHLIGHT_COLOR,fontSize:21}}>
                                            Edit Payment
                                        </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                             activeOpacity={1}
                            onPress={()=>this.props.navigation.navigate('DeleteAccount')}style={{marginTop:22}}>

                                        <Text style={{fontFamily:'Chivo-Bold',color:LINK_HIGHLIGHT_COLOR,fontSize:21}}>
                                            Delete Account
                                        </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                             activeOpacity={1}
                            style={{marginTop:22}}
                            onPress={()=>this.props.navigation.navigate('WebScreen',{
                                url : 'https://admin.kleenhub.com/terms',
                                text: 'Terms and\nconditions'
                            })}>
                                        <Text style={{             fontFamily:'Chivo-Bold',color:LINK_HIGHLIGHT_COLOR,fontSize:21}}>
                                            Terms and Conditions
                                        </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                             activeOpacity={1}
                             style={{marginTop:22}}
                            onPress={()=>this.props.navigation.navigate('WebScreen',{
                                url : 'https://admin.kleenhub.com/contact-us',
                                text: 'Contact Us'
                            })}>
                                        <Text style={{             fontFamily:'Chivo-Bold',color:LINK_HIGHLIGHT_COLOR,fontSize:21}}>
                                            Contact Us
                                        </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                             activeOpacity={1}
                             style={{marginTop:22}}
                            onPress={()=>this.props.navigation.navigate('WebScreen',{
                                url : 'https://admin.kleenhub.com/tprivacy-policyerms',
                                text: 'Privacy Policy'
                            })}>
                                        <Text style={{             fontFamily:'Chivo-Bold',color:LINK_HIGHLIGHT_COLOR,fontSize:21}}>
                                            Privacy Policy
                                        </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                             activeOpacity={1}
                            onPress={()=>this._signOut()}
                            style={{marginTop:22}}>
                                        <Text style={{             fontFamily:'Chivo-Bold',color:LINK_HIGHLIGHT_COLOR,fontSize:21}}>
                                            Sign Out
                                        </Text>
                            </TouchableOpacity>
                        </View>
                    {this.state.hideInfo?
                    <View style={{marginTop:40,backgroundColor:APP_MAJOR_BACKGROUND_COLOR,position:'absolute',
                            flex:1,left:0,right:0,top:0,bottom:0}}>
                            <Text style={{marginRight:36,color:NORMAL_COLOR,fontSize:19,textAlign:'justify'}}>
                                Everytime you borrow boxes you pay 1 DKK. Regardless of how many boxes you are borrowing at that time.
                                You only pay 1 DKK per transaction.
                                This fee only applies to borrow transaction not returns
                            </Text>

                            <Text style={{textAlign:'justify',marginRight:36,color:NORMAL_COLOR,fontSize:19,marginTop:15}}>To avoid billing you to often, we wait that you have completed 10 transactions and then we will bill 10 DKK.
                             
                            </Text>
                            <TouchableOpacity
                             activeOpacity={1}
                                onPress={()=>this.setState({hideInfo:!this.state.hideInfo})}
                                style={{position:'absolute',top:0,right:0}}>
                               <Image source={CROSS_ICON}
                               resizeMode='contain'
                                   style={{height:24,width:24}}/>
                            </TouchableOpacity>
                        </View>
                        :null}
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
    actions: [NavigationActions.navigate({ routeName: 'LoginScreen'})
        ],
});
export default Accounts;