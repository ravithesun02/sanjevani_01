import React ,{Component} from 'react';
import {View,Text, Image, ImageBackground, StyleSheet} from 'react-native';
import firebase from 'firebase';

class SplashScreen extends Component{


    componentDidMount(){
        this.checkIfLoggedIn();
    }


    checkIfLoggedIn=()=>{
        firebase.auth().onAuthStateChanged((user)=>{
            if(user)
            {
                console.log(user);
                //here is to check firestore
                //for time being
                this.props.navigation.navigate('Sign',{result:user});
            }
            else
            {
                this.props.navigation.navigate('Swipe');
            }
        })
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