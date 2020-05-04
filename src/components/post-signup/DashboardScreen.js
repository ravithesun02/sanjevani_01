import React ,{Component} from 'react';
import { View, Text,Button, ImageBackground, StyleSheet,Image,Dimensions ,AsyncStorage} from 'react-native';
import firebase from 'firebase';
import { ScrollView } from 'react-native-gesture-handler';
import LocationModule from '../assests/reuse/LocationComponent';
import BackModule from '../assests/reuse/BgModule';
import * as Location from 'expo-location';
import {baseURL} from '../assests/reuse/baseUrl';
import * as SecureStore from 'expo-secure-store';
import Loader from '../assests/reuse/loadingScreen';


const {height,width}=Dimensions.get('window');

var Data={};

class Dashboard extends Component{

    constructor(props)
    {
        super(props);
        this.state={
            isLocationEnabled:false,
            jwtToken:null,
            isStorage:false,
            statusLocation:'denied',
            userState:'',
            isLoading:false

        }
    }


    //fetch Api 

    fetchData=async()=>{

        try
        {
       let res=await fetch('https://api.rootnet.in/covid19-in/unofficial/covid19india.org/statewise');
        if(res.ok)
        {
            let data=await res.json();
            //console.log(res);
            Data.lastFetch=data.data.lastRefreshed;
          
                Data.cn_confirmedcases=data.data.total.confirmed;
                Data.cn_active=data.data.total.active;
                Data.cn_deaths=data.data.total.deaths;
                Data.cn_recovered=data.data.total.recovered;
           
            let stateData=data.data.statewise;
            for(let i=0;i<data.data.statewise.length;i++)
            {
                if(stateData[i].state===this.state.userState)
                {
                  
                        Data.sn_confirmed=stateData[i].confirmed,
                        Data.sn_active=stateData[i].active,
                        Data.sn_deaths=stateData[i].deaths,
                        Data.sn_recovered=stateData[i].recovered
                    
                    break;
                }
            }
         //  console.log(Data);
          
        }
        else
        {
            console.log(res.status);
        }
        }
        catch(err)
        {
            console.log(err);
        }
    }
    
    componentDidUpdate()
    {
        if(this.state.isStorage && !this.state.isLocationEnabled && this.state.statusLocation==='denied')
        this.locationStatus();
    }

     async componentDidMount()
      {
          this.setState({isLoading:true});
          try
          {
            let token = await  SecureStore.getItemAsync('jwt_key');
            this.setState({jwtToken:token});
          }
          catch(error)
          {
              console.log(error);
          }
 

           await this.checkStorage();

       console.log('running');

       await this.fetchData();
       //console.log(Data);
       this.setState({isLoading:false})
      }

      checkStorage= async ()=>{


        try{
            let value=await AsyncStorage.getItem('userinfo');
            if(value == null)
            {
              await  this.setStorage();
            }
            else
            {
                this.setState({isStorage:true,userState:JSON.parse(value).address.state});
                //console.log(this.state.userState);
                
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
                this.setState({isStorage:true,userState:userinfo.address.state});
               
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
  
      // console.log(status);
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
        if(this.state.isLoading)
        {
            return <Loader/>
        }

else
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
                        <Text style={{fontSize:10,fontWeight:'bold'}}>As on : {Data.lastFetch}  </Text>
                    </View>
                    <View style={{justifyContent:'flex-end',flexDirection:'row',marginTop:'4%'}}>
                        <Text style={{marginHorizontal:'8%',fontSize:16,fontWeight:'bold'}}>Across India</Text>
                          <Text style={{marginRight:'9%',fontSize:16,fontWeight:'bold'}}> {this.state.userState} </Text>
                    </View>
                    <View style={{ flex: 1,marginTop:'3%',justifyContent:'space-around', flexDirection: 'row'}}>
                            <View style={{ flex: 1,justifyContent:'center',alignItems:'center' }}>
                                <Text style={{fontSize:15,fontWeight:'bold',color:'blue'}}>Confirmed Cases</Text>
                            </View>
                            <View style={{ flex: 1 ,justifyContent:'center',alignItems:'center'}}>
                                <Text> {Data.cn_confirmedcases} </Text>
                            </View>
                            <View style={{ flex: 1,alignItems:'center',justifyContent:'center'}}>
                                <Text> {Data.sn_confirmed} </Text>
                            </View>
                    </View>
                    <View style={{ flex: 1,marginTop:'3%',justifyContent:'space-around', flexDirection: 'row'}}>
                            <View style={{ flex: 1,justifyContent:'center',alignItems:'center' }}>
                                <Text style={{fontSize:15,fontWeight:'bold',color:'orange'}}>Active Cases</Text>
                            </View>
                            <View style={{ flex: 1 ,justifyContent:'center',alignItems:'center'}}>
                                <Text> {Data.cn_active}  </Text>
                            </View>
                            <View style={{ flex: 1,alignItems:'center',justifyContent:'center'}}>
                                <Text> {Data.sn_active} </Text>
                            </View>
                    </View>
                    <View style={{ flex: 1,marginTop:'3%',justifyContent:'space-around', flexDirection: 'row'}}>
                            <View style={{ flex: 1,justifyContent:'center',alignItems:'center' }}>
                                <Text style={{fontSize:15,fontWeight:'bold',color:'green'}}>Recovered Cases</Text>
                            </View>
                            <View style={{ flex: 1 ,justifyContent:'center',alignItems:'center'}}>
                                <Text> {Data.cn_recovered}  </Text>
                            </View>
                            <View style={{ flex: 1,alignItems:'center',justifyContent:'center'}}>
                                <Text> {Data.sn_recovered} </Text>
                            </View>
                    </View>
                    <View style={{ flex: 1,marginTop:'3%',justifyContent:'space-around', flexDirection: 'row'}}>
                            <View style={{ flex: 1,justifyContent:'center',alignItems:'center' }}>
                                <Text style={{fontSize:15,fontWeight:'bold',color:'red'}}>Death Cases</Text>
                            </View>
                            <View style={{ flex: 1 ,justifyContent:'center',alignItems:'center'}}>
                                <Text> {Data.cn_deaths} </Text>
                            </View>
                            <View style={{ flex: 1,alignItems:'center',justifyContent:'center'}}>
                                <Text> {Data.sn_deaths} </Text>
                            </View>
                    </View>
                    <ScrollView>
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
        marginTop:10,
       
    },
    insideContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})


export default Dashboard;