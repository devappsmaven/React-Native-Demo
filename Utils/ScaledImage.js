import * as React from 'react'
import {Image,View,ActivityIndicator} from 'react-native'
import { useEffect } from 'react'


const ScaledImage = props => {

    const [width, setWidth] = React.useState()
    const [height, setHeight] = React.useState()
    const [imageLoading, setImageLoading] = React.useState(true)

    useEffect(() => {
        Image.getSize(props.uri, (width1, height1) => {
            if (props.width && !props.height) {
                setWidth(props.width)
                setHeight(height1 * (props.width / width1))
            } else if (!props.width && props.height) {
                setWidth(width1 * (props.height / height1))
                setHeight(props.height)
            } else {
                setWidth(width1)
                setHeight(height1)
            }
            setImageLoading(false)
        }, (error) => {
            console.log("ScaledImage,Image.getSize failed with error: ", error)
        })
    }, [])


    return (
        height ?
            <View style={{ height: height, width: width, backgroundColor: "lightgray" }}>
                <Image
                    source={{ uri: props.uri }}
                    style={{ height: height, width: width, }}
                />
            </View>
            : imageLoading ?
                <ActivityIndicator size="large" />
                : null
    );
}

export default ScaledImage;