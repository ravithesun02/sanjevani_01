import React ,{Component} from 'react';
import { View, Text, ImageBackground, StyleSheet,Image,Dimensions,Animated,AppState ,AsyncStorage,ActivityIndicator} from 'react-native';
import {Button} from 'native-base';
import firebase from 'firebase';
import { ScrollView } from 'react-native-gesture-handler';
import LocationModule from '../assests/reuse/LocationComponent';
import BackModule from '../assests/reuse/BgModule';
import * as Location from 'expo-location';
import {baseURL} from '../assests/reuse/baseUrl';
import * as SecureStore from 'expo-secure-store';
import Loader from '../assests/reuse/loadingScreen';
import WebView from 'react-native-webview';
import AutoHeightWebView from 'react-native-autoheight-webview';


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
            isLoading:false,
            webViewLoading:true,
            currentTab:0,
            opacity:new Animated.Value(0),
            appState:AppState.currentState

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


  componentWillUnmount() {
   // AppState.removeEventListener('change',this._handleAppStateChange());
  }

     async componentDidMount()
      {
      //  AppState.addEventListener('change',this._handleAppStateChange());
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

      _handleAppStateChange = (nextAppState) => {
        if (
          this.state.appState.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          console.log('App has come to the foreground!');
          this.fetchData();
        }
        this.setState({appState: nextAppState});
      };

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
      ActivityIndicatorLoadingView() {
        //making a view to show to while loading the webpage
        return (
          <ActivityIndicator
             color="#009688"
             size="large"
             style={styles.ActivityIndicatorStyle}
          />
        );
     }

     onLoad = () => {
         this.state.opacity.setValue(0)
        Animated.timing(this.state.opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      }
      
     renderData=()=>{
               
    const animatedStyle = {
 
        opacity: this.state.opacity
   
      }
         if(this.state.currentTab==0)
         {
             return (
                 <Animated.View style={{flex:1,...animatedStyle}} onLoad={this.onLoad()}>
                     <View style={styles.textData}>
                        <Text style={{fontSize:16,fontWeight:'bold',color:'blue',marginLeft:'10%',letterSpacing:1}}>Confirmed Cases</Text>
                        <Text style={{marginRight:'10%',fontSize:16}}>{Data.cn_confirmedcases}</Text>
                     </View>
                     <View style={styles.textData}>
                        <Text style={{fontSize:16,fontWeight:'bold',color:'orange',marginLeft:'10%',letterSpacing:1}}>Active Cases</Text>
                        <Text style={{marginRight:'10%',fontSize:16}}> {Data.cn_active} </Text>
                     </View>
                     <View style={styles.textData}>
                        <Text style={{fontSize:16,fontWeight:'bold',color:'green',marginLeft:'10%',letterSpacing:1}}>Recovered Cases</Text>
                        <Text style={{marginRight:'10%',fontSize:16}}>{Data.cn_recovered}</Text>
                     </View>
                     <View style={styles.textData}>
                        <Text style={{fontSize:16,fontWeight:'bold',color:'red',marginLeft:'10%',letterSpacing:1}}>Death Cases</Text>
                        <Text style={{marginRight:'10%',fontSize:16}}> {Data.cn_deaths} </Text>
                     </View>
                 </Animated.View>
             )
         }
         else
         {
             return(
                <Animated.View style={{flex:1,...animatedStyle}} onLoad={this.onLoad()}>
                <View style={styles.textData}>
                   <Text style={{fontSize:16,fontWeight:'bold',color:'blue',marginLeft:'10%',letterSpacing:1}}>Confirmed Cases</Text>
                   <Text style={{marginRight:'10%',fontSize:16,}}> {Data.sn_confirmed} </Text>
                </View>
                <View style={styles.textData}>
                   <Text style={{fontSize:16,fontWeight:'bold',color:'orange',marginLeft:'10%',letterSpacing:1}}>Active Cases</Text>
                   <Text style={{marginRight:'10%',fontSize:16}}> {Data.sn_active} </Text>
                </View>
                <View style={styles.textData}>
                   <Text style={{fontSize:16,fontWeight:'bold',color:'green',marginLeft:'10%',letterSpacing:1}}>Recovered Cases</Text>
                   <Text style={{marginRight:'10%',fontSize:16}}> {Data.sn_recovered} </Text>
                </View>
                <View style={styles.textData}>
                   <Text style={{fontSize:16,fontWeight:'bold',color:'red',marginLeft:'10%',letterSpacing:1}}>Death Cases</Text>
                   <Text style={{marginRight:'10%',fontSize:16}}> {Data.sn_deaths} </Text>
                </View>
                </Animated.View>
             )
         }
     }
    render()
    {

        const INJECTED_JS=`(function(){

            document.querySelectorAll('.col-lg-12').forEach((item)=>{
                item.remove();
            });
            document.querySelector('.navbar').remove();
            document.querySelector('.col-md-8').remove();
            document.body.style.background = 'transparent';
            document.querySelectorAll('a').forEach((item)=>{
                item.remove()
            });


        })();`;

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
                    <ScrollView>
                    <View style={styles.title}>
                        <Text style={{fontWeight:'bold',fontSize:18}}>COVID-19 Dashboard</Text>
                        <Text style={{fontSize:10,fontWeight:'bold'}}>As on : {new Date(Data.lastFetch).toDateString()} {new Date(Data.lastFetch).toTimeString()}  </Text>
                    </View>

                    <View style={{flex:1,marginTop:10,padding:5}}>
                    <View style={{flexDirection:'row',alignItems:'stretch'}}>
                        <Button transparent onPress={()=>this.setState({currentTab:0})} style={{borderBottomColor:'black',borderBottomWidth:this.state.currentTab===0 ? 2:0,width:'50%',justifyContent:'center'}}>
                            <Text style={{color:this.state.currentTab===0 ? 'black':'grey',fontWeight:this.state.currentTab===0 ? 'bold':'normal',letterSpacing:1}}>
                                INDIA
                            </Text>
                        </Button>
                        <Button transparent onPress={()=>this.setState({currentTab:1})} style={{borderBottomColor:'black',borderBottomWidth:this.state.currentTab===1 ? 2:0,width:'50%',justifyContent:'center'}}>
                            <Text style={{color:this.state.currentTab===1 ? 'black':'grey',fontWeight:this.state.currentTab===1 ? 'bold':'normal',letterSpacing:1}}>
                                {this.state.userState.toUpperCase()}
                            </Text>
                        </Button>
                    </View>

                  {this.renderData()}

                </View>
                    {/* <View style={{justifyContent:'flex-end',flexDirection:'row',marginTop:'4%'}}>
                        <Text style={{marginRight:'8%',alignItems:'center',fontSize:16,fontWeight:'bold'}}>Across India</Text>
                          <Text style={{fontSize:16,marginRight:'7%',alignItems:'center',fontWeight:'bold'}}> {this.state.userState} </Text>
                    </View> */}
                    {/* <View style={{ flex: 1,marginTop:'1%',justifyContent:'space-around', flexDirection: 'row'}}>
                            <View style={{ flex: 1,justifyContent:'center',alignItems:'center',opacity:0 }}>
                                <Text style={{fontSize:15,fontWeight:'bold',color:'blue'}}>Confirmed Cases</Text>
                            </View>
                            <View style={{ flex: 1 ,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{alignItems:'center',fontSize:16,fontWeight:'bold'}}>Across India</Text>
                            </View>
                            <View style={{ flex: 1,alignItems:'center',justifyContent:'center'}}>
                            <Text style={{fontSize:16,alignItems:'center',fontWeight:'bold'}}> {this.state.userState} </Text>
                            </View>
                    </View>
                    <View style={{flex:1,justifyContent:'center',marginBottom:'2%', alignItems:'center'}}>
                    <View style={{ flex: 1,marginTop:'1%',justifyContent:'space-around', flexDirection: 'row'}}>
                            <View style={{ flex: 1,justifyContent:'center',alignItems:'center' }}>
                                <Text >Confirmed Cases</Text>
                            </View>
                            <View style={{ flex: 1 ,justifyContent:'center',alignItems:'center'}}>
                                <Text> {Data.cn_confirmedcases} </Text>
                            </View>
                            <View style={{ flex: 1,alignItems:'center',justifyContent:'center'}}>
                                <Text> {Data.sn_confirmed} </Text>
                            </View>
                    </View>
                    <View style={{ flex: 1,marginTop:'1%',justifyContent:'space-around', flexDirection: 'row'}}>
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
                    <View style={{ flex: 1,marginTop:'1%',justifyContent:'space-around', flexDirection: 'row'}}>
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
                    <View style={{ flex: 1,marginTop:'1%',justifyContent:'space-around', flexDirection: 'row'}}>
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
                    </View> */}
                    
                    <View style={styles.insideContainer}>
                        <View style={{flex:1,width:'90%',height:250,justifyContent:'center',alignSelf:'center',alignItems:'center'}}>
                        <Image style={{width:'100%',height:'100%'}}  source={require('../assests/images/Stay-Safe.png')}/>
                        </View>
                        

                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'grey',borderRadius:20,elevation:5,padding:10,margin:10}}>
                        <Text style={{fontSize:20,fontWeight:'bold'}}>LATEST NEWS</Text>

                    </View>

                    <View style={{flex:1}}>
                            <AutoHeightWebView customScript={INJECTED_JS} source={{uri:'https://corona-go.info'}}   javaScriptEnabled={true}
                                domStorageEnabled={true}
                                startInLoadingState={true}
                            scalesPageToFit={true} onLoadEnd={()=>this.setState({webViewLoading:false})} />
                                {this.state.webViewLoading &&   <ActivityIndicator
                                color="#009688"
                                size="large"
                                style={styles.ActivityIndicatorStyle}
                            />}
                            
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
        elevation:5,
        paddingBottom:5
       
    },
    insideContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    video: {
        marginTop: 20,
        height: 1000,
        width:width,
        flex: 1,
        elevation:5
      },
      ActivityIndicatorStyle: {
        flex: 1,
        justifyContent: 'center',
      },
      textData:{
          flexDirection:'row',
          justifyContent:'space-between',
          marginTop:'3%'
      }

})


export default Dashboard;