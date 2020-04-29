import React ,{Component} from 'react';

import SwipeImage from './components/pre-signup/SwipeComponent';
import Signup from './components/pre-signup/FormComponent';
import { ScrollView } from 'react-native-gesture-handler';
import SplashScreen from './components/SplashComponent';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import {createAppContainer} from 'react-navigation';
import GoogleSignin from './components/pre-signup/SigninGoogleComponent';

import Dashboard from './components/post-signup/DashboardScreen';

import * as Location from 'expo-location';
// import Constants from 'expo-constants';
import { Platform ,Modal,View,Text, StyleSheet,Linking,AppState} from 'react-native';
import { Button } from 'native-base';
// import {IntentLauncherAndroid} from 'expo';
import {IntentLauncherAndroid,Constants} from 'react-native-unimodules'
class Main extends Component{

    constructor(props)
    {
        super(props);

        this.state={
            errorMessage:null,
            isLocationModalVisible:false,
            openSetting:false,
            appState: AppState.currentState
        }
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
      }
    
      handleAppStateChange = nextAppState => {
        if (
          this.state.appState.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          console.log('App has come to the foreground!');
          this._getLocationAccess();
        }
        this.setState({ appState: nextAppState });
      };

    componentDidMount()
    {
        AppState.addEventListener('change',this.handleAppStateChange)
        if(Platform.OS==='android' && !Constants.isDevice)
        {
            this.setState({
                errorMessage:'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
            });

            alert(this.state.errorMessage);
        }
        else
        {
            this._getLocationAccess();
        }
    }

    openSettings=()=>{

        if(Platform.OS==='ios')
        {
            Linking.openURL('app-settings:');
        }
        else
        {
            IntentLauncherAndroid.startActivityAsync(
                IntentLauncherAndroid.ACTION_LOCATION_SOURCE_SETTINGS
              );
        }

        this.setState({
            openSetting:false
        })

    }

    _getLocationAccess=async()=>{
        try{
            let { status } = await Location.requestPermissionsAsync();
            if(status!=='granted')
            {
                this.setState({
                    errorMessage:'Location access denied '
                });
            }

            let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});
            console.log(location);
            //ravi yaha pe function call krna task ka
        }
        catch(error)
        {
            let status=Location.getProviderStatusAsync();

            if(! status.locationServicesEnabled)
            {
                this.setState({isLocationModalVisible:true})
            }
        }
    }

    render(){
        return(
            <>
            <Modal 
            onDismiss={()=>{this.state.openSetting?this.openSettings:undefined}}
            visible={this.state.isLocationModalVisible}
            transparent={true}
            animationType='fade'
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Button onPress={()=>{this.setState({isLocationModalVisible:false,openSetting:true})}}>
                            <Text>Enable Location Services</Text>
                        </Button>

                    </View>
                </View>

            </Modal>
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

const styles=StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      }
});

export default Main;