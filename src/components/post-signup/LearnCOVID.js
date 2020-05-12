import React from 'react';
import { Text,View, StyleSheet,Animated} from 'react-native';
import data from '../assests/COVID';
import { Button, Accordion ,Content} from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';


var Data1 = data.FAQ;
var Data2 = data.sawal;
class LearnCOVID extends React.Component{
    state={
        hindi:true,
        opacity:new Animated.Value(0)
    }
    toggleHindi(){
        this.setState({hindi:!this.state.hindi})
    }
    onLoad = () => {
        this.state.opacity.setValue(0)
       Animated.timing(this.state.opacity, {
         toValue: 1,
         duration: 1000,
         useNativeDriver: true,
       }).start();
     }

     _renderHeader =(item, expanded) =>{
        return (
          <View style={{
            flexDirection: "row",
            padding: 10,
            justifyContent: "space-between",
            alignItems: "center" ,
            margin:5
             }}>
          <Text style={{ fontWeight: "bold",fontFamily:'MSRegular',fontSize:16,backgroundColor:'black' }}>
              {item.question}
            </Text>
            {expanded ? <Text>yes</Text>:<Text>no</Text>}
          </View>
        );
      }

      _renderContent=(item)=> {
         return (
            <View style={{flex:1}} >
            <View>
               <Text style={{fontFamily:'MSRegular',marginRight:'10%',fontSize:16}}>{item.answer}</Text>
            </View>
        </View>
        );
      }


    render(){
        return(
            <View>
            <View style={{alignItems:'center',justifyContent:'center',padding:30}}>
                <Text style={{fontSize:20,fontWeight:'bold',color:'red'}}>  CORONA VIRUS ?</Text>
            </View>
            <View>
                {this.state.hindi ? <View><FontAwesome5.Button name="toggle-on" onPress={()=>this.toggleHindi()}><Text>हिन्दी</Text></FontAwesome5.Button></View> : <View><FontAwesome5.Button name="toggle-off" onPress={()=>this.toggleHindi()} ><Text>हिन्दी</Text></FontAwesome5.Button></View>}
            </View> 
                <SafeAreaProvider>
                <SafeAreaView>
                 <Accordion
                 dataArray={Data1}
                 animation={true}
                 expanded={true}
                 renderHeader={this._renderHeader}
                 renderContent={this._renderContent}
                />

                </SafeAreaView>
                </SafeAreaProvider>
            </View>
        );
    }
}
const styles =StyleSheet.create({
    text:{
        justifyContent:'center',
        alignItems:'center',
        fontWeight:'700',
    }
});
export default LearnCOVID