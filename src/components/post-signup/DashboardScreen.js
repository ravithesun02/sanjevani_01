import React ,{Component} from 'react';
import { View, Text, ImageBackground, StyleSheet,Image,Dimensions,Animated,Clipboard,Easing,AppState ,AsyncStorage,ActivityIndicator, Linking} from 'react-native';
import {Button, Container, Fab,Icon} from 'native-base';
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
            isLoading:false,
            webViewLoading:true,
            currentTab:0,
            opacity:new Animated.Value(0),
            appState:AppState.currentState,
            active:false,
            shareMessage:'This is from sanjevani',
            FacebookShareURL:'https://sanjevani.com/'

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

      writeToClipboard = async () => {
        //To copy the text to clipboard
        this.setState({
            active:false
        });
        await Clipboard.setString(this.state.shareMessage);
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
       //console.log(Data);
       this.setState({isLoading:false});
      // this.animation.play();
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
                        <Text style={{fontFamily:'MSRegular',fontSize:16,fontWeight:'bold',color:'blue',marginLeft:'10%',letterSpacing:1}}>Confirmed Cases</Text>
                        <Text style={{fontFamily:'MSRegular',marginRight:'10%',fontSize:16}}>{Data.cn_confirmedcases}</Text>
                     </View>
                     <View style={styles.textData}>
                        <Text style={{fontFamily:'MSRegular',fontSize:16,fontWeight:'bold',color:'orange',marginLeft:'10%',letterSpacing:1}}>Active Cases</Text>
                        <Text style={{fontFamily:'MSRegular',marginRight:'10%',fontSize:16}}> {Data.cn_active} </Text>
                     </View>
                     <View style={styles.textData}>
                        <Text style={{fontFamily:'MSRegular',fontSize:16,fontWeight:'bold',color:'green',marginLeft:'10%',letterSpacing:1}}>Recovered Cases</Text>
                        <Text style={{fontFamily:'MSRegular',marginRight:'10%',fontSize:16}}>{Data.cn_recovered}</Text>
                     </View>
                     <View style={styles.textData}>
                        <Text style={{fontFamily:'MSRegular',fontSize:16,fontWeight:'bold',color:'red',marginLeft:'10%',letterSpacing:1}}>Death Cases</Text>
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
                   <Text style={{fontFamily:'MSRegular',fontSize:16,fontWeight:'bold',color:'blue',marginLeft:'10%',letterSpacing:1}}>Confirmed Cases</Text>
                   <Text style={{fontFamily:'MSRegular',marginRight:'10%',fontSize:16,}}> {Data.sn_confirmed} </Text>
                </View>
                <View style={styles.textData}>
                   <Text style={{fontFamily:'MSRegular',fontSize:16,fontWeight:'bold',color:'orange',marginLeft:'10%',letterSpacing:1}}>Active Cases</Text>
                   <Text style={{fontFamily:'MSRegular',marginRight:'10%',fontSize:16}}> {Data.sn_active} </Text>
                </View>
                <View style={styles.textData}>
                   <Text style={{fontFamily:'MSRegular',fontSize:16,fontWeight:'bold',color:'green',marginLeft:'10%',letterSpacing:1}}>Recovered Cases</Text>
                   <Text style={{fontFamily:'MSRegular',marginRight:'10%',fontSize:16}}> {Data.sn_recovered} </Text>
                </View>
                <View style={styles.textData}>
                   <Text style={{fontFamily:'MSRegular',fontSize:16,fontWeight:'bold',color:'red',marginLeft:'10%',letterSpacing:1}}>Death Cases</Text>
                   <Text style={{fontFamily:'MSRegular',marginRight:'10%',fontSize:16}}> {Data.sn_deaths} </Text>
                </View>
                </Animated.View>
             )
         }
     }
     navigationStateChangedHandler = ({url}) => {
        if (url.startsWith('https://') && url !== 'https://corona-go.info') {
      this.WebView.stopLoading();
    }
      };
    render()
    {

        const INJECTED_JS=`(function(){

            document.querySelectorAll('.col-lg-12').forEach((item)=>{
                item.remove();
            });
            document.querySelector('.navbar').remove();
            document.querySelector('.col-md-8').remove();
            document.body.style.background = 'transparent';
            document.querySelectorAll('a').forEach((item)=>{item.removeAttribute('href')});


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
                        <Button transparent style={{position:'absolute',top:4,left:10}} onPress={()=>this.props.navigation.toggleDrawer()}>
                           <Ionicons color='#ef8354' name="md-menu" size={32}/>
                        </Button>
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
                            <Text style={{fontFamily:'MSRegular',color:this.state.currentTab===0 ? 'black':'grey',fontWeight:this.state.currentTab===0 ? 'bold':'normal',letterSpacing:1}}>
                                INDIA
                            </Text>
                        </Button>
                        <Button transparent onPress={()=>this.setState({currentTab:1})} style={{borderBottomColor:'black',borderBottomWidth:this.state.currentTab===1 ? 2:0,width:'50%',justifyContent:'center'}}>
                            <Text style={{fontFamily:'MSRegular',color:this.state.currentTab===1 ? 'black':'grey',fontWeight:this.state.currentTab===1 ? 'bold':'normal',letterSpacing:1}}>
                                {this.state.userState.toUpperCase()}
                            </Text>
                        </Button>
                    </View>

                  {this.renderData()}

                </View>
                  
                    
                    <View style={styles.insideContainer}>
                        <View style={{flex:1,width:'90%',height:250,justifyContent:'center',alignSelf:'center',alignItems:'center'}}>
                        <Image style={{width:'100%',height:'100%'}}  source={require('../assests/images/Stay-Safe.png')}/> 
                        </View>
                        

                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center',borderRadius:20,elevation:5,padding:10,margin:10}}>
                        <Text style={{fontSize:20,fontWeight:'bold',color:'#B8876B'}}> THINGS TO DO</Text>

                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'#9e9e9e',marginLeft:'2%' , fontSize:18,fontFamily:'MSRegular'}}>Maintain Social Distance</Text>

                        <View style={{flex:1,width:'90%',height:250,justifyContent:'center',alignItems:'center'}}>
                        <LottieView  style={styles.lottie} source={require('../assests/images/data 6feet.json')} autoPlay loop/> 
                        </View>
                        
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'#9e9e9e',marginLeft:'2%' , fontSize:18,fontFamily:'MSRegular'}}>Regular Hand-Wash</Text>

                        <View style={{flex:1,width:'90%',height:250,justifyContent:'center',alignItems:'center'}}>
                        <LottieView  style={styles.lottie} source={require('../assests/images/data final handwash.json')} autoPlay loop/> 
                        </View>
                        
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'#9e9e9e',marginLeft:'2%' , fontSize:18,fontFamily:'MSRegular'}}>Avoid Crowd</Text>

                        <View style={{flex:1,width:'90%',height:250,justifyContent:'center',alignItems:'center'}}>
                        <LottieView  style={styles.lottie} source={require('../assests/images/data comunity transfer.json')} autoPlay loop/> 
                        </View>
                        
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'#9e9e9e',marginLeft:'2%' , fontSize:18,fontFamily:'MSRegular'}}>Cover Nose</Text>

                        <View style={{flex:1,width:'90%',height:250,justifyContent:'center',alignItems:'center'}}>
                        <LottieView  style={styles.lottie} source={require('../assests/images/data Coughing.json')} autoPlay loop/> 
                        </View>
                        
                    </View>


                   

                    </ScrollView>


                </View>
                <Fab
                active={this.state.active}
                direction="up"
                containerStyle={{ }}
                style={{ backgroundColor: '#4e4e4e' }}
                position="bottomRight"
                onPress={() => this.setState({ active: !this.state.active })}>

                <Icon name="share" />
                <Button onPress={()=>{this.setState({active:!this.state.active});Linking.openURL('whatsapp://send?text='+this.state.shareMessage)}} style={{ backgroundColor: '#34A34F' }}>
                <Icon name="logo-whatsapp" />
                </Button>
                <Button onPress={()=>{this.setState({active:false});this.postOnFacebook();}} style={{ backgroundColor: '#3B5998' }}>
                <Icon name="logo-facebook" />
                </Button>
                <Button opPress={()=>this.writeToClipboard()} style={{ backgroundColor: '#DD5144' }}>
                <FontAwesome5 name='paperclip' size={20} />
                </Button>
          </Fab>

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
      },
      lottie: {
        width: 200,
        height: 200
      }

})


export default Dashboard;