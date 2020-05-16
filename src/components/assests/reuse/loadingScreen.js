import React from 'react';
import { StyleSheet ,View, StatusBar} from 'react-native';

import LottieView from 'lottie-react-native';
 
export default class Loader extends React.Component {

  componentDidMount()
  {
    this.animation.play();
  }
 
  render() {
   
    return (
      <View style={styles.container}>
        <StatusBar hidden/>
        <LottieView source={require('../images/21166-covid-19-virus.json')} 
         ref={animation => {
          this.animation = animation;
        }}
        style={styles.lottie}
         autoplay 
         loop/>
      </View>
    );
  }
}
 
const styles = StyleSheet.create({
  container: {   
     flex: 1,  
      justifyContent: 'center',   
       alignItems: 'center',   
        backgroundColor: (255,255,255,0.75) 
       },
  lottie: {
    width: 200,
    height: 200
  }
});