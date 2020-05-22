import React ,{Component} from 'react';
import { View,Text, Image, StyleSheet,Dimensions,Animated, StatusBar } from 'react-native';
import { Button ,Toast} from 'native-base';
import * as firebase from 'firebase';
// import {AntDesign} from 'react-native-vector-icons';
// import * as Google from "expo-google-app-auth";
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {baseURL} from '../assests/reuse/baseUrl';
import * as SecureStore from 'expo-secure-store';
import Loader from '../../components/assests/reuse/loadingScreen';

const {height,width}=Dimensions.get('window');
class GoogleSign extends Component{

  constructor(props)
  {
    super(props);
    this.state={
      isLoading:false,
      opacity:new Animated.Value(0)
    }
  }

  componentDidMount()
  {
    
    GoogleSignin.configure({
      scopes: ["profile", "email"], // what API you want to access on behalf of the user, default is email and profile
  webClientId: '30917214910-kdsbjkejp0kgi4u4djup2615pvrqidv4.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
  offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  hostedDomain: '', // specifies a hosted domain restriction
  loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
  forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  accountName: '', // [Android] specifies an account name on the device that should be used
  //iosClientId: '<FROM DEVELOPER CONSOLE>',
  //debug
  androidClientId:'30917214910-0h41jb5s11tm1oadn00v214cqi567t4c.apps.googleusercontent.com'
  //relese

//  androidClientId:'30917214910-qo3lo8ionoh641ihk6f21j40mrnfrs2t.apps.googleusercontent.com'
    });
  }
onSignIn=(userInfo)=>{
  this.setState({isLoading:!this.state.isLoading});
  let id_token=userInfo.idToken;
  fetch(baseURL+'/users/login',{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      'Authorization':'Bearer '+id_token
    },
    credentials:'same-origin'
  })
  .then(response=>{
    if(response.ok)
      return response;
    else
    {
        var error=new Error('Error'+response.status+':'+response.statusText);
        error.response=response;
        throw error;
    }
},
error=>{
    var errormess=new Error(error.message);
    throw errormess;
})
.then((response)=>response.json())
.then((data)=>{
  SecureStore.setItemAsync('jwt_key',data.token)
  .catch((err)=>console.warn(err));
 // console.log(data);
  if(data.status==0 && !data.user.newid)
  {
    this.setState({isLoading:!this.state.isLoading});
      this.props.navigation.navigate('Dash');
  }
  else if(data.status==1 && data.user.newid)
  {
    this.setState({isLoading:!this.state.isLoading});
    this.props.navigation.navigate('Sign',{profilepic:data.user.profile_pic});
  }
  else
  {

    this.setState({isLoading:!this.state.isLoading});
    this.props.navigation.navigate('Sign',{profilepic:data.user.profile_pic});
  }

})
  .catch((err)=>
  {
    console.log(err);
  })
}

  

  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      //this.setState({ userInfo });
      //console.log(userInfo);
      this.onSignIn(userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        alert('Sign in cancelled ! Retry again');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        alert('SignIn in Progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        alert('Google play services not Found !');
      } else {
        // some other error happened
        console.log(error);
      }
    }
  };

  onLoad = () => {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }

    render()
    {
      if(this.state.isLoading)
      {
        return <Loader/>
      }
      else
      {
         
    const animatedStyle = {
 
      opacity: this.state.opacity,
      transform: [
        {
          scale: this.state.opacity.interpolate({
            inputRange: [0, 1],
            outputRange: [0.25, 1],
          })
        },
      ]
 
    }
        return(
            <View style={{flex:1}}>
              <StatusBar hidden/>
              <View style={styles.logobg}>
                <Animated.Image 
                onLoad={this.onLoad()}
                source={require('../assests/images/signinLogo.png')}
                style={[styles.logo,animatedStyle]}
                />
                <Animated.View style={[styles.textbg,animatedStyle]}>
                <Text style={{textAlign:'center',color:'#4E4E4E',fontWeight:'bold',fontSize:16,paddingTop:10,paddingBottom:3}}>सुरक्षित हो जीवनी,</Text>
                <Text style={{textAlign:'center',color:'#4E4E4E',fontWeight:'bold',fontSize:16,paddingTop:2,paddingBottom:3}}>जब साथ हो संजीवनी ।</Text>
              </Animated.View>
              </View>
              <View style={styles.btnbg}>
              <Button style={styles.gbtn} info rounded onPress={()=>this.signIn()} >
                  <AntDesign size={32} color='white' name="google"/> 
                  <Text style={{marginHorizontal:5,fontWeight:'bold',color:'white',marginBottom:2}}>SIGN IN WITH GOOGLE</Text>
               </Button>
               </View>
            </View>
        )
      }
    }
}

const styles=StyleSheet.create({
  gbtn:{
    backgroundColor:'#b23121',
    padding:'4%',
    justifyContent:'center',
    textAlign:'center',
    elevation:10
    
   
  },
  logobg:{
    height:height*0.8,
    width:width,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'black',
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
    elevation:5
  },
  logo:{
    width:284,
    height:188
    
  },
  textbg:{
     
    borderLeftWidth:5, 
    borderRightWidth:5
  },
  btnbg:{
    justifyContent:'center',
    height:height*0.2,
    width:width,
    alignItems:'center',
  }
})

export default GoogleSign;