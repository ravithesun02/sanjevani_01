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
           Data1:FAQ,
           Data2:Sawal
       }
   }
    toggleHindi(){
        this.setState({hindi:!this.state.hindi});        
    }

     _renderHeader=(item, expanded)=> {
        return (
          <View style={{
            flexDirection: "row",
            padding: 10,
            justifyContent: "space-between",
            alignItems: "center" ,
            margin:5,
             }}>
          <Text style={{ fontWeight: "bold",fontFamily:'MSRegular',fontSize:16,color:'#4E4E4E',width:'90%',borderBottomColor:'#4E4E4E',borderBottomWidth:0.5 }}>
              {item.question}
            </Text>
            {expanded
              ? <FontAwesome5 style={{ fontSize:18,alignSelf:'flex-end'}} name="chevron-up"/>
              : <FontAwesome5 style={{ fontSize:18,alignSelf:'flex-end'}} name="chevron-down"/>}
          </View>
        );
      }

      _renderContent=(item)=> {
         return (
            <View style={{flex:1}} >
            <View style={{width:'100%'}}>
               <Text style={{fontFamily:'MSRegular',fontSize:16,textAlign:'center', alignSelf:'flex-start'}}>{item.answer}</Text>
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
            <View style={{justifyContent:'center',alignItems:'center',paddingTop:'10%'}}>
                    <Text style={{fontWeight:'bold',fontSize:28,color:'red'}}>CORONA VIRUS?</Text>
            </View>
                <View style={{ width:'20%',alignSelf:'flex-end', backgroundColor:'red',borderRadius:20}}>
                    {this.state.hindi ? 
                    <FontAwesome5.Button name="toggle-on" onPress={()=>this.toggleHindi()}>हिन्दी</FontAwesome5.Button> 
                    :
                    <FontAwesome5.Button name="toggle-off" onPress={()=>this.toggleHindi()} >हिन्दी</FontAwesome5.Button>}
                </View>

            {this.state.hindi ? 
            <SafeAreaProvider>
            <SafeAreaView>
             <Accordion
             dataArray={this.state.Data2}
             animation={true}
             expanded={true}
             renderHeader={this._renderHeader}
             renderContent={this._renderContent}
            />

            </SafeAreaView>
            </SafeAreaProvider>
            
            :
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
            }




                
           
       
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