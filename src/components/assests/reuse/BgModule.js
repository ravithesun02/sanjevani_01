import BackgroundJob from 'react-native-background-actions';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import React ,{Component} from 'react';

const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

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
   
    
      console.log('running')

      // await Location.startGeofencingAsync('GEO_FENCING',regions);
      await Location.startLocationUpdatesAsync('LOCATION_TRACKER',optionsLoc);
     
     console.log('Runned -> ' );
  });
};

const optionsLoc={
    "accuracy":Location.Accuracy.Balanced,
    "timeInterval":5000,
    "distanceInterval":100,
    "notificationTitle":"SANJEVANI",
    "notificationBody":"Location Access",
    "notificationColor":"#ff00ff"
  }
  
  TaskManager.defineTask('LOCATION_TRACKER', ({ data, error }) => {
    if (error) {
     console.log(error.message);
      return;
    }
    if (data) {
      const { locations } = data;
      // do something with the locations captured in the background
      console.log(data);
    console.log(locations);
    }
  });
  const options = {
    taskName: 'Example',
    taskTitle: 'ExampleTask title',
    taskDesc: 'ExampleTask desc',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
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
  
  
    /**
     * Toggles the background task
     */
    toggleBackground = async () => {
      
        try {
          console.log('Trying to start background service');
          await BackgroundJob.start(taskRandom, options);
          console.log('Successful start!');
        } catch (e) {
          console.log('Error', e);
        }
    };
  
    locationStatus=async()=>{
      let {status}=await Location.getPermissionsAsync();
  
      if(status==='granted')
      {
        console.log('Status chnaged');
        this.setState({
          isLocationEnabled:true
        });
      }
    }
  
    componentDidUpdate()
    {
      console.log('Update component');
      this.toggleBackground();
    }
  
    componentDidMount(){
      //this.toggleBackground();
      console.log('mounted');
      this.locationStatus();
     
    }


    render(){
        return(
            <>
            </>
        )
    }
  }

  export default BackModule;