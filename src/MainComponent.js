import React ,{Component} from 'react';
import SwipeImage from './components/pre-signup/SwipeComponent';
import Signup from './components/pre-signup/FormComponent';
import SplashScreen from './components/SplashComponent';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import {createAppContainer} from 'react-navigation';
import GoogleSignin from './components/pre-signup/SigninGoogleComponent';
import Dashboard from './components/post-signup/DashboardScreen';
import {Transition} from 'react-native-reanimated';
import {createDrawerNavigator, DrawerItems} from 'react-navigation-drawer';
import { Dimensions, AsyncStorage, Image, Text } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import {View} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Overall from './components/post-signup/OverallDataScreen';

const {height,width}=Dimensions.get('window');
var profile='';
var name='';
class Main extends Component{

  constructor(props)
  {
    super(props);
   
  }

  async componentDidMount()
  {
    try
    {
      let value=await AsyncStorage.getItem('userinfo');
      if(value!=null)
      {
        profile=JSON.parse(value).profile_pic;
        name=JSON.parse(value).first_name;
       // console.log(profile);
      }

    }
    catch(error)
    {
      console.error(error);
    }
  }

  

    render(){
        return(
            <>
        
           <AppContainer/>
           </>
        )
    }
}

const CustomDrawer=(props)=>(
  <SafeAreaProvider>
  <SafeAreaView style={{flex:1}} forceInset={{top:'always',horizontal:'never'}}>
    <View style={{alignItems:'center', justifyContent:'center',padding:10,backgroundColor:'#D3D3D3'}}>
      <Image source={{uri:profile}} style={{height:100,width:100,borderRadius:50}} />
      <Text style={{fontFamily:'MSRegular',fontSize:17,fontWeight:'bold',marginVertical:'2%'}}>Hi , {name} </Text>

    </View>
    <ScrollView>
    <DrawerItems {...props}/>
    </ScrollView>
    <View style={{justifyContent:'flex-end',alignItems:'center',backgroundColor:'#013220'}}>
      <Text>Version : 0.1 Beta</Text>
    </View>

  </SafeAreaView>
  </SafeAreaProvider>
)

const DrawerNavigator=createDrawerNavigator({
  Home:{
    screen:Dashboard
  },
  OverallData:{
    screen:Overall
  }
},{
  initialRouteName:'Home',
  drawerWidth:width*2/3,
  contentComponent:CustomDrawer,
  contentOptions: {
    activeTintColor: '#000000',
    activeBackgroundColor: '#e6e6e6',
  },
  drawerBackgroundColor:'grey'
});


const AppSwitchContainer=createAnimatedSwitchNavigator({
    Splash:SplashScreen,
    Swipe:SwipeImage,
    SignIn:GoogleSignin,
    Sign:Signup,
    Dash:DrawerNavigator
    
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