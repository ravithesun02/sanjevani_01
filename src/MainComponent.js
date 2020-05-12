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
import {createStackNavigator} from 'react-navigation-stack';
import { Dimensions, AsyncStorage, Image, Text } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import {View} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Overall from './components/post-signup/OverallDataScreen';
import District from './components/post-signup/DistrictDataScreen';
import GovtNotify from './components/post-signup/GovtNotification';

const {height,width}=Dimensions.get('window');
var profile='';
var name='';
var email='';
var mobile='';
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
        email=JSON.parse(value).email;
       // console.log(profile);
       mobile='+91'+JSON.parse(value).mobile;
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

const DataStack=createStackNavigator({
  Overall:Overall,
  DistrictData:District
},{
  initialRouteName:'Overall',
  defaultNavigationOptions:{
    headerShown:false
  }
});

const CustomDrawer=(props)=>(
  <SafeAreaProvider>
  <SafeAreaView style={{flex:1}} forceInset={{top:'always',horizontal:'never'}}>
    <View style={{alignItems:'center',flexDirection:'row',padding:10,backgroundColor:'#468DA8',borderBottomColor:'black',borderBottomWidth:1}}>
      <View style={{height:105,width:105,justifyContent:'center',alignItems:'center',borderRadius:50,elevation:10}}>

      
      <Image source={{uri:profile}} style={{height:100,width:100,borderRadius:50,borderColor:'#e4e4e4',borderWidth:1}} />
      </View>
      <View style={{flexDirection:'column',alignItems:'flex-start',justifyContent:'center'}}>
      <Text style={{fontFamily:'MSRegular',fontSize:14,fontWeight:'bold',marginVertical:'1%',color:'#f3f3f3',marginLeft:2}}>Hi , {name} </Text>
      <Text style={{fontFamily:'MSRegular',fontSize:14,fontWeight:'bold',marginVertical:'1%',color:'#f3f3f3'}}> {email} </Text>
      <Text style={{fontFamily:'MSRegular',fontSize:14,fontWeight:'bold',marginVertical:'1%',color:'#f3f3f3'}}> {mobile} </Text>

      </View>
    </View>
    <ScrollView >
    <DrawerItems inactiveTintColor="#F3F3F3"  labelStyle={{fontWeight:'bold',fontFamily:'MSRegular',fontSize:16,justifyContent:'center',alignSelf:'center',width:width*7/10,textAlign:'center',elevation:5}}  {...props}/>
    </ScrollView>
    <View style={{justifyContent:'flex-end',alignItems:'center',backgroundColor:'#9E9E9E',padding:5}}>
      <Text style={{color:'#F3EDEA'}}>Version : 0.1 Beta</Text>
    </View>

  </SafeAreaView>
  </SafeAreaProvider>
)

const DrawerNavigator=createDrawerNavigator({
  'Home':{
    screen:Dashboard
  },
  'Overall Data':{
    screen:DataStack
  },
  'Govt. Notification':{
    screen:GovtNotify
  }
},{
  initialRouteName:'Home',
  drawerWidth:width*8/10,
  contentComponent:CustomDrawer,
  contentOptions: {
    activeTintColor: 'white',
    activeBackgroundColor: 'grey'
  },
  drawerBackgroundColor:'#468DA8',
  drawerLockMode:'unlocked'
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