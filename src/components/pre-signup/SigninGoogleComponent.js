import React ,{Component} from 'react';
import { View,Text, Image, StyleSheet } from 'react-native';
import { Button } from 'native-base';
import * as firebase from 'firebase';
import {AntDesign} from 'react-native-vector-icons';
import * as Google from "expo-google-app-auth";

class GoogleSign extends Component{

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

  signInWithGoogle = async () => {
    try {
      const result = await Google.logInAsync({
        // iosClientId: IOS_CLIENT_ID,
        androidClientId: '30917214910-fe7p5pnjrvbcjbv3gamoj6djd44cm2s8.apps.googleusercontent.com',
        scopes: ["profile", "email"]
      });

      if (result.type === "success") {
        console.log("LoginScreen.js.js 21 | ", result.user.givenName);
        this.onSignIn(result);
        // this.props.navigation.navigate("Profile", {
        //   username: result.user.givenName
        // }); //after Google login redirect to Profile
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      console.log('LoginScreen.js.js 30 | Error with login', e);
      return { error: true };
    }
  };

    render()
    {
        return(
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <Image  style={{width:250,height:250,marginVertical:30}}  source={require('../assests/images/Stay-Home.png')}/>
               <Button style={styles.gbtn} info rounded onPress={()=>this.props.navigation.navigate('Sign')} >
                 {/* <AntDesign size={32} color='white' name="google"/> */}
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