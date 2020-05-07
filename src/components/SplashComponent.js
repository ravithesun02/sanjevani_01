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
            jwtToken:null,
            isSignedIn:false,
            profile_pic:null
        }
    }

  
    fetchGoogleUser=async()=>{
        try
        {
         let response=await fetch(baseURL+'/users/login',{
           method:'GET',
           headers:{
             'Authorization':'Bearer '+this.state.jwtToken
           }
         })
         if(response.ok)
         {
           let data=await response.json();
           if(!data.user.newid)
                this.setState({isLoggedIn:true});
            else 
            this.setState({isSignedIn:true,profile_pic:data.user.profile_pic});
          
    
         }
    
        }
        catch(error)
        {
          console.log(error);
        }
        this.setState({isLoading:false});
      }

   async componentDidMount(){

      let token = await  SecureStore.getItemAsync('jwt_key');
     
      //  console.log(token);
          this.setState({jwtToken:token});

          if(this.state.jwtToken)
          {
             await this.fetchGoogleUser();
          }
     

       await this.checkIfLoggedIn();
    }


    checkIfLoggedIn= async ()=>{
      // console.log('In logged in ()',this.state.jwtToken);

        if(this.state.isLoggedIn)
        {
           // console.log(this.state.jwtToken);
           

              this.props.navigation.navigate('Dash');



        }
        else if(this.state.isSignedIn)
        {
           
           this.props.navigation.navigate('Sign',{profilepic:this.state.profile_pic});
        }

        else
        {
           
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