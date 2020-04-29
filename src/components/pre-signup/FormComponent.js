import React from 'react';
import {View, TextInput,StyleSheet, Text, ImageBackground,Image, ListView, ScrollView,Modal} from 'react-native'
import {Formik} from 'formik';
import * as ImagePicker from 'expo-image-picker';
import camimg from '../assests/images/title.png';
import * as Yup from 'yup';
import { Card, ListItem, List,Button } from 'native-base';
import FontAwesome5  from 'react-native-vector-icons/FontAwesome5';
import  Entypo from 'react-native-vector-icons/Entypo';
import * as Location from 'expo-location';
import LocationModule from '../assests/reuse/LocationComponent';
import {openSettings} from 'react-native-send-intent';

const createFormData = (profile_image, body) => {
 
};


const SignupSchema = Yup.object().shape({
  firstname: Yup.string()
    .min(2, '*Too Short!')
    .max(50, '*Too Long!')
    .required('*firstname Required'),
  lastname: Yup.string()
    .min(2, '*Too Short!')
    .max(50, '*Too Long!')
    .required('*Lastname Required'),
  email: Yup.string()
    .email('*Invalid email')
    .required('*Email Required'),
});
class SignUp extends React.Component {
  constructor(props){
    super(props);
    this.state={
      profile_image: null,
      lat:null,
      lon:null,
      isLocationAccessed:false,
      modalVisible:false,
      formData:{},
      isModal:false,
      openSetting:false
    }
  }

  

  handlephoto = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();
    if (permissionResult.granted === false){
      alert("Permission to access camera roll is required");
      return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    this.setState({profile_image:pickerResult});
    console.log(pickerResult);
  }

  handleUploadPhoto = () => {
    fetch("http://localhost:19006/api/upload",{
      method: 'POST',
      body: createFormData(this.state.profile_image, { userId: '123'})
    })
  }

  proceedToSubmit=()=>{
    
    this.setState({
      isLocationAccessed:!this.state.isLocationAccessed,
      modalVisible:!this.state.modalVisible
    });

  }

  findCoordinates =() => {
    try
    {
    (async () => {
      let { status } = await Location.getPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        this.setState({
          isModal:true
        })
        
      }

      else
      {

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        maximumAge: 60000
      });
      this.setState({lat:location.coords.latitude});
      this.setState({lon:location.coords.longitude});
      this.proceedToSubmit();
    }
    })();
  }
  catch(error)
  {
    this.setState({isModal:true});
  }
}

toggleModal(){
  this.setState({
    modalVisible:!this.state.modalVisible
  })
}

formSubmit(values)
{
  this.setState({
    formData:values,
    modalVisible:!this.state.modalVisible

  });
}

opensettings=()=>{
  console.log('here');

  openSettings("android.settings.APPLICATION_DETAILS_SETTINGS");

  this.setState({
    openSetting:false
  });

}

