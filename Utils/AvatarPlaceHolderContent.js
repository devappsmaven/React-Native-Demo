import React ,{Component} from 'react';
import {
    ActivityIndicator,
    View,} from 'react-native';
import ShowLoader from './ShowLoader';
class AvatarPlaceHolderContent extends Component{
    render(){ 
            return(
                <View style={{height:'100%',width:'100%'
                       ,justifyContent:'center'}}>
                        <ShowLoader size={this.props.size} indicatorColor={true} canShowBackgroundColor={true}/>
                </View>
            )
        }
}
export default AvatarPlaceHolderContent;
