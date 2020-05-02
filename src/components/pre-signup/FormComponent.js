import React from 'react';
import {View, TextInput,StyleSheet, Text, ImageBackground,Image, ListView, ScrollView,Modal} from 'react-native'
import {Formik} from 'formik';
import * as ImagePicker from 'expo-image-picker';
import camimg from '../assests/images/title.png';
import * as Yup from 'yup';
import { Card, ListItem, List,Button ,Toast} from 'native-base';
import FontAwesome5  from 'react-native-vector-icons/FontAwesome5';
import  Entypo from 'react-native-vector-icons/Entypo';
import * as Location from 'expo-location';
import LocationModule from '../assests/reuse/LocationComponent';
import {openSettings} from 'react-native-send-intent';
import {baseURL} from '../assests/reuse/baseUrl';
import * as SecureStore from 'expo-secure-store';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dzixwmfmz/upload';

const SignupSchema = Yup.object().shape({
  first_name: Yup.string()
    .min(2, '*Too Short!')
    .max(50, '*Too Long!')
    .required('*firstname Required'),
  last_name: Yup.string()
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
      openSetting:false,
      jwtToken:null,
      userInfo:{},
      isImageSelected:false
    }
  }

  componentDidMount(){

    SecureStore.getItemAsync('jwt_key')
    .then((data)=>{
     let token=data;
    // console.log(token);
      this.setState({jwtToken:token});
    })
    .catch((err)=>console.warn(err));

    // this.setState({
    //   userInfo:JSON.parse(this.props.navigation.getParam('user',''))
    // });
    this.setState({
      profile_image:this.props.navigation.getParam('profilepic')
    });

  }

  

  handlephoto = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();
    if (permissionResult.granted === false){
      alert("Permission to access camera roll is required");
      return;
    }
   // console.log(this.state.profile_image);
    let pickerResult = await ImagePicker.launchImageLibraryAsync({base64:true,quality:1});
   
  // console.log(pickerResult);
if(!pickerResult.cancelled)
  { 
    //console.log('Setting');
    let base64img=`data:image/jpg;base64,${pickerResult.base64}`;
    this.setState({profile_image:pickerResult.uri,
    isImageSelected:true});
    this.handleUploadPhoto(base64img);
  }
  }

  handleUploadPhoto = (base64img) => {
    let data = {
      "file": base64img,
      "upload_preset": "xdeb7miu",
    }
    fetch(CLOUDINARY_URL, {
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
    }).then(async r => {
      let data = await r.json();
      console.log(data);

//Here I'm using another hook to set State for the photo that we get back //from Cloudinary
//console.log(data.url);
      this.setState({profile_image:data.url});
    }).catch(err => console.log(err))
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
       // alert('Permission to access location was denied');
        this.setState({
          isModal:true
        });
        
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
 // console.log(this.state.formData);
}

opensettings=()=>{
 // console.log('here');

  openSettings("android.settings.SETTINGS");

  this.setState({
    openSetting:false
  });

}

postData=()=>
{
  this.state.formData.home_location={
    'latitude':this.state.lat,
    'longitude':this.state.lon
  };
  this.state.formData.newid=false;
this.state.formData.profile_pic=this.state.profile_image;

//console.log(this.state.formData);

fetch(baseURL+'/users/login',{
  method:'PUT',
  headers:{
    'Content-Type':'application/json',
    'Authorization':'Bearer '+this.state.jwtToken
  },
  credentials:'same-origin',
  body:JSON.stringify(this.state.formData)
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
  //console.log(data);
  if(data.status==='success')
  {
    
    this.props.navigation.navigate('Dash');
    
  }
  else
  {
    alert('Check your Internet connection');
  }
})
.catch((err)=>
  {
    Toast.show({
      text:err,
      buttonText:'OKAY',
      type:'danger',
      duration:2000
    });
    console.log(err);
  })

  
}

  render() {
    
  // const {profile_image}=this.state;
    return (
      <ImageBackground source={require('../assests/images/back.png')} style={{width:'100%',height:'100%',flex:1}} >
         <Modal 
            onDismiss={()=>{this.state.openSetting?this.opensettings():undefined}}
            visible={this.state.isModal}
            transparent={true}
            animationType='fade'
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={{color:'red',fontWeight:'bold',marginVertical:5}}>It seems like you have disabled location ! </Text>
                        <Button style={{borderRadius:10,justifyContent:'center',alignItems:'center',padding:8,backgroundColor:'#FF8A65'}} onPress={()=>{this.setState({isModal:false,openSetting:true});this.opensettings()}}>
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
            {this.state.profile_image ? 
              <View>
              <Image
              source={this.state.isImageSelected ?{uri:this.state.profile_image}:{uri:this.state.profile_image}}
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
                      initialValues={{ first_name: '', last_name: '', occupation:'', email:'', mobile:'' }}
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
                            onChangeText={handleChange('first_name')}
                            onBlur={handleBlur('first_name')}
                            value={values.first_name}
                            />
                              {errors.first_name && touched.first_name ? (
                                <Text style={{fontSize:10, color:'red'}}>{errors.first_name}</Text>
                              ) : null}
                            <TextInput
                            style={styles.input}
                            placeholder='Last Name'
                            placeholderTextColor='black'
                            onChangeText={handleChange('last_name')}
                            />
                              {errors.last_name && touched.last_name ? (
                                <Text style={{fontSize:10, color:'red'}}>{errors.last_name}</Text>
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
                            onChangeText={handleChange('mobile')}
                            onBlur={handleBlur('mobile')}
                            value={values.mobile}
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