postData()
{
  this.state.formData.home_location={
    'latitude':this.state.lat,
    'longitude':this.state.lon
  };

  alert(JSON.stringify(this.state.formData));
  this.props.navigation.navigate('Dash');
}

  render(props) {
    const {profile_image} = this.state;
    return (
      <ImageBackground source={require('../assests/images/back.png')} style={{width:'100%',height:'100%',flex:1}} >
         <Modal 
            onDismiss={()=>{this.state.openSetting?this.opensettings:undefined}}
            visible={this.state.isModal}
            transparent={true}
            animationType='fade'
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={{color:'red',fontWeight:'bold',marginVertical:5}}>It seems like you have disabled location ! </Text>
                        <Button style={{borderRadius:10,justifyContent:'center',alignItems:'center',padding:8,backgroundColor:'#FF8A65'}} onPress={()=>{this.setState({isModal:false,openSetting:true})}}>
                            <Text style={{fontWeight:'bold',color:'white'}}>Enable Location</Text>
                        </Button>

                    </View>
                </View>

            </Modal>
        
         <Modal
            animationType='fade'
            transparent={true}
            visible={this.state.modalVisible}
            >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <LocationModule/>
            <Text style={{margin:'5%',fontWeight:'bold'}}>Kindly give us access to your Location</Text>
            <Text style={{margin:'5%',marginBottom:'6%',color:'red'}}>Please be sure you are at your HOME , while enabling Location</Text>
            <Entypo name="location-pin" margin={5} borderRadius={10} backgroundColor="#D8B59A" onPress={this.findCoordinates} >Allow</Entypo>
            </View>
            </View>
          </Modal>
      <View style={styles.container}>
        <View style={{justifyContent:'center',alignItems:'center',width:'100%',height:'19%',marginVertical:'1%'}}>
          <Image style={{width:320,height:45}} source={camimg} />
        </View>

        <View style={styles.innerContainer}>
          <ScrollView style={{opacity:10,width:'100%'}}>
            <View style={{justifyContent:'center',alignItems:'center'}}>
            {profile_image ? 
              <View>
              <Image
              source={{uri: profile_image.uri}}
              style={{width:100, height:100, borderRadius:50}}
              /> 
             
             <FontAwesome5 name='camera' size={20} color='black' style={{position:'absolute',bottom:8,right:0}} onPress={this.handlephoto} />
              </View>
              : 
              <View>
              <Button style={{width:100,height:100,backgroundColor:'#D8B59A',justifyContent:'center',alignItems:'center',borderRadius:50}} onPress={this.handlephoto}>
              <FontAwesome5 name='camera' size={32} color="white" /> 
            </Button>
            </View>
            }
            </View>
            <View style={{width:'100%',alignItems:'center',justifyContent:'center',marginBottom:'2%'}}>
                    <Formik 
                      initialValues={{ firstname: '', lastname: '', occupation:'', email:'', phone_number:'' }}
                      onSubmit={(values)=> { this.formSubmit(values)}}
                      validationSchema={SignupSchema}
                      >
                        { ({values,handleSubmit,handleChange,handleBlur,errors,touched})=> (
                        
                        <React.Fragment>
                            <TextInput
                            style={styles.input}
                            placeholder='First Name'
                            placeholderTextColor='black'
                            validate
                            onChangeText={handleChange('firstname')}
                            onBlur={handleBlur('firstname')}
                            value={values.firstname}
                            />
                              {errors.firstname && touched.firstname ? (
                                <Text style={{fontSize:10, color:'red'}}>{errors.firstname}</Text>
                              ) : null}
                            <TextInput
                            style={styles.input}
                            placeholder='Last Name'
                            placeholderTextColor='black'
                            onChangeText={handleChange('lastname')}
                            />
                              {errors.lastname && touched.lastname ? (
                                <Text style={{fontSize:10, color:'red'}}>{errors.lastname}</Text>
                              ) : null}
                            <TextInput
                            style={styles.input}
                            placeholder='Occupation'
                            placeholderTextColor='black'
                            onChangeText={handleChange('occupation')}
                            onBlur={handleBlur('occupation')}
                            value={values.occupation}
                            />
                            <TextInput
                            style={styles.input}
                            placeholder='Email'
                            placeholderTextColor='black'
                            autoCapitalize="none"
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            />
                            {errors.email && touched.email ? <Text style={{fontSize:10, color:'red'}}>{errors.email}</Text> : null}
                            <TextInput
                            style={styles.input}
                            placeholder='Phone Number'
                            placeholderTextColor='black'
                            keyboardType='numeric'
                            onChangeText={handleChange('phone_number')}
                            onBlur={handleBlur('phone_number')}
                            value={values.phone_number}
                            />
                          
                          {
                            !this.state.isLocationAccessed ? <Button style={{backgroundColor:"#FF8A65",justifyContent:'center',alignItems:'center',width:'50%',borderRadius:20}} onPress={handleSubmit}>
                            <Text style={{fontWeight:'bold'}}>PROCEED</Text>
                          </Button> :
                         
                            <Button style={{backgroundColor:"#FF8A65",justifyContent:'center',alignItems:'center',width:'50%',borderRadius:20}} onPress={()=>{this.postData()}}>
                              <Text style={{fontWeight:'bold'}}>SUBMIT</Text>
                            </Button>
                           }
                            

                          </React.Fragment>   
                        
                        )}
                      </Formik>
            </View>


          </ScrollView>
        </View>

      </View>

      </ImageBackground>
    )
  }
}
 
const styles = StyleSheet.create({
  input: {
    opacity:1,
    width: '100%',
    height: 42,
    backgroundColor: '#fed16c',
    margin: 10,
    padding: 8,
    fontSize: 14,
    fontWeight: '500',
    borderRadius:10
  },
  container: {
    flex: 1,
    alignItems:'center',
    height:'100%',
    width:'100%',
    backgroundColor:(255,255,255,0.7)
  },
  innerContainer:{
    
    width:'90%',
    height:'75%',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#ffe79f',
    opacity:0.7,
    padding:'3%',
    borderRadius:20,
    elevation:8
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  }
});
export default SignUp;