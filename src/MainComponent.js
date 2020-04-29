import React ,{Component} from 'react';
import SwipeImage from './components/pre-signup/SwipeComponent';
import Signup from './components/pre-signup/FormComponent';
import SplashScreen from './components/SplashComponent';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import {createAppContainer} from 'react-navigation';
import GoogleSignin from './components/pre-signup/SigninGoogleComponent';
import Dashboard from './components/post-signup/DashboardScreen';


class Main extends Component{

  

    render(){
        return(
            <>
        
           <AppContainer/>
           </>
        )
    }
}


const AppSwitchContainer=createAnimatedSwitchNavigator({
    Splash:SplashScreen,
    Swipe:SwipeImage,
    SignIn:GoogleSignin,
    Sign:Signup,
    Dash:Dashboard
    
});

const AppContainer=createAppContainer(AppSwitchContainer);



export default Main;