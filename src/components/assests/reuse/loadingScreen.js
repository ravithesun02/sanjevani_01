import React from 'react';
import { StyleSheet ,View} from 'react-native';

import LottieView from 'lottie-react-native';
 
export default class Loader extends React.Component {

  componentDidMount()
  {
    this.animation.play();
  }
 
  render() {
   
    return (
      <View style={styles.container}>
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
        backgroundColor: '#F5FCFF', 
       },
  lottie: {
    width: 200,
    height: 200
  }
});