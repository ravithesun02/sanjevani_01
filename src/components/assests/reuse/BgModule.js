import BackgroundJob from 'react-native-background-actions';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import React ,{Component} from 'react';
import * as SecureStore from 'expo-secure-store';
import { baseURL } from './baseUrl';
import {AsyncStorage} from 'react-native';
import haversine from 'haversine';
import PushNotification from 'react-native-push-notification';

const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

var jwt_token=null;
var counter=0;
var distance=500;
var home_lat=0;
var home_lon=0;
var optionsLoc={
  "accuracy":Location.Accuracy.Balanced,
  "timeInterval":10000
};
var lastLocation={
  latitude:0,
  longitude:0
}
var coveredDistance=0;

const taskRandom = async taskData => {
  if (Platform.OS === 'ios') {
    console.warn(
      'This task will not keep your app alive in the background by itself, use other library like react-native-track-player that use audio,',
      'geolocalization, etc. to keep your app alive in the background while you excute the JS from this library.',
    );
  }
  await new Promise(async resolve => {
    // For loop with a delay
    const {delay} = taskData;

 
    
   // console.log('running')
      
          await Location.startLocationUpdatesAsync('LOCATION_TRACKER',optionsLoc);

      // await Location.startGeofencingAsync('GEO_FENCING',regions);
     
   console.log('Runned -> ' );
  });
};


