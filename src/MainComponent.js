import React ,{Component} from 'react';
import SwipeImage from './components/pre-signup/SwipeComponent';
import Signup from './components/pre-signup/FormComponent';
import SplashScreen from './components/SplashComponent';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import {createAppContainer} from 'react-navigation';
import GoogleSignin from './components/pre-signup/SigninGoogleComponent';
import Dashboard from './components/post-signup/DashboardScreen';
import {Transition} from 'react-native-reanimated';


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
    
}, {
    // The previous screen will slide to the bottom while the next screen will fade in
    transition: (
      <Transition.Together>
        <Transition.Out
          type="slide-bottom"
          durationMs={400}
          interpolation="easeIn"
        />
        <Transition.In type="fade" durationMs={500} />
      </Transition.Together>
    ),
  });

const AppContainer=createAppContainer(AppSwitchContainer);



export default Main;