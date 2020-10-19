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
    Linking,
    PermissionsAndroid,
    Dimensions,
    ActivityIndicator,} from 'react-native';
    import AsyncStorage from '@react-native-community/async-storage';
    import Geolocation from '@react-native-community/geolocation';
    import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { APP_TEXT_COLOR, APP_MAJOR_BACKGROUND_COLOR, GRADIENT_YELLOW_SHADE,
     BACK_BUTTON_IMAGE, APP_WHITE_COLOR, APP_GREY_COLOR,
      GRADIENT_ORANGE_SHADE, GRADIENT_DARK_ORANGE_SHADE, 
      BUTTON_HEIGHT, APP_BLUE_COLOR, BORDER_RADIUS, 
      APP_LIGHT_GREEN_COLOR,
      CROSS_ICON,
      INFO_ICON,
      NORMAL_COLOR,
      CHECK_BOX,
      RED_COLOR,GREEN_COLOR,
      SQUARE_ICON,CLASSIC_ICON,SWITCH_ICON,SWITCH_ON,
      CONTINUE_WITH_FB, APP_RED_COLOR, CREATE_ACCOUNT_WITH_MOBILE, 
      BACK_ARROW,
      STANDARD_CREATE_ACCOUNT, CUSTOMER_DASHBOARD, FORGOT_PASSWORD, PROFILE_SCREEN, getTokenFromAsync, APP_LOGO, BG_LIGHT, BOLD_COLOR, LINK_HIGHLIGHT_COLOR, _getLatLong,POINTER_ICON, HOME_ICON, CHECKED_BOX } from '../Utils/ConstantClass';
      import * as Progress from 'react-native-progress';
import ShowLoader from '../Utils/ShowLoader';
import { CUSTOMER_LOGIN_URL, LOGIN_URL, _DATA ,LOGIN_TYPE, OTHER_LOGIN, CUSTOMER_PROFILE} from '../Utils/UrlClass';
import ErrorMessageTextView from '../Utils/ErrorMessageTextView';
import * as T from '../Utils/AppTranslations';
import { WebView } from 'react-native-webview';
import MapView from 'react-native-maps';
import getDirections from 'react-native-google-maps-directions'
import { min } from 'react-native-reanimated';
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

class Restaurants extends Component{
    constructor(props){
        super(props)
        
        this.state={
            isLoading:false,
            user_id : '',
            userLocation:'',
            allRest : [],
            distance:[],
            showMapBool : false,
            openOnly:false,
            filterAllRest:[],
            filterDistance:[],
            limit:0
        
        }
        
    }
 

    async filteredList(){

            var localList =[]
            var localAddress = []
            var localDate = DAYS[new Date().getDay()-1]
            console.log('>>date', localDate,new Date().getDay())
            const resultArray = await Promise.all(
                this.state.allRest.map((tempActual,tempActualIndex)=>{
                    tempActual.Timings.map((item,index)=>{
                        console.log('>>item', item)
                        if(item.includes(localDate)){
                            localList.push(tempActual)
                            localAddress.push(this.state.distance[tempActualIndex])
                        }
                    })
                })
            );
    
            if(resultArray.length===this.state.allRest.length){
                this.setState({filterAllRest:localList, filterDistance:localAddress},()=>{
                    this.setState({isLoading:false})
                })
            }
        
        
        
    }

