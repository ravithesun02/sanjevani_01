import React ,{Component} from 'react';
import { View,Text, Image, StyleSheet } from 'react-native';
import { Button } from 'native-base';
import * as firebase from 'firebase';
// import {AntDesign} from 'react-native-vector-icons';
// import * as Google from "expo-google-app-auth";
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import AntDesign from 'react-native-vector-icons/AntDesign';


class GoogleSign extends Component{

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
  androidClientId:'30917214910-0h41jb5s11tm1oadn00v214cqi567t4c.apps.googleusercontent.com'
    });
  }

  isUserEqual=(googleUser, firebaseUser)=> {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
            providerData[i].uid === googleUser.getBasicProfile().getId()) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  }

 onSignIn=(googleUser)=> {
  //  console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken 
          );
        // Sign in with credential from the Google user.
        firebase.auth().signInWithCredential(credential)
        .then((result)=>{
          console.log('user signed in');

          console.log(result.additionalUserInfo.isNewUser);
          if(result.additionalUserInfo.isNewUser)
            {
                this.props.navigation.navigate('Sign',{result:result});
            }
            else if(!result.additionalUserInfo.isNewUser)
            {
                this.props.navigation.navigate('Dash',{result:result});
            }

         

        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });
      } else {
        console.log('User already signed-in Firebase.');
        this.props.navigation.navigate('Swipe');
      }
    }.bind(this));
  }


  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      //this.setState({ userInfo });
      console.log(userInfo);
      this.onSignIn(userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
        console.log(error);
      }
    }
  };

    render()
    {
        return(
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <Image  style={{width:250,height:250,marginVertical:30}}  source={require('../assests/images/Stay-Home.png')}/>
               <Button style={styles.gbtn} info rounded onPress={()=>this.props.navigation.navigate('Sign')} >
                  <AntDesign size={32} color='white' name="google"/> 
                  <Text style={{marginHorizontal:5,fontWeight:'bold',color:'white',marginBottom:2}}>SIGN IN WITH GOOGLE</Text>
               </Button>
            </View>
        )
    }
}

const styles=StyleSheet.create({
  gbtn:{
    backgroundColor:'#b23121',
    width:210,
    height:42,
    justifyContent:'center',
    textAlign:'center'
   
  }
})

export default GoogleSign;