import React ,{Component} from 'react';
import {View,Text, Image, ImageBackground, StyleSheet,AsyncStorage} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import firebase from 'firebase';
import { baseURL } from './assests/reuse/baseUrl';

const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

class SplashScreen extends Component{

    constructor(props)
    {
        super(props);
        this.state={
            isLoggedIn:false,
            jwtToken:null
        }
    }

   async componentDidMount(){

      let token = await  SecureStore.getItemAsync('jwt_key');
     
      //  console.log(token);
          this.setState({jwtToken:token});
     

        this.checkIfLoggedIn();
    }


    checkIfLoggedIn= async ()=>{
      // console.log('In logged in ()',this.state.jwtToken);

        if(this.state.jwtToken)
        {
           // console.log(this.state.jwtToken);
            await sleep(2000);

              this.props.navigation.navigate('Dash');



        }

        else
        {
            await sleep(2000);
            this.props.navigation.navigate('Swipe');
        }


      
    }

    render()
    {
        return(
            <View style={{flex:1,flexDirection:'column'}}>
                <ImageBackground source={require('./assests/images/Front-page.png')} style={styles.image}/>
                
                   
                
            </View>
        )
    }
    
}

const styles=StyleSheet.create({
    image:{
        flex:1,
        justifyContent:"center",
        resizeMode:'cover'
    }
})

export default SplashScreen;