/**
     * Toggles the background task
     * 
     * [{"coords": {"accuracy": 15.631999969482422, "altitude": 0, "heading": 187.82395935058594, "latitude": 23.7463559, "longitude": 84.4994319, "speed": 0.003275915514677763}, "timestamp": 1588440391754}]

     */

  postLocation=(locations)=>{

    let postdata={
      'latitude':locations.coords.latitude,
      'longitude':locations.coords.longitude,
      'accuracy':locations.coords.accuracy,
      'current_timestamp':locations.timestamp
    }

  //  console.log(postdata);

    fetch(baseURL+'/locupdate/foreign',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization':'Bearer '+jwt_token
      },
      credentials:'same-origin',
      body:JSON.stringify(postdata)
    })
    .then(response=>{
      if(response.ok)
      return response;
      else
      {
          var error=new Error('Error'+response.status+':'+response.statusText);
          error.response=response;
          throw error;
      }
    },
    error=>{
      var errormess=new Error(error.message);
      throw errormess;
    })
    .then((response)=>response.json())
    .then((data)=>{
      if(data.code == 1)
      {
        counter++;
        console.log('Posted location');
        firstLocalNotification(`You have crossed ${coveredDistance/1000} Km from your home`);
           
      }
    })
    .catch(async(err)=>{
      console.log(err);
      console.log(err.message);
      if(err.message==='Error503:undefined')
      {
        console.log('updating');
        await updateLocation(locations);
      }
    });

  }

  updateLocation=(locations)=>{

    let postdata={
      'latitude':locations.coords.latitude,
      'longitude':locations.coords.longitude,
      'accuracy':locations.coords.accuracy,
      'current_timestamp':locations.timestamp
    }

    fetch(baseURL+'/locupdate/foreign',{
      method:'PUT',
      headers:{
        'Content-Type':'application/json',
        'Authorization':'Bearer '+jwt_token
      },
      credentials:'same-origin',
      body:JSON.stringify(postdata)
    })
    .then(response=>{
      if(response.ok)
      return response;
      else
      {
          var error=new Error('Error'+response.status+':'+response.statusText);
          error.response=response;
          throw error;
      }
    },
    error=>{
      var errormess=new Error(error.message);
      throw errormess;
    })
    .then((response)=>response.json())
    .then((data)=>{
      if(data.code == 0)
      {
        counter++;
        console.log('Updated location');
      }
    })
    .catch((err)=>console.log(err.message));

  }

  deleteLocation=()=>{

    fetch(baseURL+'/locupdate/foreign',{
      method:'DELETE',
      headers:{
        'Content-Type':'application/json',
        'Authorization':'Bearer '+jwt_token
      },
      credentials:'same-origin'
    })
    .then(response=>{
      if(response.ok)
      return response;
      else
      {
          var error=new Error('Error'+response.status+':'+response.statusText);
          error.response=response;
          throw error;
      }
    },
    error=>{
      var errormess=new Error(error.message);
      throw errormess;
    })
    .then((response)=>response.json())
    .then((data)=>{
      if(data.code == 2)
      {
        console.log('Deleted successfully');
        firstLocalNotification('You are SAFE now ! Stay at Home');
      }
    })
    .catch((err)=>console.log(err.message));

  }
  configure = () => { 
    PushNotification.configure({
    onNotification: function(notification) {
      console.log('LOCAL NOTIFICATION ==>', notification)
    },
  popInitialNotification: true,
    requestPermissions: true
  });
}
   firstLocalNotification = (distance) => {
    PushNotification.localNotification({
      autoCancel: true,
      bigText:distance,
      subText: 'Sanjevani Alert',
      title: 'Stay at Home',
      message:distance ,
      color: "red",
      priority: "high",

      vibrate: true,
      vibration: 300,
      playSound: true,
      soundName: 'default',
    })
  };
  PushNotification.localNotificationSchedule({
    title: "stay safe",
    message: "My Notification Message", // (required)
    date: new Date(Date.now() + 60 * 12 * 60 * 1000), // in 60 secs
  });

  TaskManager.defineTask('LOCATION_TRACKER',async ({ data, error }) => {
    if (error) {
     console.log(error.message);
      return;
    }
    if (data) {
     //console.log(data);
      var { locations } = data;
     // console.log(locations);
      var location=locations[0];
     // console.log(location);
      let lat=location.coords.latitude;
      let lon=location.coords.longitude;
      
      if(fakecalculateDistance(lat,lon)<500)
      {
      let distancecovered=calculateDistance(lat,lon);
      console.log(distancecovered);
      if(distancecovered>50)
      {
          if(counter==0)
          {
            //push notification here
          
          // console.log('Post process');
         // console.log(location);
         coveredDistance=distancecovered;
          await  postLocation(location);
            sleep(3000);
            distance=200;
           // console.log('post end');
          }
          else if(counter>0)
          {
            await  updateLocation(location);
              sleep(3000);
          }
      }
      else
      {
        if(counter!=0)
        {
         await deleteLocation();
         
          sleep(3000);
          counter=0;
          distance=500;
        }
        
          
      }
      lastLocation.longitude=lon;
      lastLocation.latitude=lat;

      console.log(lastLocation);
    }
    else
    {
      console.log(fakecalculateDistance(lat,lon));
    }
  }
  });
  const calculateDistance=(latitude,longitude)=>{
    let start={
      latitude:home_lat,
      longitude:home_lon
    };
    let end={
      latitude:latitude,
      longitude:longitude
    };

    return haversine(start,end,{unit:'meter'});

  }

  const fakecalculateDistance=(latitude,longitude)=>{
    let start={
      latitude:lastLocation.latitude,
      longitude:lastLocation.longitude
    };
    let end={
      latitude:latitude,
      longitude:longitude
    };

    return haversine(start,end,{unit:'meter'});

  }

  const options = {
    taskName: 'sanjevani_always',
    taskTitle: 'SANJEVANI',
    taskDesc: 'STAY HOME STAY SAFE',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#FF8A65',
    parameters: {
      delay: 10000,
    },
  };
  
  
  class BackModule extends Component{



    constructor(props)
    {
      super(props);
      this.state={
        isLocationEnabled:false
      }
    }
  
 
    
    toggleBackground = async () => {
      
        try {
        //  console.log('Trying to start background service');
        if(!BackgroundJob.isRunning())
          await BackgroundJob.start(taskRandom, options);
        //  console.log('Successful start!');
        } catch (e) {
          console.log('Error', e);
        }
    };
  
    locationStatus=async()=>{
      let {status}=await Location.getPermissionsAsync();

     // console.log(status);
  
      if(status==='granted')
      {
      //  console.log('Status chnaged');
        this.setState({
          isLocationEnabled:true
        });
      }
    }
  
    componentDidUpdate()
    {
      //console.log('Update component');
      if(this.state.isLocationEnabled)
      this.toggleBackground();
    }
  
   async componentDidMount(){
            try
            {
              let token = await  SecureStore.getItemAsync('jwt_key');
              jwt_token=token;
            //  console.log(jwt_token);
            }
            catch(error)
            {
              console.log(error);
            }
          

            this.getStorage();

          
     
    }

    getStorage=async()=>{


      AsyncStorage.getItem('userinfo',(err,data)=>{
        if(err)
        {
          console.log(err);
          return ;
        }
        else
        {
          const result=JSON.parse(data);
         // console.log(result);
          home_lat=result.home_location.latitude;
          home_lon=result.home_location.longitude;
          lastLocation.latitude=home_lat;
          lastLocation.longitude=home_lon;
          this.locationStatus();
        }
      })
    }


    render(){
        return(
            <>
            </>
        )
    }
  }

  export default BackModule;