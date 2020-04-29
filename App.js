import * as React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Main from './src/MainComponent';
import * as firebase from 'firebase';
import BackgroundJob from 'react-native-background-actions';

import {firebaseConfig } from './config';

firebase.initializeApp(firebaseConfig);

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
    for (let i = 0; BackgroundJob.isRunning(); i++) {
      console.log('Runned -> ', i);
      await sleep(delay);
    }
  });
};

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
    delay: 1000,
  },
};

class App extends React.Component{
  playing = BackgroundJob.isRunning();

  /**
   * Toggles the background task
   */
  toggleBackground = async () => {
    this.playing = !this.playing;
    if (this.playing) {
      try {
        console.log('Trying to start background service');
        await BackgroundJob.start(taskRandom, options);
        console.log('Successful start!');
      } catch (e) {
        console.log('Error', e);
      }
    } else {
      console.log('Stop background service');
      await BackgroundJob.stop();
    }
  };

  componentDidMount(){
    //this.toggleBackground();
  }
  render()
  {
    return(
     <Main/>
    )
  }
}

export default App;

