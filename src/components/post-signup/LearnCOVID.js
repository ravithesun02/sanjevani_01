import React from 'react';
import { Text,View, StyleSheet,Animated,ImageBackground} from 'react-native';
import {FAQ,Sawal}from '../assests/COVID';
import { Button, Accordion ,Content,Icon, Fab} from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';



class LearnCOVID extends React.Component{
   constructor(props)
   {
       super(props);
       this.state={
           hindi:false,
           Data1:FAQ
       }
   }
    toggleHindi(){
        this.setState({hindi:!this.state.hindi});
        if(this.state.hindi)
        {
            this.setState({Data1:Sawal});
        }
        else
        {
            this.setState({Data1:FAQ});
        }
        
    }

     _renderHeader=(item, expanded)=> {
         console.log(item.question);
        return (
          <View style={{
            flexDirection: "row",
            padding: 10,
            justifyContent: "space-between",
            alignItems: "center" ,
            margin:5
             }}>
          <Text style={{ fontWeight: "bold",fontFamily:'MSRegular',fontSize:16,color:'black' }}>
              {item.question}
            </Text>
            {expanded
              ? <Icon style={{ fontSize: 18 }} name="remove-circle" />
              : <Icon style={{ fontSize: 18 }} name="add-circle" />}
          </View>
        );
      }

      _renderContent=(item)=> {
         return (
            <View style={{flex:1}} >
            <View style={{justifyContent:'center',alignItems:'center',width:'90%'}}>
               <Text style={{fontFamily:'MSRegular',fontSize:16,textAlign:'center'}}>{item.answer}</Text>
            </View>
        </View>
        );
      }


    render(){
        return(
            <ImageBackground source={require('../assests/images/back.png')} style={{width:'100%',height:'100%'}}>
               
            <Button transparent style={{position:'absolute',top:4,left:10}} onPress={()=>this.props.navigation.toggleDrawer()}>
                       <Ionicons color='#ef8354' name="md-menu" size={32}/>
                    </Button>
            <View style={{justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontWeight:'bold',fontSize:18}}>COVID-19 Dashboard</Text>
                     <Text style={{fontWeight:'bold',fontSize:18,marginVertical:'4%'}}>State Wise Data</Text>
            </View>
            <View>
            {this.state.hindi ? <View><FontAwesome5.Button name="toggle-on" onPress={()=>this.toggleHindi()}><Text>हिन्दी</Text></FontAwesome5.Button></View> : <View><FontAwesome5.Button name="toggle-off" onPress={()=>this.toggleHindi()} ><Text>हिन्दी</Text></FontAwesome5.Button></View>}

            </View>

            
            <SafeAreaProvider>
            <SafeAreaView>
             <Accordion
             dataArray={this.state.Data1}
             animation={true}
             expanded={true}
             renderHeader={this._renderHeader}
             renderContent={this._renderContent}
            />

            </SafeAreaView>
            </SafeAreaProvider>




                
           
       
        </ImageBackground>
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