import React from 'react';
import {View, TextInput,StyleSheet, Text, ImageBackground,Image,ActivityIndicator,Dimensions, ListView, ScrollView,Modal,} from 'react-native'
import {Formik} from 'formik';
import * as ImagePicker from 'expo-image-picker';
import camimg from '../assests/images/title.png';
import * as Yup from 'yup';
import { Card, ListItem, List,Button ,Toast,CheckBox} from 'native-base';
import FontAwesome5  from 'react-native-vector-icons/FontAwesome5';
import  Entypo from 'react-native-vector-icons/Entypo';
import * as Location from 'expo-location';
import LocationModule from '../assests/reuse/LocationComponent';
import {openSettings,SendIntentAndroid} from 'react-native-send-intent';
import {baseURL} from '../assests/reuse/baseUrl';
import * as SecureStore from 'expo-secure-store';
import Loader from '../assests/reuse/loadingScreen';
import PDF from '../pre-signup/T&C'


const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dzixwmfmz/upload';
var googleData={};
const {height,width}=Dimensions.get('window');

const SignupSchema = Yup.object().shape({
  first_name: Yup.string()
    .min(2, '*Too Short!')
    .max(50, '*Too Long!')
    .required('*firstname Required'),
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
      isImageSelected:false,
      isImageUploading:false,
      isLoading:false,
      isChecked:false,
      termModal:false,
      locationModal:false

    }
  }

  fetchGoogleUser=async()=>{
    this.setState({isLoading:true});
    try
    {
     let response=await fetch(baseURL+'/users/login',{
       method:'GET',
       headers:{
         'Authorization':'Bearer '+this.state.jwtToken
       }
     })
     if(response.ok)
     {
       let data=await response.json();
       let result=data.user;

      // console.log(result);
       googleData.first_name=result.first_name;
       googleData.last_name=result.last_name;
       googleData.email=result.email;
     //  console.log(googleData);
      

     }

    }
    catch(error)
    {
      console.log(error);
    }
    this.setState({isLoading:false});
  }

 async componentDidMount(){
  //console.log('sisgn up');
    try
    {
      let token = await  SecureStore.getItemAsync('jwt_key');
      this.setState({jwtToken:token});
    }
    catch(error)
    {
        console.log(error);
    }

  await this.fetchGoogleUser();
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
    isImageSelected:true,isImageUploading:true});
    
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
     // console.log(data);

//Here I'm using another hook to set State for the photo that we get back //from Cloudinary
//console.log(data.url);
      this.setState({profile_image:data.url,isImageUploading:false});
    }).catch(err => console.log(err))
  }

  togglecheck=()=>{
    this.setState({isChecked: !this.state.isChecked})
  }
  termModal=()=>{
      this.setState({
        termModal:!this.state.termModal
      })
  }

  proceedToSubmit=()=>{
    
    this.setState({
      isLocationAccessed:!this.state.isLocationAccessed,
      modalVisible:!this.state.modalVisible
    });

  }

  findCoordinates =async() => {
    this.setState({locationModal:true})
    await sleep(1500);
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
  this.setState({isLoading:true});
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
    this.setState({isLoading:false});
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
    if(this.state.isLoading)
      return <Loader/>
else
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
            visible={this.state.isImageUploading}
            transparent={true}
            animationType='fade'
            >
              <View style={styles.centeredView}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text style={{fontSize:16,fontWeight:'bold'}}>Uploading .....</Text>
              </View>

            </Modal>
        
         <Modal
            animationType='fade'
            transparent={true}
            visible={this.state.modalVisible}
            >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
              {this.state.locationModal &&  <LocationModule/>}
            <Text style={{margin:'5%',fontFamily:'Right'}}>Kindly give us access to your Location</Text>
            <Text style={{margin:'5%',marginBottom:'6%',fontFamily:'MSRegular',color:'red'}}>Please be sure you are at your HOME , while enabling Location</Text>
           <Button style={{padding:15,backgroundColor:'#3570E2',borderRadius:15,flexDirection:'row'}} onPress={this.findCoordinates}>
             <Entypo name="location-pin" color='white' size={22} />
             <Text style={{color:'white',fontFamily:'MSRegular'}} >Allow</Text>
           </Button>
            </View>
            </View>
          </Modal>
          <Modal
            animationType='slide'
            visible={this.state.termModal}
            > 
              <PDF/>
                <Button onPress={() => this.setState({termModal:false})} style={{alignItems:'center',justifyContent:'center',backgroundColor:'grey'}} ><Text style={{fontWeight:'500'}}> CLOSE </Text></Button>
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
                      initialValues={{ first_name: `${googleData.first_name}`, last_name:`${googleData.last_name}`, occupation:'', email:`${googleData.email}`, mobile:'' }}
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
                            editable={false}
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
                            <List>
                              <ListItem noBorder>
                                <CheckBox style={{borderRadius:10,height:20,width:20}} checked={this.state.isChecked} onPress={()=> this.togglecheck()} />
                                <Text> I agree to </Text>
                                <Button transparent onPress={()=>this.termModal()}><Text style={{color:'blue'}}>terms & conditions</Text></Button>                           
                              </ListItem>
                            
                            </List>
                          
                          {
                            !this.state.isLocationAccessed ? <Button style={{backgroundColor:"#FF8A65",justifyContent:'center',alignItems:'center',width:'50%',borderRadius:20}} disabled={!this.state.isChecked} onPress={handleSubmit}>
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
  },
  pdf:{
    width:width,
    height:'93.5%'
  }
});
export default SignUp;