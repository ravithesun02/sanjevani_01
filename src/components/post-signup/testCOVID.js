import React from 'react';
import { View,Text,ScrollView } from 'react-native';
import { Card, List, ListItem, Button } from 'native-base';
import Swiper from 'react-native-swiper/src'
import { color } from 'react-native-reanimated';

class TestCovid extends React.Component{

    render(){
        return(
            <View>
                <View style={{justifyContent:'center',alignItems:'center',padding:40}}>
                    <Text> HOW IS YOUR HEALTH , LET US KNOW </Text>
                    <Text>Please answer correctly</Text>
                </View>
            </View>
        );
    }
}
export default TestCovid