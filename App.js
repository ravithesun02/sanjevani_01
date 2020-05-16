import * as React from 'react';
import { Platform, StyleSheet, Text, View, StatusBar } from 'react-native';
import Main from './src/MainComponent';
import * as firebase from 'firebase';
import {Root} from 'native-base';

import {firebaseConfig } from './config';

firebase.initializeApp(firebaseConfig);


class App extends React.Component{

  render()
  {
    return(
      <Root>
      {/* <StatusBar hidden/> */}
     <Main/>
     </Root>
    )
  }
}

export default App;

