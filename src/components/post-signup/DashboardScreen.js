import React ,{Component} from 'react';
import { View, Text,Button, ImageBackground, StyleSheet,Image,Dimensions ,AsyncStorage} from 'react-native';
import firebase from 'firebase';
import { ScrollView } from 'react-native-gesture-handler';
import LocationModule from '../assests/reuse/LocationComponent';
import BackModule from '../assests/reuse/BgModule';
import * as Location from 'expo-location';
import {baseURL} from '../assests/reuse/baseUrl';
import * as SecureStore from 'expo-secure-store';


const {height,width}=Dimensions.get('window');

class Dashboard extends Component{

    constructor(props)
    {
        super(props);
        this.state={
            isLocationEnabled:false,
            jwtToken:null,
            isStorage:false,
            statusLocation:'denied'
        }
    }
    
    componentDidUpdate()
    {
        if(this.state.isStorage && !this.state.isLocationEnabled && this.state.statusLocation==='denied')
        this.locationStatus();
    }

     async componentDidMount()
      {
          try
          {
            let token = await  SecureStore.getItemAsync('jwt_key');
            this.setState({jwtToken:token});
          }
          catch(error)
          {
              console.log(error);
          }
 

            this.checkStorage();

       
      }

      checkStorage= async ()=>{


        try{
            let value=await AsyncStorage.getItem('userinfo');
            if(value == null)
            {
                this.setStorage();
            }
            else
            {
                this.setState({isStorage:true});
            }
        }
        catch(error)
        {
            console.log(error);
            this.setStorage();
        }

      }

      setStorage=async()=>{
        fetch(baseURL+'/users/login',{
            method:'GET',
            headers:{
                'Authorization':'Bearer '+this.state.jwtToken
            }
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
          .then(async(data)=>{
              //console.log(data);
              let userinfo=data.user;
            try{
                await AsyncStorage.setItem('userinfo',JSON.stringify(userinfo));
                console.log('stored');
                this.setState({isStorage:true});
               
            }
            catch(err)
            {
                console.log(err);
            }
              
              

          },(err)=>console.log(err))
          .catch((err)=>{console.warn(err.message);return;});


      }

      locationStatus=async()=>{
        let {status}=await Location.getPermissionsAsync();
  
       console.log(status);
       this.setState({statusLocation:status});
    
        if(status==='granted')
        {
         // console.log('Status chnaged');
          this.setState({
            isLocationEnabled:true
          });
        }
      }
    render()
    {
        return(
            <ImageBackground source={require('../assests/images/back.png')} style={{width:'100%',height:'100%'}}>
                <LocationModule/>
                {this.state.isLocationEnabled && <BackModule/> }
                <View style={styles.container}>
                    <View style={styles.titleImage}>
                        <Image style={{width:250,height:45}} source={require('../assests/images/title.png')}/>
                    </View>
                    <View style={styles.title}>
                        <Text style={{fontWeight:'bold',fontSize:18}}>COVID-19 Dashboard</Text>
                        <Text style={{fontSize:10,fontWeight:'bold'}}>As on : 13 April,2020</Text>
                    </View>
                    <ScrollView>
                    <View style={{flex:2}}>
                    <View style={styles.title}>
                        <Text style={{color:'blue',fontWeight:'bold',fontSize:32}}>221000</Text>
                        <Text style={{color:'blue'}}>Active Cases</Text>

                    </View>
                    <View style={{flexDirection:'row',marginHorizontal:5,marginTop:8,justifyContent:'space-around'}}>
                    <View style={{justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'green',fontWeight:'bold',fontSize:20}}>221</Text>
                        <Text style={{color:'green'}}>Cured Cases</Text>

                    </View>
                    <View style={{justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'red',fontWeight:'bold',fontSize:20}}>221</Text>
                        <Text style={{color:'red'}}>Death Cases</Text>

                    </View>
                    <View style={{justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'orange',fontWeight:'bold',fontSize:20}}>2</Text>
                        <Text style={{color:'orange'}}>Migrated Cases</Text>

                    </View>
                    </View>
                    </View>
                    <View style={styles.insideContainer}>
                        <Image style={{height:350,width:350}} source={require('../assests/images/Stay-Safe.png')}/>

                    </View>

                    </ScrollView>


                </View>

            </ImageBackground>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1
    },
    title:{
        
        justifyContent:'center',
        alignItems:'center',
        marginTop:15

    },
    titleImage:{
        justifyContent:'center',
        alignItems:'center',
        marginTop:30,
       
    },
    insideContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})


export default Dashboard;