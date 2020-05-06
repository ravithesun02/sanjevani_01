import React, { Component } from 'react';
import {  StyleSheet, Text, View,Image} from 'react-native';
import {Button } from 'native-base';


import Swiper from 'react-native-swiper/src'

const styles = StyleSheet.create({
  wrapper: {},
  slide1: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#A4A3D1'
  },
  slide2: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#D1A3A3'
  },
  slide3: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#92BBD9'
  },
  slide4: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#CED1A3'
  },
 
  skipbtn:{
    flex:1,
    justifyContent:'flex-end',
    alignItems:'flex-start',
    marginLeft:20,
   marginBottom:45  
  },
  skipText:{
    color:'#5C5C5C',
    fontWeight:'bold',
    letterSpacing:2
  },
  Nextbtn:{
    flex:1,
    justifyContent:'flex-end',
    alignItems:'flex-end',
    marginRight:20,
    marginBottom:45
  },
  NextTxt:{
  fontWeight:'bold',
  color:'#ee5f0f',
  letterSpacing:2
  }
})

export default class SwipeImage extends Component {
  render() {
    return (
      <Swiper style={styles.wrapper} loop={false} showsButtons={false}>
        <View style={styles.slide1}>
          
          <View style={{flex:2 , justifyContent:'center',alignItems:'center'}}>
          <Image style={{width:250,height:250}} source={require('../assests/images/Avoid-Crowd.png')}/>
          </View>
          <View style={{backgroundColor:'#0000000', borderLeftWidth:5, borderRightWidth:5,width:250,height:50,marginTop:10,marginLeft:60}}>
            <Text style={{textAlign:'center',fontWeight:'bold',fontSize:16,paddingTop:2,paddingBottom:3}}>सामाजिक दूरी बनाने मे कोई गम नहीं,</Text>
            <Text style={{textAlign:'center',fontWeight:'bold',fontSize:16,paddingTop:2,paddingBottom:3}}>कोरोना जीत जाऐ उसमे इतनी दम नहीं।</Text>
          </View>
          <View style={styles.skipbtn}>
            <Button transparent onPress={()=> this.props.navigation.navigate('SignIn')}>
              <Text style={styles.skipText}>SKIP</Text>
            </Button>
          </View>
        </View>
        <View style={styles.slide2}>
        
          <View style={{flex:2 , justifyContent:'center',alignItems:'center'}}>
          <Image style={{width:250,height:250}} source={require('../assests/images/Hand-Wash.png')}/>
          </View>
          <View style={{backgroundColor:'#0000000', borderLeftWidth:5, borderRightWidth:5,width:250,height:50,marginTop:10,marginLeft:60}}>
            <Text style={{textAlign:'center',fontWeight:'bold',fontSize:16,paddingTop:2,paddingBottom:3}}>बार बार साबुन से धोना है हमे हाथ,</Text>
            <Text style={{textAlign:'center',fontWeight:'bold',fontSize:16,paddingTop:2,paddingBottom:3}}>कोरोना को भगाने मे ऐसे देना है साथ ।</Text>
          </View>
          <View style={styles.skipbtn}>
            <Button transparent onPress={()=>this.props.navigation.navigate('SignIn')}> 
              <Text style={styles.skipText}>SKIP</Text>
            </Button>
          </View>
        </View>
        <View style={styles.slide3}>
          
          <View style={{flex:2 , justifyContent:'center',alignItems:'center'}}>
          <Image style={{width:250,height:250}} source={require('../assests/images/Wear-Mask.png')}/>
          </View>
          <View style={{backgroundColor:'#0000000', borderLeftWidth:5, borderRightWidth:5,width:250,height:50,marginTop:10,marginLeft:60}}>
            <Text style={{textAlign:'center',fontWeight:'bold',fontSize:16,paddingTop:2,paddingBottom:3}}>सामाजिक दूरी बनाने मे कोई गम नहीं,</Text>
            <Text style={{textAlign:'center',fontWeight:'bold',fontSize:16,paddingTop:2,paddingBottom:3}}>कोरोना जीत जाऐ उसमे इतनी दम नहीं।</Text>
          </View>
          <View style={styles.skipbtn} onPress={()=> this.props.navigation.navigate('SignIn')}>
            <Button transparent>
              <Text style={styles.skipText}>SKIP</Text>
            </Button>
          </View>
        </View>
        <View style={styles.slide4}>
         
          <View style={{flex:2 , justifyContent:'center',alignItems:'center'}}>
          <Image style={{width:250,height:250}} source={require('../assests/images/Social-Distancing.png')}/>
          </View>
          <View style={{backgroundColor:'#0000000', borderLeftWidth:5, borderRightWidth:5,width:250,height:50,marginTop:5,marginLeft:60}}>
            <Text style={{textAlign:'center',fontWeight:'bold',fontSize:16,paddingTop:2,paddingBottom:3}}>जिंदगी एक सफ़र है सुहाना,</Text> 
            <Text style={{textAlign:'center',fontWeight:'bold',fontSize:16,paddingTop:2,paddingBottom:3}}>मिलकर हमे कोरोना को है हराना।।</Text>
          </View>
          <View style={styles.Nextbtn}>
            <Button transparent onPress={()=> this.props.navigation.navigate('SignIn')}>
              <Text style={styles.NextTxt}> NEXT </Text>
            </Button>
          </View>
        </View>
      </Swiper>
    )
  }
}