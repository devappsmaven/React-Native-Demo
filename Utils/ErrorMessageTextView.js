import React , {Component} from 'react';
import {View , Text} from  'react-native';
import { APP_RED_COLOR } from './ConstantClass';
class ErrorMessageTextView extends Component {
    constructor(props){
        super(props);
    }
    render(){
        return(
            <Text style={{fontSize:16,fontWeight:'100',marginTop:10,padding:5,color:APP_RED_COLOR,textAlign:'center'}}>
                {this.props.msg}
            </Text>
        )
    }
}
export default ErrorMessageTextView;