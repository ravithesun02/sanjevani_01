import React ,{Component} from 'react';
import SwipeImage from './components/pre-signup/SwipeComponent';
import Signup from './components/pre-signup/FormComponent';
import SplashScreen from './components/SplashComponent';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import {createAppContainer} from 'react-navigation';
import GoogleSignin from './components/pre-signup/SigninGoogleComponent';
import Dashboard from './components/post-signup/DashboardScreen';
import {Transition} from 'react-native-reanimated';
import LearnCOVID from './components/post-signup/LearnCOVID.js';
import {createDrawerNavigator, DrawerItems} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';
import { Dimensions, AsyncStorage, Image, Text ,ImageBackground} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import {View} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Overall from './components/post-signup/OverallDataScreen';
import District from './components/post-signup/DistrictDataScreen';
import GovtNotify from './components/post-signup/GovtNotification';
import Hospital from './components/post-signup/hospital';
import { Root } from 'native-base';

const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));
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

  // async componentDidMount()
  // {
  //   try
  //   {
  //     let value=await AsyncStorage.getItem('userinfo');
  //     if(value!=null)
  //     {
  //       profile=JSON.parse(value).profile_pic;
  //       name=JSON.parse(value).first_name;
  //       email=JSON.parse(value).email;
  //      // console.log(profile);
  //      mobile='+91'+JSON.parse(value).mobile;
  //     }

  //   }
  //   catch(error)
  //   {
  //     console.error(error);
  //   }
  // }

  

    render(){
        return(
            <Root>
        
           <AppContainer/>
           </Root>
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

loadProfileData= async()=>{
  await sleep(4000);
  console.log('called');
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

const CustomDrawer=(props)=>(
  <ImageBackground source={require('./components/assests/images/drawer.png')} style={{width:'100%',height:'100%'}} onLoadStart={()=>loadProfileData()}>
              
  <SafeAreaProvider>
  <SafeAreaView style={{flex:1}} forceInset={{top:'always',horizontal:'never'}}>
    <View style={{alignItems:'center',flexDirection:'row',padding:10,paddingBottom:0}}>
      <View style={{height:105,width:105,justifyContent:'center',alignItems:'center',borderRadius:50,elevation:10}}>

      
      <Image source={{uri:profile}} style={{height:100,width:100,borderRadius:50,borderColor:'#e4e4e4',borderWidth:1}} />
      </View>
      <View style={{flexDirection:'column',alignItems:'flex-start',justifyContent:'center'}}>
      <Text style={{fontFamily:'Right',fontSize:14,marginVertical:'1%',color:'#4E4E4E',marginLeft:2}}>Hi , {name} </Text>
      <Text style={{fontFamily:'Right',fontSize:14,marginVertical:'1%',color:'#4E4E4E'}}> {mobile} </Text>

      </View>
    </View>
    <View style={{marginVertical:'2%' ,justifyContent:'center',paddingBottom:5,alignItems:'center',borderBottomColor:'black',borderBottomWidth:1}}>
    <Text style={{fontFamily:'Right',fontSize:14,marginVertical:'1%',color:'#4E4E4E'}}> {email} </Text>
      
    </View>
    <ScrollView >
    <DrawerItems inactiveTintColor="#F3F3F3"  labelStyle={{fontFamily:'Right',fontSize:16,justifyContent:'center',alignSelf:'center',width:width*7/10,textAlign:'center',elevation:5}}  {...props}/>
    </ScrollView>
    <View style={{justifyContent:'flex-end',alignItems:'center',backgroundColor:'#9E9E9E',padding:5}}>
      <Text style={{color:'#F3EDEA'}}>Version : 0.1 Beta</Text>
    </View>

  </SafeAreaView>
  </SafeAreaProvider>
  </ImageBackground>
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
  },
  'Learn COVID 19':{
    screen:LearnCOVID
  },
  'Help Centers':{
    screen:Hospital
  }
},{
  initialRouteName:'Home',
  drawerWidth:width*8/10,
  contentComponent:CustomDrawer,
  contentOptions: {
    activeTintColor: '#4E4E4E',
    activeBackgroundColor: '#E0CEB4',
    inactiveTintColor:'#4E4E4E'
  },
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