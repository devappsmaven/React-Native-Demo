import React ,{Component} from 'react';
import {
    ActivityIndicator,
    View,} from 'react-native';
import { APP_GREEN_COLOR, APP_MAJOR_BACKGROUND_COLOR, APP_DARK_HEADER_AND_PRIMARY_COLOR, APP_WHITE_COLOR, APP_GREY_COLOR } from './ConstantClass';
class ShowLoader extends Component{
    render(){ 
            return(
                <View style={{width:'100%',height:'100%',
                                position:'absolute',justifyContent:'center',
                                alignSelf:'center'}}>
                        <View style={{alignSelf:'center',borderRadius:5,padding:10,
                        backgroundColor:'transparent'}}>
                                <ActivityIndicator 
                                size={this.props.size?'small':'large'} color={this.props.indicatorColor?APP_MAJOR_BACKGROUND_COLOR:"#00ff00"} />
                        </View>       
                </View>
            )
        }
}
export default ShowLoader;