import React, {Component} from 'react';
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
    FlatList,
    ImageBackground,
    PermissionsAndroid,
    Alert,
    Modal,
    Dimensions} from 'react-native';
    import { APP_TEXT_COLOR, APP_MAJOR_BACKGROUND_COLOR, APP_YELLOW_COLOR,
        GRADIENT_YELLOW_SHADE, BACK_BUTTON_IMAGE, APP_WHITE_COLOR, APP_GREY_COLOR,
         GRADIENT_ORANGE_SHADE, GRADIENT_DARK_ORANGE_SHADE, BUTTON_HEIGHT,
          APP_BLUE_COLOR, BORDER_RADIUS, ADD_WITHOUT_SHADOW, 
          ADD_WITH_SHADOW, APP_DARK_HEADER_AND_PRIMARY_COLOR, 
          APP_GREEN_COLOR, PROFILE_IMAGE_SIZE, 
          APP_HEADER_AND_PRIMARY_COLOR, LIST_ITEM_BACKGROUND, 
          NOTIFICATION, DEFAULT_IMAGE, PROFILE_IMAGE_HEADER_SIZE,
           PROFILE_SCREEN, PROFILE_SCREEN_INSTALLER, 
           INSTALLER_JOB_DETAIL, PROFILE_BACK_HEADER_SIZE, BACK_BUTTON_GREY, APP_BLACK_COLOR, APP_RED_COLOR }
           from '../Utils/ConstantClass';
  
class ReusableModal extends Component{
    constructor(props){
        super(props);
  
        this.state={
            isLoading:true,
            serverErrorMessage:false,
            responseHolder:'',
            errorMessage:'',
            jobId:'',
            isPermissionGranted : false,
            showError:false,
            isModalVisible:this.props.isModalVisible
        }
    }

    render(){
        return(
<Modal
            presentationStyle='overFullScreen'
            animationType='none'
            transparent={true}
            visible={this.state.isModalVisible}>
                <View style={{
                        flex:1,
                        opacity:.5,
                        backgroundColor:APP_BLACK_COLOR,}}/>
                <View style={{
                        position:'absolute',
                        marginTop:'auto',
                        marginBottom:'auto',
                        top:0,bottom:0,
                        backgroundColor:'transparent',
                        alignItems:'center',
                        justifyContent:'center',
                        alignSelf:'center',}}>
                        <View style={{
                            width:300,
                            borderRadius:10,
                            flexDirection:'column',
                            backgroundColor:APP_WHITE_COLOR,}}>
                            <Text style={{fontSize:16,
                            textAlign:'center',
                                   padding:16,color:APP_RED_COLOR}}>
                                    {this.props.title}
                            </Text>
                            <Text style={{fontSize:16,textAlign:'center',
                                   paddingLeft:16,paddingBottom:16,paddingRight:16,color:APP_BLACK_COLOR}}>
                                   {this.props.body}
                            </Text>
                            <View style={{flexDirection:'row',borderBottomRightRadius:10,borderBottomLeftRadius:10,height:50,backgroundColor:'grey'}}>
                               <TouchableOpacity 
                                    onPress={()=>{this.setState({isModalVisible : false})}}
                                style={{flex:1,
                                    backgroundColor:APP_MAJOR_BACKGROUND_COLOR,
                                justifyContent:'center',
                                borderBottomRightRadius:10,borderBottomLeftRadius:10}}>
                                    <Text style={{textAlign:'center'
                                        ,color:APP_WHITE_COLOR}}>
                                        Close
                                    </Text>   
                                </TouchableOpacity>
                            </View>
                    </View>
                </View>
        </Modal>

        )
    }
}
export default ReusableModal