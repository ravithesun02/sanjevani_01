import React, { Component } from 'react'
import Loader from '../assests/reuse/loadingScreen';
import { Container, Content,Button, Accordion ,Icon, List, ListItem, Left, Right} from 'native-base';
import { AsyncStorage, View, Text ,ImageBackground,Animated, StyleSheet, Linking, StatusBar} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


var notify={};
var lastRefreshed=null;
 
class GovtNotify extends Component{

    static navigationOptions={
        drawerLabel:'Govt. Notification'
    }

    constructor(props)
    {
        super(props);
        this.state={
            isLoading:false
        }
    }

    fetchNotifyData=async ()=>{
        this.setState({isLoading:true});

        try
        {
            let res=await fetch('https://api.rootnet.in/covid19-in/notifications');
            if(res.ok)
            {
                let data=await res.json();

                lastRefreshed=data.lastRefreshed;
    
                notify=data.data.notifications;

               // console.log(lastRefreshed);
    
                this.setState({isLoading:false});
            }
            else
            {
                console.warn('Internet error');
            }
        }
        catch(error)
        {
            console.warn(error);
        }
        

      
    }

    rednerList=(item)=>{
        return(
            <ListItem>
                <Left>
                  <Text style={{fontFamily:'MSRegular'}}> {item.title} </Text>
                </Left>
                <Right>
                    <Button onPress={()=>Linking.openURL(item.link)} rounded style={{padding:10,backgroundColor:'orange',elevation:5}}>
                        <Text style={{margin:2,fontWeight:'bold',color:'#4e4e4e'}}>View</Text>
                    </Button>
                </Right>
            </ListItem>
        )
    
}

    async componentDidMount()
    {
        await this.fetchNotifyData();
    }


    render()
    {
       
        if(this.state.isLoading)
        {
            return <Loader/>
        }
        else
        {

          

            return (
                <ImageBackground source={require('../assests/images/back.png')} style={{width:'100%',height:'100%'}}>
                    <StatusBar barStyle='dark-content' backgroundColor='#f9f5d9' />
                <Button transparent style={{position:'absolute',top:4,left:10}} onPress={()=>this.props.navigation.toggleDrawer()}>
                           <Ionicons color='#ef8354' name="md-menu" size={32}/>
                        </Button>
                <View style={{justifyContent:'center',alignItems:'center',marginTop:'2%'}}>
                        <Text style={{fontFamily:'Right',fontSize:18,color:'#4E4E4E'}}>COVID-19 Dashboard</Text>
                        <Text style={{fontSize:10,fontWeight:'bold'}}>As on : {new Date(lastRefreshed).toDateString()} {new Date(lastRefreshed).toTimeString()}  </Text>
                        <Text style={{fontFamily:'Right',fontSize:18,marginVertical:'4%'}}>Latest Govt. notifications</Text>
                </View>

                <Accordion
                dataArray={notify}
                expandedIcon={false}
                renderHeader={this.rednerList}
                
                />
            




                    
               
           
            </ImageBackground>
            )
        }
    }

}

export default GovtNotify;