    async _getRestaurantList(latitude, longitude){
        this.setState({isLoading:true})
        const credentials={
            userId : this.state.user_id,
            lat : latitude,
            lng : longitude,
            skip:this.state.limit+'',
            openHours:this.state.openOnly?'1':'0'
        }
        console.log(JSON.stringify(credentials))
        try {
          let response = await fetch(
            


           GET_RESTAURANTS,
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
                        
                        if(data.data.allRest.length!=0){
                            this.state.limit===0? this.setState({allRest : data.data.allRest, 
                                distance:data.data.distance},()=>{
                                    this.setState({isLoading:false})
                                }):
                                this.setState({allRest :this.state.allRest.concat(data.data.allRest) , 
                                    distance:this.state.distance.concat(data.data.distance)},()=>{
                                        this.setState({isLoading:false})
                                    })
                        }
                                   
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
    
    componentDidMount(){
       this._getUserData()
    }
   
    _fetchLocation(){
        if (Platform.OS === 'android') {
            PermissionsAndroid.requestMultiple(
              [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, 
              PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION]
              ).then((result) => {
                if (result['android.permission.ACCESS_FINE_LOCATION']
                && result['android.permission.ACCESS_COARSE_LOCATION'] === 'granted') {
                    _getLatLong().then((location)=>{
                        console.log('>>in class',(typeof location));
                        if((typeof location) != 'string'){
                            this.setState({userLocation:location,showError:false},()=>{
                                console.log('>>in class',JSON.stringify(location));
                                this._getRestaurantList(location.latitude , location.longitude)
                                this.getCurrentLocation()
                            })
                        }else {
                        
                            RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
                            .then(data => {
                                this._fetchLocation()
                            }).catch(err => {
                                Alert.alert(
                                    'Location Denied',
                                    'Enable location in settings for accurate position',
                                    [
                                    {
                                        text: 'Okay',
                                        style: 'cancel',
                                        onPress: () => this._getRestaurantList('' , ''),
                                    }
                                    ],
                                    { cancelable: false }
                                );
                            });
                           
                        }
                    })
                } else if (result['android.permission.ACCESS_FINE_LOCATION']
                || result['android.permission.ACCESS_COARSE_LOCATION'] === 'never_ask_again') {
                    //    alert("Required permissions denied");
                    this._getRestaurantList('' , '')
                }
              });
        }else{
            _getLatLong().then((location)=>{
                console.log('>>in class',location);
                if(typeof location != 'string'){
                    this.setState({userLocation:location,showError:false},()=>{
                        this._getRestaurantList(location.latitude , location.longitude)
                        this.getCurrentLocation()
                    })
                }else{
                    alert('Enable location in settings for accurate position')
                }
            })
        }
    }

    _getUserData(){ 
        AsyncStorage.getItem('data').then((value) => {
            if(value!=null){
                const parsedData = JSON.parse(value)
                console.log('user_id', value)
                this.setState({user_id:parsedData.user._id},()=>{
                    this._fetchLocation()
                })
            }
        }).done();    
    }
   _loadMore=()=>{
        this.setState({limit:this.state.limit+1},()=>{
            this._getRestaurantList(this.state.userLocation.latitude,this.state.userLocation.longitude)
        })
    }
    renderMapPin(){
      return(
        <TouchableOpacity style={{justifyContent:'center',
            height:80,width:80,
                              alignContent:'center',alignItems:'center'}}>
                             <Image 
                                          style={{}}
                                          source={POINTER_ICON}
                                      />
            </TouchableOpacity>
      )
    }
    async getCurrentLocation() {
        let region = {
            latitude: this.state.userLocation==''?43.8501404:this.state.userLocation.latitude,
            longitude: this.state.userLocation==''?-13.0532459:this.state.userLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
        };
        await this.setState({
            initialRegion: region
        });
      }
    _set(marker){
        console.log('marker' , marker,' ',marker.latitude)
        this._handleGetDirections(marker.latitude, marker.longitude ,
            marker.fullAddress ,  marker.placeId)
    }
    render(){
        return(
           
   
            <View style={{flex:1,flexDirection:'column'}}>
            <SafeAreaView style={{backgroundColor:APP_MAJOR_BACKGROUND_COLOR}}/>
            <StatusBar barStyle={'dark-content'}/>
                    <View style={{flex:1,backgroundColor:APP_MAJOR_BACKGROUND_COLOR}}>  
                        <Text style={{paddingTop:20,marginLeft:30,marginRight:30,marginTop:25,fontFamily:'Chivo-Bold',color:BOLD_COLOR,fontSize:28}}>
                            Restaurants
                        </Text>
                       
                       <View style={{marginLeft:30,marginRight:30,marginTop:10,paddingRight:2,paddingStart:2,height:26,flexDirection:'row',alignContent:'center',alignItems:'center',justifyContent:'space-between'}}>
                           <TouchableOpacity 
                            activeOpacity={1}
                        onPress={()=>{
                            this.setState({openOnly:!this.state.openOnly},()=>{
                                if(this.state.userLocation===''){
                                    // this._fetchLocation()
                                    this.setState({distance:[], allRest:[],limit:0},()=>{
                                        this._getRestaurantList('', '')
                                    })
                                }else{
                                    this.setState({distance:[], allRest:[],limit:0},()=>{
                                        this._getRestaurantList(this.state.userLocation.latitude, this.state.userLocation.longitude)
                                    })
                                }
                            })
                        }}
                           style={{height:26,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                <Image source={this.state.openOnly?CHECKED_BOX:CHECK_BOX}
                                resizeMode='contain'
                                style={{marginRight:8}}/>
                                <Text style={{             fontFamily:'Karla-Regular',color:NORMAL_COLOR}}>
                                    Open now only
                                </Text>
                           </TouchableOpacity>
                           <TouchableOpacity 
                           onPress={()=>this.setState({showMapBool:!this.state.showMapBool})}
                           style={{height:26,justifyContent:'center'}}>
                                <Text style={{             fontFamily:'Chivo-Bold',color:LINK_HIGHLIGHT_COLOR}}>
                                   {this.state.showMapBool?'Back':'Show map'}
                                </Text>
                               
                           </TouchableOpacity>
                       </View>
                       {this.state.showMapBool?
                       <View style={{flex:1,flexDirection:'column'}}>
                       <MapView
                          ref={ref => (this.mapView = ref)}
                          style={{flex:1,borderRadius:5}}
                          mapType='standard'
                          provider='google'
                          maxZoomLevel={20}
                          zoomEnabled={true}
                          initialRegion={
                            this.state.initialRegion
                        }>
                          {!this.state.isLoading  ?
                            this.state.allRest.map((marker,index) => (
                               
                                <MapView.Marker
                                    onCalloutPress={()=>
                                        this._set(marker)}
                                    coordinate={
                                        {latitude: parseFloat(marker.latitude),
                                            longitude: parseFloat( marker.longitude)}
                                    }>
                                    {this.renderMapPin()}
                                    
                                    <MapView.Callout 
                                        
                                        tooltip style={{width:250,
                                        backgroundColor:APP_MAJOR_BACKGROUND_COLOR,padding:16,borderRadius:5}}>
                                        <PopUp marker={marker} index ={index} distance={this.state.distance}
                                         userLoc = {this.state.userLocation}/>
                                    </MapView.Callout>
                                </MapView.Marker>
                                )) 
                        : null}
                             
                        </MapView>
                       
                    </View>:
                    
                    this.state.allRest.length===0?
                    <View style={{flex:1,justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                        <Text style={{textAlign:'center',fontFamily:'Karla-Regular',color:NORMAL_COLOR}}>
                                    {/* No Restaurants found */}
                                </Text>
                        </View>:
                    this.state.allRest.length===0&&this.state.openOnly?
                    <View style={{flex:1,justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                    <Text style={{textAlign:'center',fontFamily:'Karla-Regular',color:NORMAL_COLOR}}>
                                No Restaurants found
                            </Text>
                    </View>:
                    <FlatList
                    onEndReached={this.state.allRest.length>4?this._loadMore:null}
                    onEndReachedThreshold={0.3}
                    showsVerticalScrollIndicator={false}
                    style={{marginLeft:30,marginRight:30,marginBottom:30}}
                            data={this.state.allRest}
                            renderItem={({ item, index , separator }) => 
                            <Item 
                            userLoc = {this.state.userLocation}
                            distance = {this.state.distance}
                            item={item}
                            index ={index}
                            />}
                            keyExtractor={item => item.id}
                        />}
                    </View>
                    {this.state.isLoading?<ShowLoader/>:null}        
            </View>
        
        );
    }

    _handleGetDirections = (lat,lng , fullAddress,placeId) => {
        console.log(lat,lng , fullAddress,placeId)
        const data = {
           source: {
            latitude: this.state.userLocation.latitude,
            longitude: this.state.userLocation.longitude
          },
          params: [
            {
              key: "travelmode",
              value: "driving"        // may be "walking", "bicycling" or "transit" as well
            },
            {
              key: "dir_action",
              value: "navigate"       // this instantly initializes navigation using the given travel mode
            },{
                key: "origin",
                value:  this.state.userLocation.latitude+','+this.state.userLocation.longitude // this instantly initializes navigation using the given travel mode
              },{
                key: "destination_place_id",
                value:  placeId // this instantly initializes navigation using the given travel mode
              },{
                key: "destination",
                value:  lat+','+lng // this instantly initializes navigation using the given travel mode
              },
              
          ],
        }
        getDirections(data)
      }
  
}
class PopUp extends Component{
    
    render(){
        let dateObject = new Date()
        let openingHours ;
            let  localDate = DAYS[dateObject.getDay()-1]
          
            if(localDate==='Monday'){
                if(this.props.marker.mondayOpenTime===''||this.props.marker.mondayCloseTime===''){
                    openingHours = '0'
                }else{
                    openingHours =  this.props.marker.mondayOpenTime+'-'+this.props.marker.mondayCloseTime
                }
            }else if(localDate==='Tuesday'){
                if(this.props.marker.tuesdayOpenTime===''||this.props.marker.tuesdayCloseTime===''){
                    openingHours = '0'
                }else{
                    openingHours =  this.props.marker.tuesdayOpenTime+'-'+this.props.marker.tuesdayCloseTime
                }
                
            }else if(localDate==='Wednesday'){
                if(this.props.marker.wednesdayOpenTime===''||this.props.marker.wednesdayCloseTime===''){
                    openingHours = '0'
                }else{
                    openingHours =  this.props.marker.wednesdayOpenTime+'-'+this.props.marker.wednesdayCloseTime
                }
               
            }else if(localDate==='Thursday'){
                if(this.props.marker.thursdayOpenTime===''||this.props.marker.thursdayCloseTime===''){
                    openingHours = '0'
                }else{
                    openingHours =  this.props.marker.thursdayOpenTime+'-'+this.props.marker.thursdayCloseTime
                }
               
            }else if(localDate==='Friday'){
                if(this.props.marker.fridayOpenTime===''||this.props.marker.fridayCloseTime===''){
                    openingHours = '0'
                }else{
                    openingHours =  this.props.marker.fridayOpenTime+'-'+this.props.marker.fridayCloseTime
                }
               
            }else if(localDate==='Saturday'){
                if(this.props.marker.saturdayOpenTime===''||this.props.marker.saturdayCloseTime===''){
                    openingHours = '0'
                }else{
                    openingHours =  this.props.marker.saturdayOpenTime+'-'+this.props.marker.saturdayCloseTime
                }
             
            }else if(localDate==='Sunday'){
                if(this.props.marker.sundayOpenTime===''||this.props.marker.sundayCloseTime===''){
                    openingHours = '0'
                }else{
                    openingHours =  this.props.marker.sundayOpenTime+'-'+this.props.marker.sundayCloseTime
                }
               
            }
        return(
            <View 
                                        
            style={{
                borderRadius:5,flex:1,flexDirection:'column'}}>
                <View style={{
                    marginTop:15,
                            flex:1,flexDirection:'column'}}>
                    <Text style={{             fontFamily:'Karla-Regular',color:NORMAL_COLOR}}>
                        {(parseInt(this.props.distance[this.props.index].distance)).toFixed(1)+'km'}
                        </Text>  
                        <Text style={{             fontFamily:'Chivo-Bold',color:BOLD_COLOR, fontSize:21}}>
                        {this.props.marker.name}
                        </Text>  
                        {openingHours==='0'?
                        <Text style={{fontSize:19,marginTop:5,fontFamily:'Karla-Regular',color:NORMAL_COLOR}}>
                        Closed
                        </Text>  
                        :<Text style={{fontSize:19,marginTop:5,fontFamily:'Karla-Regular',color:NORMAL_COLOR}}>
                        Today's hours: {openingHours}
                        </Text>  }  
                        <View 
                        style={{position:'absolute',right:0}}>
                        <Text style={{             fontFamily:'Chivo-Bold',color:LINK_HIGHLIGHT_COLOR}}>
                            Get directions
                        </Text>  
                        </View>
                </View>
                <Text style={{marginTop:15,width:'100%',height:1,opacity:.3,backgroundColor:NORMAL_COLOR}}/>
        </View>
    
        )
    }
}

class Item extends Component{
    _handleGetDirections = (lat,lng , fullAddress,placeId) => {
        console.log(lat,lng , fullAddress,placeId)
        const data = {
           source: {
            latitude: this.props.userLoc.latitude,
            longitude: this.props.userLoc.longitude
          },
          params: [
            {
              key: "travelmode",
              value: "driving"        // may be "walking", "bicycling" or "transit" as well
            },
            {
              key: "dir_action",
              value: "navigate"       // this instantly initializes navigation using the given travel mode
            },{
                key: "origin",
                value:  this.props.userLoc.latitude+','+this.props.userLoc.longitude // this instantly initializes navigation using the given travel mode
              },{
                key: "destination_place_id",
                value:  placeId // this instantly initializes navigation using the given travel mode
              },{
                key: "destination",
                value:  lat+','+lng // this instantly initializes navigation using the given travel mode
              },
              
          ],
        }
        getDirections(data)
      }
    render(){
        let dateObject = new Date()
    let openingHours ;
        let  localDate = DAYS[dateObject.getDay()-1]

        if(localDate==='Monday'){
            if(this.props.item.mondayOpenTime===''||this.props.item.mondayCloseTime===''){
                openingHours = '0'
            }else{
                openingHours =  this.props.item.mondayOpenTime+'-'+this.props.item.mondayCloseTime
            }
        }else if(localDate==='Tuesday'){
            if(this.props.item.tuesdayOpenTime===''||this.props.item.tuesdayCloseTime===''){
                openingHours = '0'
            }else{
                openingHours =  this.props.item.tuesdayOpenTime+'-'+this.props.item.tuesdayCloseTime
            }
            
        }else if(localDate==='Wednesday'){
            if(this.props.item.wednesdayOpenTime===''||this.props.item.wednesdayCloseTime===''){
                openingHours = '0'
            }else{
                openingHours =  this.props.item.wednesdayOpenTime+'-'+this.props.item.wednesdayCloseTime
            }
           
        }else if(localDate==='Thursday'){
            if(this.props.item.thursdayOpenTime===''||this.props.item.thursdayCloseTime===''){
                openingHours = '0'
            }else{
                openingHours =  this.props.item.thursdayOpenTime+'-'+this.props.item.thursdayCloseTime
            }
           
        }else if(localDate==='Friday'){
            if(this.props.item.fridayOpenTime===''||this.props.item.fridayCloseTime===''){
                openingHours = '0'
            }else{
                openingHours =  this.props.item.fridayOpenTime+'-'+this.props.item.fridayCloseTime
            }
           
        }else if(localDate==='Saturday'){
            if(this.props.item.saturdayOpenTime===''||this.props.item.saturdayCloseTime===''){
                openingHours = '0'
            }else{
                openingHours =  this.props.item.saturdayOpenTime+'-'+this.props.item.saturdayCloseTime
            }
         
        }else if(localDate==='Sunday'){
            if(this.props.item.sundayOpenTime===''||this.props.item.sundayCloseTime===''){
                openingHours = '0'
            }else{
                openingHours =  this.props.item.sundayOpenTime+'-'+this.props.item.sundayCloseTime
            }
           
        }
        return(
            <TouchableOpacity 
            activeOpacity={.9}
            style={{
                
                borderRadius:5,flex:1,flexDirection:'column'}}>
                 <View style={{
                    marginTop:15,
                            flex:1,flexDirection:'column'}}>
                      <Text style={{  fontSize:19,fontFamily:'Karla-Regular',color:NORMAL_COLOR}}>
                          {(parseInt(this.props.distance[this.props.index].distance)).toFixed(1)+'km'}
                        </Text>  
                        <Text style={{marginTop:3,             fontFamily:'Chivo-Bold',color:BOLD_COLOR, fontSize:21}}>
                        {this.props.item.name}
                        </Text>
                        {openingHours==='0'?
                        <Text style={{fontSize:19,marginTop:5,fontFamily:'Karla-Regular',color:NORMAL_COLOR}}>
                        Closed
                        </Text>  
                        :<Text style={{fontSize:19,marginTop:5,fontFamily:'Karla-Regular',color:NORMAL_COLOR}}>
                        Today's hours: {openingHours}
                        </Text>  }
                        
                        <TouchableOpacity 
                        onPress={()=>this._handleGetDirections(this.props.item.latitude, this.props.item.longitude ,
                            this.props.item.fullAddress ,  this.props.item.placeId)}
                        style={{position:'absolute',right:0}}>
                        <Text style={{             fontFamily:'Chivo-Bold',color:LINK_HIGHLIGHT_COLOR}}>
                            Get directions
                        </Text>  
                        </TouchableOpacity>
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
export default Restaurants;