import React ,{Component} from 'react';
import { View, Text, ImageBackground, StyleSheet,Image,Dimensions,Animated,Clipboard,Easing,AppState ,AsyncStorage,ActivityIndicator, Linking, StatusBar} from 'react-native';
import {Button, Container, Fab,Icon, Toast, Accordion} from 'native-base';
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
import LottieView from 'lottie-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


const {height,width}=Dimensions.get('window');

var Data={};


class Dashboard extends Component{


    static navigationOptions={
        drawerLabel:'Home'
    }

    constructor(props)
    {
        super(props);
        this.state={
            isLocationEnabled:false,
            jwtToken:null,
            isStorage:false,
            statusLocation:'denied',
            userState:'',
            userDistrict:null,
            isLoading:false,
            webViewLoading:true,
            currentTab:0,
            opacity:new Animated.Value(0),
            appState:AppState.currentState,
            active:false,
            shareMessage:'This is from sanjevani',
            FacebookShareURL:'https://sanjevani.com/',
            speed1:new Animated.Value(0),
            speed2:new Animated.Value(0),
            speed3:new Animated.Value(0),
            speed4:new Animated.Value(0),
            newsData:[],
            districtData:[],
            dataExist:false

        }
    }


    //fetch Api 

    fetchDistrictData=async()=>{
        try
        {
            let res=await fetch('https://api.covid19india.org/v2/state_district_wise.json');

            if(res.ok)
            {
                let data=await res.json();

              //  console.log(data);

                let dstData=new Array();
               for(let i=0;i<data.length;i++)
               {
                   if(data[i].state.toLowerCase()===this.state.userState.toLowerCase())
                   {
                     // console.log(this.state.userDistrict);
                       for(let j=0;j<data[i].districtData.length;j++)
                       {
                           
                           if(data[i].districtData[j].district.toLowerCase()===this.state.userDistrict.toLowerCase())
                           {
                                dstData.push(data[i].districtData[j]);
                                break;
                           }
                       }

                       break;
                   }
               }

             
               

                let value=await fetch('https://api.covid19india.org/zones.json');
                if(value.ok)
                {
                    let dta=await value.json();

                    let zoneData=dta.zones.filter((item)=>{
                      return  item.state.toLowerCase()===this.state.userState.toLowerCase() && item.district.toLowerCase()===this.state.userDistrict.toLowerCase()
                    });

                   
                    if(dstData[0].active)
                    {
                        this.setState({dataExist:true});
                    }
                    dstData[0].color=zoneData[0].zone.toLowerCase();

                    this.setState({districtData:dstData});

                    
                }



            }
        }
        catch(error)
        {
            console.log(error);
        }
    }

