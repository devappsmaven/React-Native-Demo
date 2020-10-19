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
    RefreshControl,
    Platform,
    Dimensions,
    ActivityIndicator,} from 'react-native';
    import AsyncStorage from '@react-native-community/async-storage';
import { APP_TEXT_COLOR, APP_MAJOR_BACKGROUND_COLOR, GRADIENT_YELLOW_SHADE,
     BACK_BUTTON_IMAGE, APP_WHITE_COLOR, APP_GREY_COLOR,
      GRADIENT_ORANGE_SHADE, GRADIENT_DARK_ORANGE_SHADE, 
      BUTTON_HEIGHT, APP_BLUE_COLOR, BORDER_RADIUS, 
      APP_LIGHT_GREEN_COLOR,
      CROSS_ICON,
      INFO_ICON,
      NORMAL_COLOR,
      RED_COLOR,GREEN_COLOR,
      SQUARE_ICON,CLASSIC_ICON,SWITCH_ICON,SWITCH_ON,
      CONTINUE_WITH_FB, APP_RED_COLOR, CREATE_ACCOUNT_WITH_MOBILE, 
      BACK_ARROW,
      STANDARD_CREATE_ACCOUNT, CUSTOMER_DASHBOARD, FORGOT_PASSWORD, PROFILE_SCREEN, getTokenFromAsync, APP_LOGO, BG_LIGHT, BOLD_COLOR, LINK_HIGHLIGHT_COLOR } from '../Utils/ConstantClass';
      import * as Progress from 'react-native-progress';
import ShowLoader from '../Utils/ShowLoader';
import { CUSTOMER_LOGIN_URL, LOGIN_URL, _DATA ,LOGIN_TYPE, OTHER_LOGIN, CUSTOMER_PROFILE} from '../Utils/UrlClass';
import ErrorMessageTextView from '../Utils/ErrorMessageTextView';
import * as T from '../Utils/AppTranslations';
import { WebView } from 'react-native-webview';
const FLAT_DATA = [
    {time:'6 hours, 23 minutes left',container:'3 large, 1 medium',status:false, progressValue:50, amount:'1300'},
    {time:'4 days, 18 hours left',container:'1 medium',status:true, progressValue:10, amount:'800'}]
class TransactionHistory extends Component{
    constructor(props){
        super(props)
        
        this.state={
            isLoading:false,
            user_id : '',
            transactionList:'',
            refreshing:false,
            limit:0
        }
    }


    componentDidMount(){
        this._getUserData()
    }
   
    _getUserData(){     
        AsyncStorage.getItem('data').then((value) => {
            if(value!=null){
                const parsedData = JSON.parse(value)
                console.log('user_id', parsedData.user._id)
                this.setState({user_id:parsedData.user._id},()=>{
                    this._getTransactionHistory()
                })
            }
        }).done();     
    }
    
