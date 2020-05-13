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
          <Text style={{ fontFamily:'Right',fontSize:16,color:'#4E4E4E',width:'90%' }}>
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
            <View style={{margin:'2%'}}>
               <Text style={{fontFamily:'MSRegular',fontSize:16,textAlign:'center', alignSelf:'center'}}>{item.answer}</Text>
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
            <View style={{justifyContent:'center',alignItems:'center',paddingTop:'10%',marginVertical:'2%'}}>
                    <Text style={{fontFamily:'Right',fontSize:28,color:'red'}}>CORONA VIRUS ?</Text>
            </View>
                <View style={{position:'absolute',top:0,right:0}}>
                    {this.state.hindi ? 
                    <Button transparent style={{padding:10,flexDirection:'row'}} onPress={()=>this.toggleHindi()}>
                        <FontAwesome5 name='toggle-on' size={22} />
                        <Text style={{fontSize:15}} >{" "} हिन्दी</Text>
                    </Button>
                    :
                    <Button transparent style={{padding:10,flexDirection:'row'}} onPress={()=>this.toggleHindi()}>
                    <FontAwesome5 name='toggle-off' size={22} />
                    <Text style={{fontSize:15}} > {" "}English</Text>
                </Button>}
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