    fetchData=async()=>{

        try
        {
       let res=await fetch('https://api.rootnet.in/covid19-in/unofficial/covid19india.org/statewise');
        if(res.ok)
        {
            let data=await res.json();
           // console.log(data);
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

    //fetch news
    fetchNews=async()=>{
        try
        {
            let res=await fetch('http://newsapi.org/v2/top-headlines?country=in&q=corona',{
                method:'GET',
                headers:{
                    Authorization:'Bearer 49e8c42e49a84330ba7a21b1c6e7c9eb'
                }
            });

            if(res.ok)
            {
                let data=await res.json();
                this.setState({
                    newsData:data.articles
                });



            }
        }
        catch(error)
        {
            Toast.show({
                text:'Network Error',
                position:'top',
                type:'danger'
            });
        }
    }

    postOnFacebook=() => {
        let FacebookShareURL = this.state.FacebookShareURL;
        let FacebookShareMessage = this.state.FacebookShareMessage;
        let facebookParameters='';
        if(this.state.FacebookShareURL != undefined)
        {
            if(facebookParameters.includes("?") == false)
            {
                facebookParameters = facebookParameters+"?u="+encodeURI(this.state.FacebookShareURL);
            }else{
                facebookParameters = facebookParameters+"&u="+encodeURI(this.state.FacebookShareURL);
            }
        }
        if(this.state.FacebookShareMessage != undefined)
        {
            if(facebookParameters.includes("?") == false)
            {
                facebookParameters = facebookParameters+"?quote="+encodeURI(this.state.FacebookShareMessage);
            }else{
                facebookParameters = facebookParameters+"&quote="+encodeURI(this.state.FacebookShareMessage);
            }
        }
        let url = 'https://www.facebook.com/sharer/sharer.php'+facebookParameters;
        Linking.openURL(url).then((data) => {
          alert('Facebook Opened');
        }).catch(() => {
          alert('Something went wrong');
        });
      }

      writeToClipboard =() => {
        //To copy the text to clipboard
        this.setState({
            active:false
        });
         Clipboard.setString(this.state.shareMessage);

         Toast.show({
             text:'Copied to clipboard',
             type:'success',
             position:'top'
         })

        //alert('Copied to Clipboard!');

        console.log('copied');
      };
    
    componentDidUpdate()
    {
        if(this.state.isStorage && !this.state.isLocationEnabled && this.state.statusLocation==='denied')
        this.locationStatus();
    }


  componentWillUnmount() {
    AppState.removeEventListener('change',this._handleAppStateChange);
  }

     async componentDidMount()
      {
      AppState.addEventListener('change',this._handleAppStateChange);
      
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

       await this.fetchNews();

       if(this.state.userDistrict)
       await this.fetchDistrictData();

       console.log(this.state.districtData);
       console.log(this.state.districtData[0].color);
       //console.log(Data);
       this.setState({isLoading:false});
      // this.animation.play();
    //   this.animation1.play();
  
      }

      _handleAppStateChange = async (nextAppState) => {
        if (
          this.state.appState.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
         // console.log('App has come to the foreground!');
         await this.fetchData();
        }
        this.setState({appState: nextAppState});
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
                if(JSON.parse(value).address.district)
                {
                    this.setState({userDistrict:JSON.parse(value).address.district});
                }
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
               // console.log('stored');
                this.setState({isStorage:true,userState:userinfo.address.state});
                if(userinfo.address.district)
                {
                    this.setState({userDistrict:userinfo.address.district});
                }
               
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
                        <Text style={{fontFamily:'Right',fontSize:16,color:'blue',marginLeft:'10%',letterSpacing:1}}>Confirmed Cases</Text>
                        <Text style={{fontFamily:'MSRegular',marginRight:'10%',fontSize:16}}>{Data.cn_confirmedcases}</Text>
                     </View>
                     <View style={styles.textData}>
                        <Text style={{fontFamily:'Right',fontSize:16,color:'orange',marginLeft:'10%',letterSpacing:1}}>Active Cases</Text>
                        <Text style={{fontFamily:'MSRegular',marginRight:'8%',fontSize:16}}> {Data.cn_active} </Text>
                     </View>
                     <View style={styles.textData}>
                        <Text style={{fontFamily:'Right',fontSize:16,color:'green',marginLeft:'10%',letterSpacing:1}}>Recovered Cases</Text>
                        <Text style={{fontFamily:'MSRegular',marginRight:'10%',fontSize:16}}>{Data.cn_recovered}</Text>
                     </View>
                     <View style={styles.textData}>
                        <Text style={{fontFamily:'Right',fontSize:16,color:'red',marginLeft:'10%',letterSpacing:1}}>Death Cases</Text>
                        <Text style={{fontFamily:'MSRegular',marginRight:'10%',fontSize:16}}> {Data.cn_deaths} </Text>
                     </View>
                 </Animated.View>
             )
         }
         else
         {
             return(
                <Animated.View style={{flex:1,...animatedStyle}} onLoad={this.onLoad()}>
                <View style={styles.textData}>
                   <Text style={{fontFamily:'Right',fontSize:16,color:'blue',marginLeft:'10%',letterSpacing:1}}>Confirmed Cases</Text>
                   <Text style={{fontFamily:'MSRegular',marginRight:'10%',fontSize:16,}}> {Data.sn_confirmed} </Text>
                </View>
                <View style={styles.textData}>
                   <Text style={{fontFamily:'Right',fontSize:16,color:'orange',marginLeft:'10%',letterSpacing:1}}>Active Cases</Text>
                   <Text style={{fontFamily:'MSRegular',marginRight:'10%',fontSize:16}}> {Data.sn_active} </Text>
                </View>
                <View style={styles.textData}>
                   <Text style={{fontFamily:'Right',fontSize:16,color:'green',marginLeft:'10%',letterSpacing:1}}>Recovered Cases</Text>
                   <Text style={{fontFamily:'MSRegular',marginRight:'10%',fontSize:16}}> {Data.sn_recovered} </Text>
                </View>
                <View style={styles.textData}>
                   <Text style={{fontFamily:'Right',fontSize:16,color:'red',marginLeft:'10%',letterSpacing:1}}>Death Cases</Text>
                   <Text style={{fontFamily:'MSRegular',marginRight:'10%',fontSize:16}}> {Data.sn_deaths} </Text>
                </View>
                </Animated.View>
             )
         }
     }

      onLoadLottie1=()=>{
          this.state.speed1.setValue(0);
          Animated.timing(this.state.speed1,{
              toValue:1,
              duration:4000,
              easing:Easing.linear,
              useNativeDriver:true
          }).start();
      }
      onLoadLottie2=()=>{
        this.state.speed2.setValue(0);
        Animated.timing(this.state.speed2,{
            toValue:1,
            duration:4000,
            easing:Easing.linear,
            useNativeDriver:true
        }).start();
    }
    onLoadLottie3=()=>{
        this.state.speed3.setValue(0);
        Animated.timing(this.state.speed3,{
            toValue:1,
            duration:4000,
            easing:Easing.linear,
            useNativeDriver:true
        }).start();
    }
    onLoadLottie4=()=>{
        this.state.speed4.setValue(0);
        Animated.timing(this.state.speed4,{
            toValue:1,
            duration:4000,
            easing:Easing.linear,
            useNativeDriver:true
        }).start();
    }

      handleScroll=(event)=> {
        let value=event.nativeEvent.contentOffset.x;
       // console.log(event.nativeEvent.contentOffset.x);
        
         if(value>=110 && value<460)
        {
           this.onLoadLottie2();
        }
         if(value>420 && value<620)
        {
            this.onLoadLottie3();
        }
         if(value>=620)
        {
            this.onLoadLottie4();
        }

       }

       _renderHeader=(item,expanded)=>
       {
            return(
                <View style={{flex:1}}>
                    <Button rounded disabled transparent style={{marginBottom:'3%',marginLeft:'2%',marginTop:'1%',borderColor:'#feb3ce',borderWidth:3,backgroundColor:'#71b2f2',width:'20%',justifyContent:'center'}}>
                        <Text style={{fontFamily:'Right'}}> {new Date(item.publishedAt).toTimeString().toString().substring(0,5)} </Text>
                    </Button>
                    <View style={{
              flexDirection: "row",
              padding: 10,
              justifyContent: "space-between",
              alignItems: "center" ,
              margin:5
               }}>
            <Text style={{ fontFamily:'Right',fontSize:16 ,color:'#4e4e4e',width:'90%'}}>
                {" "}{item.title}
              </Text>
              {expanded
                ? <Icon style={{ fontSize: 18 }} name="remove-circle"  />
                : <Icon style={{ fontSize: 18 }} name="add-circle"/>}
            </View>
                </View>
            )
       }
       _renderContent=(item)=>{

        return(
            <View>
            <View style={{flex:1 , flexDirection:'row',justifyContent:'space-around' }}>
            <View style={{justifyContent:'center',alignItems:'center',width:150,height:150}}>
            <Image source={{uri:item.urlToImage}} style={{width:'100%',height:'100%',borderRadius:15}} />
            </View>
            <View style={{width:width-200,justifyContent:'center',alignItems:'center'}}>
                <Text style={{fontFamily:'MSRegular',color:'#4E4E4E'}}> {item.description} </Text>
               
            </View>
          
        </View>
        <View style={{flex:1 , justifyContent:'center',alignItems:'flex-end',marginTop:'1%'}}>
                    <Button transparent style={{padding:10,backgroundColor:'#528EA0',borderTopLeftRadius:20,borderBottomLeftRadius:20}} onPress={()=> Linking.openURL(item.url) }>
                        <Text style={{fontFamily:'MSRegular',color:'#FFFFFF'}}> Read More... </Text>
                    </Button>
         </View>
        
       
        </View>
        )

       }
    render()
    {

     const renderDistrict=this.state.districtData.map((item,index)=>{

          return  <View key={index}>

            <View style={{flex:1,justifyContent:'center',alignItems:'center',borderRadius:20,padding:10,margin:10,flexDirection:'row'}}>
            <FontAwesome name='circle' size={25} color={item.color} />
             <Text style={{fontSize:25,color:'#B8876B',fontFamily:'Right'}}> {this.state.userDistrict} </Text>
            </View>

            <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                <View style={{width:width/2,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                <View style={{justifyContent:'center',marginVertical:'6%',alignItems:'center'}}>
                   <Text style={{fontFamily:'Right',fontSize:16,color:'blue',marginLeft:'10%',letterSpacing:1}}>Confirmed Cases</Text>
                   <Text style={{fontFamily:'MSRegular',marginRight:'10%',marginTop:20,fontSize:16,}}> {item.confirmed} </Text>
                </View>
                <View style={{justifyContent:'center',marginVertical:'6%',alignItems:'center'}}>
                   <Text style={{fontFamily:'Right',fontSize:16,color:'orange',marginLeft:'10%',letterSpacing:1}}>Active Cases</Text>
                   <Text style={{fontFamily:'MSRegular',marginRight:'10%',marginTop:20,fontSize:16,}}> {item.active} </Text>
                </View>


                </View>
                <View style={{width:width/2,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                <View style={{justifyContent:'center',marginVertical:'6%',alignItems:'center'}}>
                   <Text style={{fontFamily:'Right',fontSize:16,color:'green',marginLeft:'10%',letterSpacing:1}}>Recovered Cases</Text>
                   <Text style={{fontFamily:'MSRegular',marginRight:'10%',marginTop:20,fontSize:16,}}> {item.recovered} </Text>
                </View>
                <View style={{justifyContent:'center',marginVertical:'6%',alignItems:'center'}}>
                   <Text style={{fontFamily:'Right',fontSize:16,color:'red',marginLeft:'10%',letterSpacing:1}}>Death Cases</Text>
                   <Text style={{fontFamily:'MSRegular',marginRight:'10%',marginTop:20,fontSize:16,}}> {item.deceased} </Text>
                </View>


                </View>

            </View>

         </View>

        })

        if(this.state.isLoading)
        {
            return <Loader/>
        }

else
        return(
            <ImageBackground source={require('../assests/images/back.png')} style={{width:'100%',height:'100%'}}>
            <StatusBar barStyle='dark-content' backgroundColor='#f9f5d9' />
                <LocationModule/>
                {this.state.isLocationEnabled && <BackModule/> }
                
                <View style={styles.container}>
                    <View style={styles.titleImage}>
                        <Button transparent style={{position:'absolute',top:4,left:10}} onPress={()=>this.props.navigation.toggleDrawer()}>
                           <Ionicons color='#ef8354' name="md-menu" size={32}/>
                        </Button>
                        <Image style={{width:250,height:45}} source={require('../assests/images/title.png')}/>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.title}>
                        <Text style={{fontSize:18,fontFamily:'Right',color:'#4E4E4E'}}>COVID-19 Dashboard</Text>
                        <Text style={{fontSize:10,fontWeight:'bold'}}>As on : {new Date(Data.lastFetch).toDateString()} {new Date(Data.lastFetch).toTimeString()}  </Text>
                    </View>

                    <View style={{flex:1,marginTop:10,padding:5}}>
                    <View style={{flexDirection:'row',alignItems:'stretch'}}>
                        <Button transparent onPress={()=>this.setState({currentTab:0})} style={{borderBottomColor:'black',borderBottomWidth:this.state.currentTab===0 ? 2:0,width:'50%',justifyContent:'center'}}>
                            <Text style={{fontFamily:'MSRegular',color:this.state.currentTab===0 ? 'black':'grey',fontWeight:this.state.currentTab===0 ? 'bold':'normal',letterSpacing:1,fontFamily:'Right'}}>
                                INDIA
                            </Text>
                        </Button>
                        <Button transparent onPress={()=>this.setState({currentTab:1})} style={{borderBottomColor:'black',borderBottomWidth:this.state.currentTab===1 ? 2:0,width:'50%',justifyContent:'center'}}>
                            <Text style={{fontFamily:'MSRegular',color:this.state.currentTab===1 ? 'black':'grey',fontWeight:this.state.currentTab===1 ? 'bold':'normal',letterSpacing:1,fontFamily:'Right'}}>
                                {this.state.userState.toUpperCase()}
                            </Text>
                        </Button>
                    </View>

                  {this.renderData()}

                </View>

                <View style={{flex:1 , justifyContent:'center',alignItems:'flex-end'}}>
                    <Button transparent  style={{padding:10,backgroundColor:'#528EA0',borderTopLeftRadius:20,borderBottomLeftRadius:20}} onPress={()=>this.props.navigation.navigate('Overall Data')}>
                        <Text style={{fontFamily:'MSRegular',color:'#ffffff'}}>Overall Stats</Text>
                    </Button>
                </View>
                 
                { this.state.dataExist ? renderDistrict : 
                    <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                        <Text style={{fontFamily:'MSRegular',color:'#4e4e4e'}}>Your district {this.state.userDistrict} does not have any cases. </Text>
                    </View>
                }
                    
                    <View style={styles.insideContainer}>
                        <View style={{flex:1,width:'90%',height:250,justifyContent:'center',alignSelf:'center',alignItems:'center'}}>
                        <Image style={{width:'100%',height:'100%'}}  source={require('../assests/images/Stay-Safe.png')}/> 
                        </View>
                        

                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center',borderRadius:20,padding:10,margin:10}}>
                        <Text style={{fontSize:25,color:'#B8876B',fontFamily:'Right'}}> THINGS TO DO</Text>

                    </View>
                    <ScrollView showsHorizontalScrollIndicator={false} onScroll={this.handleScroll} horizontal={true} contentContainerStyle={{justifyContent:'center',alignItems:'center',paddingBottom:'4%',paddingRight:'2%',paddingLeft:'2%',elevation:20}} >
                    <View style={{flex:1,justifyContent:'center',alignItems:'center',padding:15,shadowColor:'#000',shadowOpacity:0.5,shadowRadius:16,elevation:10,borderRadius:20,width:'100%'}}>
                        <Text style={{color:'#9e9e9e',marginLeft:'2%' , fontSize:18,fontFamily:'MSRegular'}}>Maintain Social Distance</Text>

                        <View style={{flex:1,width:'90%',height:250,justifyContent:'center',alignItems:'center'}}>
                        <LottieView  style={styles.lottie} source={require('../assests/images/data 6feet.json')}  autoPlay loop /> 
                        </View>
                        
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center',padding:15,shadowColor:'#000',shadowOpacity:0.5,shadowRadius:16,elevation:10,borderRadius:20,width:width*3/4}}>
                        <Text style={{color:'#9e9e9e',marginLeft:'2%' , fontSize:18,fontFamily:'MSRegular'}}>Regular Hand-Wash</Text>

                        <View style={{flex:1,width:'90%',height:250,justifyContent:'center',alignItems:'center'}}>
                        <LottieView  style={styles.lottie} source={require('../assests/images/data final handwash.json')}  progress={this.state.speed2}/> 
                        </View>
                        
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center',padding:15,shadowColor:'#000',shadowOpacity:0.5,shadowRadius:16,elevation:10,borderRadius:20,width:'100%'}}>
                        <Text style={{color:'#9e9e9e',marginLeft:'2%' , fontSize:18,fontFamily:'MSRegular'}}>Avoid Crowd</Text>

                        <View style={{flex:1,width:'90%',height:250,justifyContent:'center',alignItems:'center'}}>
                        <LottieView  style={styles.lottie} source={require('../assests/images/data comunity transfer.json')}  progress={this.state.speed3}/> 
                        </View>
                        
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center',padding:15,shadowColor:'#000',shadowOpacity:0.5,shadowRadius:16,elevation:10,borderRadius:20,width:'100%'}}>
                        <Text style={{color:'#9e9e9e',marginLeft:'2%' , fontSize:18,fontFamily:'MSRegular'}}>Cover Nose</Text>

                        <View style={{flex:1,width:'90%',height:250,justifyContent:'center',alignItems:'center'}}>
                        <LottieView  style={styles.lottie} source={require('../assests/images/data Coughing.json')}  progress={this.state.speed4}/> 
                        </View>
                        
                    </View>

                    </ScrollView>

                    <View style={{flex:1,justifyContent:'center',alignItems:'center',borderRadius:20,padding:10,margin:10}}>
                        <Text style={{fontSize:25,color:'#B8876B',fontFamily:'Right'}}> Symptoms </Text>
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>

                        <View style={{flex:1 , flexDirection:'row' }}>
                            <View style={{justifyContent:'center',alignItems:'center',width:200,height:200}}>
                            <Image source={require('../assests/images/Cough.png')} style={{width:'100%',height:'100%'}} />
                            </View>
                            <View style={{width:width-200,justifyContent:'center',alignItems:'center'}}>
                                <Text style={{fontFamily:'MSRegular',color:'#4E4E4E'}}>Initially productive cough or dry cough which increase day by day and have more spectum. Cough gets worse after few days.</Text>
                            </View>
                        </View>
                        <View style={{flex:1 , flexDirection:'row' }}>
                        <View style={{width:width-200,justifyContent:'center',alignItems:'center',marginLeft:5}}>
                                <Text style={{fontFamily:'MSRegular',color:'#4E4E4E'}}>From day one the body tempertaure increases slightly. After 6 to 7 days high fever can be seen.</Text>
                            </View>
                            <View style={{justifyContent:'center',alignItems:'center',width:200,height:200}}>
                            <Image source={require('../assests/images/Fever.png')} style={{width:'100%',height:'100%'}} />
                            </View>
                            
                        </View>
                        <View style={{flex:1 , flexDirection:'row' }}>
                            <View style={{justifyContent:'center',alignItems:'center',width:200,height:200}}>
                            <Image source={require('../assests/images/Short-of-breath.png')} style={{width:'100%',height:'100%'}} />
                            </View>
                            <View style={{width:width-200,justifyContent:'center',alignItems:'center'}}>
                                <Text style={{fontFamily:'MSRegular',color:'#4E4E4E'}}>It’s the initial state of breathing/ respiratory problems. Difficulty in breathing or shortness of breath is the worse state.</Text>
                            </View>
                        </View>
                       

                    </View>

                    <View style={{flex:1,justifyContent:'center',alignItems:'center',borderRadius:20,padding:10,margin:10}}>
                        <Text style={{fontSize:25,color:'#B8876B',fontFamily:'Right'}}> Latest News </Text>
                    </View>
                   
                        <Accordion 
                    expanded={true}
                    animation={true}
                    dataArray={this.state.newsData}
                    renderHeader={this._renderHeader}
                    renderContent={this._renderContent}
                     />
                  
              </ScrollView>

             


                </View>
                <Fab
                active={this.state.active}
                direction="up"
                containerStyle={{ }}
                style={{ backgroundColor: '#4e4e4e' }}
                position='bottomLeft'
                onPress={() => this.setState({ active: !this.state.active })}>

                <Icon name="share" />
                <Button onPress={()=>{this.setState({active:!this.state.active});Linking.openURL('whatsapp://send?text='+this.state.shareMessage)}} style={{ backgroundColor: '#34A34F' }}>
                <Icon name="logo-whatsapp" />
                </Button>
                <Button onPress={()=>{this.setState({active:false});this.postOnFacebook();}} style={{ backgroundColor: '#3B5998' }}>
                <Icon name="logo-facebook" />
                </Button>
                <Button onPress={()=>this.writeToClipboard()} style={{ backgroundColor: '#DD5144' }}>
                <FontAwesome5 name='paperclip' size={20} />
                </Button>
          </Fab>

            </ImageBackground>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        marginBottom:'2%'
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
      },
      lottie: {
        width: 200,
        height: 200
      }

})


export default Dashboard;