    async _getTransactionHistory(){
        if(!this.state.refreshing){
            this.setState({isLoading:true})
        }
        const credentials={
            userId:this.state.user_id,
            skip:this.state.limit+''
        }
        try {
          let response = await fetch(
           TRANSCATION_HISTORY,
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
                    if(!this.state.refreshing){
                        this.setState({isLoading:false})
                    }else{
                        this.setState({refreshing:false})
                    }
                console.log('>>transactionData',JSON.stringify(data))
                switch (data.status) {
                    case 1:
                            if(data.data.rest.length!=0){
                                console.log('>>transactionList',JSON.stringify(data))
                                this.state.limit===0? this.setState({transactionList : data.data.rest},()=>{
                                    if(!this.state.refreshing){
                                        this.setState({isLoading:false})
                                    }else{
                                        this.setState({refreshing:false})
                                    }
                                    }):
                                    this.setState({transactionList : this.state.transactionList.concat(data.data.rest)},()=>{
                                        if(!this.state.refreshing){
                                            this.setState({isLoading:false})
                                        }else{
                                            this.setState({refreshing:false})
                                        }
                                    })
                            }
                        break;
                    default:
                        if(!this.state.refreshing){
                            this.setState({isLoading:false},()=>{
                                alert(data.message)
                            })
                        }else{
                            this.setState({refreshing:false},()=>{
                                alert(data.message)
                            })
                        }
                        break;
                }
             });
          }else {
            if(!this.state.refreshing){
                this.setState({isLoading:false},()=>{
                    alert('Something went wrong'+'\n'+response.status)
                })
            }else{
                this.setState({refreshing:false},()=>{
                    alert('Something went wrong'+'\n'+response.status)
                })
            }
        }
        } catch (error) {
            if(!this.state.refreshing){
                this.setState({isLoading:false},()=>{
                    alert('Error in processing request')
                })
            }else{
                this.setState({refreshing:false},()=>{
                    alert('Error in processing request')
                })
            }
        }
    
}  onRefresh = ()=>{
    this.setState({refreshing:true},()=>{
        this._getTransactionHistory()
    })
    
}
_loadMore=()=>{
    this.setState({limit:this.state.limit+1},()=>{
        this._getTransactionHistory()
    })
}

    render(){
        return(
            <View style={{flex:1,flexDirection:'column',backgroundColor:APP_MAJOR_BACKGROUND_COLOR}}>
            <SafeAreaView style={{backgroundColor:APP_MAJOR_BACKGROUND_COLOR}}/>
            <StatusBar barStyle={'dark-content'}/>
                    <View style={{flex:1,backgroundColor:APP_MAJOR_BACKGROUND_COLOR,padding:20,marginLeft:10,marginRight:10}}>  
                        <Text style={{marginTop:25,fontFamily:'Chivo-Bold',color:BOLD_COLOR,fontSize:28}}>
                            Transactions{'\n'}history
                        </Text>
                       
                       <TouchableOpacity style={{alignContent:'flex-end'}}
                       onPress={()=>this.props.navigation.goBack()}>
                       <Text style={{textAlign:'right',fontFamily:'Chivo-Bold',color:LINK_HIGHLIGHT_COLOR}}>
                            Back
                        </Text>
                       </TouchableOpacity>
                       {this.state.transactionList.length===0?
                       <View style={{flex:1,justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                       <Text style={{fontFamily:'Karla-Regular',color:NORMAL_COLOR}}>
                           No transactions found
                       </Text>
                        </View>:
                        <FlatList
                        ListFooterComponent={()=>{
                            return(
                                this.state.limit!=0&&this.state.isLoading?<View style={{padding:5,justifyContent:'center',
                            alignContent:'center',alignItems:'center'}}><ActivityIndicator size='small'/></View>:null
                            )
                            
                        }}
                        onEndReached={this._loadMore}
                        onEndReachedThreshold={0.3}
                        showsVerticalScrollIndicator={false}
                        style={{marginTop:15}}
                            data={this.state.transactionList}
                            refreshControl={<RefreshControl 
                                refreshing={this.state.refreshing} 
                                onRefresh={this.onRefresh} />}
                            renderItem={({ item, index , separator }) => 
                            <Item 
                            item={item}
                            index ={index}
                            />}
                            keyExtractor={item => item.id}
                        /> 
                       }

                    </View>
                    {this.state.isLoading?<ShowLoader/>:null}   
            </View>
        );
    }
}

class Item extends Component{
    render(){
        return(
            <TouchableOpacity 
            activeOpacity={.9}
            style={{
                
                borderRadius:5,flex:1,flexDirection:'column'}}>
                 <View style={{
                    marginTop:15,
                            flex:1,flexDirection:'column'}}>
                      <Text style={{             fontFamily:'Karla-Regular',color:NORMAL_COLOR}}>
                          {this.props.item.type==='Borrow'?'Borrowed on ':'Returned on '} 
                            {(new Date(this.props.item.createdOn).getDate())>=10?
                            new Date(this.props.item.createdOn).getDate():
                            '0'+new Date(this.props.item.createdOn).getDate()}
                            {'/'}{(parseInt(new Date(this.props.item.createdOn).getMonth())+1)>=10?
                            parseInt(new Date(this.props.item.createdOn).getMonth())+1:
                            '0'+(parseInt(new Date(this.props.item.createdOn).getMonth())+1)}
                            {'/'}{new Date(this.props.item.createdOn).getFullYear()}
                            {' '}
                            {new Date(this.props.item.createdOn).getHours()>=10?
                            new Date(this.props.item.createdOn).getHours():
                            '0'+new Date(this.props.item.createdOn).getHours()}{':'}
                            {new Date(this.props.item.createdOn).getMinutes()>=10
                            ?new Date(this.props.item.createdOn).getMinutes():
                            '0'+new Date(this.props.item.createdOn).getMinutes()}
                        </Text>  
                        <Text style={{             fontFamily:'Chivo-Bold',color:BOLD_COLOR, fontSize:21}}>
                          {this.props.item.type==='Borrow'?
                          this.props.item.borrowNumberOfCleanBoxesMedium+' medium, '+
                          this.props.item.borrowNumberOfCleanBoxesLarge+' large':
                          this.props.item.returnNumberOfUsedBoxesMedium+' medium, '+
                          this.props.item.returnNumberOfUsedBoxesLarge +' large'}
                        </Text>  
                        <Text style={{             fontFamily:'Karla-Regular',color:NORMAL_COLOR}}>
                         {this.props.item.restaurantId.name}
                        </Text>  
                 </View>
                 <Text style={{marginTop:15,width:'100%',height:1,opacity:.3,backgroundColor:NORMAL_COLOR}}/>
            </TouchableOpacity>
        )
    }
  }

  
const resetStack = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'LoginScreen' })
        ],
});
export default TransactionHistory;