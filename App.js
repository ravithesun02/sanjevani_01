import * as React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Main from './src/MainComponent';
import * as firebase from 'firebase';


import {firebaseConfig } from './config';

firebase.initializeApp(firebaseConfig);


class App extends React.Component{

  render()
  {
    return(
     <Main/>
    )
  }
}

export default App;

