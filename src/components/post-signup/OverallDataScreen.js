import React ,{Component} from 'react';
import { Container, Content,Button, Accordion ,Icon} from 'native-base';
import { AsyncStorage, View, Text ,ImageBackground,Animated, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loader from '../assests/reuse/loadingScreen';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

var OverallState=[];
var lastRefreshed=null;
class Overall extends Component{

    static navigationOptions={
        drawerLabel:'Overall Data'
    }

    constructor(props)
    {
        super(props);
        this.state={
            isLoading:false,
            opacity:new Animated.Value(0)
        }

    
    }

    onLoad = () => {
        this.state.opacity.setValue(0)
       Animated.timing(this.state.opacity, {
         toValue: 1,
         duration: 1000,
         useNativeDriver: true,
       }).start();
     }


    fetchStateData=async ()=>{
        this.setState({
            isLoading:true
        });
        let res=await fetch('https://api.rootnet.in/covid19-in/unofficial/covid19india.org/statewise');

        if(res.ok)
        {
            let data=await res.json();

            //console.log(data);

            lastRefreshed=data.lastRefreshed;
            OverallState=data.data.statewise;

            // console.log(lastRefreshed);


        }

        this.setState({
            isLoading:false
        });
    }

    


    _renderHeader(item, expanded) {
        return (
          <View style={{
            flexDirection: "row",
            padding: 10,
            justifyContent: "space-between",
            alignItems: "center" ,
            margin:5
             }}>
          <Text style={{ fontWeight: "bold",fontFamily:'MSRegular',fontSize:16 ,color:'#4e4e4e'}}>
              {" "}{item.state}
            </Text>
            {expanded
              ? <Icon style={{ fontSize: 18 }} name="remove-circle" />
              : <Icon style={{ fontSize: 18 }} name="add-circle" />}
          </View>
        );
      }

      _renderContent=(item)=> {

        
        return (
            <View style={{flex:1}} >
            <View style={styles.textData}>
               <Text style={{fontFamily:'MSRegular',fontSize:16,fontWeight:'bold',color:'blue',marginLeft:'10%',letterSpacing:1}}>Confirmed Cases</Text>
               <Text style={{fontFamily:'MSRegular',marginRight:'10%',fontSize:16}}>{item.confirmed}</Text>
            </View>
            <View style={styles.textData}>
               <Text style={{fontFamily:'MSRegular',fontSize:16,fontWeight:'bold',color:'orange',marginLeft:'10%',letterSpacing:1}}>Active Cases</Text>
               <Text style={{fontFamily:'MSRegular',marginRight:'10%',fontSize:16}}> {item.active} </Text>
            </View>
            <View style={styles.textData}>
               <Text style={{fontFamily:'MSRegular',fontSize:16,fontWeight:'bold',color:'green',marginLeft:'10%',letterSpacing:1}}>Recovered Cases</Text>
               <Text style={{fontFamily:'MSRegular',marginRight:'10%',fontSize:16}}>{item.recovered}</Text>
            </View>
            <View style={styles.textData}>
               <Text style={{fontFamily:'MSRegular',fontSize:16,fontWeight:'bold',color:'red',marginLeft:'10%',letterSpacing:1}}>Death Cases</Text>
               <Text style={{fontFamily:'MSRegular',marginRight:'10%',fontSize:16}}> {item.deaths} </Text>
            </View>
            <View style={{justifyContent:'center',marginRight:'4%',alignItems:'flex-end'}}>
                <Button transparent onPress={()=>this.props.navigation.navigate('DistrictData',{state:item.state})} >
                    <Text style={{color:'blue',fontWeight:'bold',textDecorationLine:'underline'}}>District wise data >> </Text>

                </Button>
            </View>
        </View>
        );
      }


  


    async componentDidMount()
    {
        try
        {
            await this.fetchStateData();
        }
        catch(error)
        {
            console.log(error);
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
               
                <Button transparent style={{position:'absolute',top:4,left:10}} onPress={()=>this.props.navigation.toggleDrawer()}>
                           <Ionicons color='#ef8354' name="md-menu" size={32}/>
                        </Button>
                <View style={{justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontWeight:'bold',fontSize:18}}>COVID-19 Dashboard</Text>
                        <Text style={{fontSize:10,fontWeight:'bold'}}>As on : {new Date(lastRefreshed).toDateString()} {new Date(lastRefreshed).toTimeString()}  </Text>
                        <Text style={{fontWeight:'bold',fontSize:18,marginVertical:'4%'}}>State Wise Data</Text>
                </View>

                
                <SafeAreaProvider>
                <SafeAreaView>
                 <Accordion
                 dataArray={OverallState}
                 animation={true}
                 expanded={true}
                 renderHeader={this._renderHeader}
                 renderContent={this._renderContent}
                />

                </SafeAreaView>
                </SafeAreaProvider>




                    
               
           
            </ImageBackground>
        )
    }
}

export default Overall;

const styles=StyleSheet.create({
    textData:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:'3%'
    }
})