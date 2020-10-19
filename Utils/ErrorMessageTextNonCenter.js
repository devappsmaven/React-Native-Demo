import React , {Component} from 'react';
import {Text} from 'react-native';
 
class ErrorMessageTextNonCenter extends Component {
    constructor(props){
        super(props);
    }
    render(){
        return(
            <Text style={{marginTop:5,fontWeight:'500',padding:5,color:'red'}}>
                {this.props.msg}
            </Text>
        )
    }
}
export default ErrorMessageTextNonCenter;
