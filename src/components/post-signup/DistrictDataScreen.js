import React ,{Component} from 'react';
import { Text,ImageBackground,View,StyleSheet} from 'react-native';
import Loader from '../assests/reuse/loadingScreen';
import {Button,Accordion,Icon} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

var districtdata=new Object();

class District extends Component
{

    constructor(props)
    {
        super(props);
        this.state={
            state_name:null,
            isLoading:false
        }
    }

    fetchData=async()=>{
        this.setState({isLoading:true});
                try
                {

                            
                            let res=await fetch('https://api.covid19india.org/v2/state_district_wise.json');
                            if(res.ok)
                            {
                                let data=await res.json();

                                for(let i=0;i<data.length;i++)
                                {
                                    if(data[i].state.toLowerCase()===this.state.state_name.toLowerCase())
                                    {
                                        districtdata=data[i];
                                        break;
                                    }
                                }

                              // console.log(districtdata);

                               let value=await fetch('https://api.covid19india.org/zones.json');

                               let zonestate=[];

                               if(value.ok)
                               {
                                   let val=await value.json();
                                   let zones=val.zones;
                                for(let i=0;i<zones.length;i++)
                                {
                                    if(zones[i].state.toLowerCase()===this.state.state_name.toLowerCase())
                                    {
                                            zonestate.push(zones[i]);
                                    }
                                }

                               for(let i=0;i<zonestate.length;i++)
                               {
                                   let temp=0;
                                   for(let j=0;j<districtdata.districtData.length;j++)
                                   {
                                       if(zonestate[i].district.toLowerCase()===districtdata.districtData[j].district.toLowerCase())
                                       {
                                           temp=1;
                                           districtdata.districtData[j].color=zonestate[i].zone.toLowerCase();
                                           break;
                                       }
                                    }
                                    if(temp==0)
                                    {
                                        let arr={};
                                        arr.active=0;
                                        arr.confirmed=0;
                                        arr.recovered=0;
                                        arr.deceased=0;
                                        arr.district=zonestate[i].district;
                                        arr.color=zonestate[i].zone.toLowerCase();

                                        districtdata.districtData.push(arr);
                                    } 
                               }

                              // console.log(districtdata);

                               }

                            }

                }
                catch(error)
                {
                    console.warn(error);
                }

                this.setState({isLoading:false});
            }

   async componentDidMount()
    {

      await this.setState({state_name:this.props.navigation.getParam('state')});

       // console.log(this.state.state_name);

        await this.fetchData();

    }

    _renderHeader=(item,expanded)=>{

        return(
        <View style={{
            flexDirection: "row",
            padding: 10,
            justifyContent: "space-between",
            alignItems: "center" ,
            margin:5,
            backgroundColor:`${item.color}`,
            borderRadius:20,
            elevation:5
             }}>
          <Text style={{fontFamily:'Right',fontSize:16 ,color:'#4e4e4e'}}>
              {" "}{item.district}
            </Text>
            {expanded
              ? <Icon style={{ fontSize: 18 }} name="remove-circle" />
              : <Icon style={{ fontSize: 18 }} name="add-circle" />}
          </View>
        );
      }

      _renderContent=(item)=>{
        return (
            <View style={{flex:1}} >
            <View style={styles.textData}>
               <Text style={{fontFamily:'Right',fontSize:16,color:'blue',marginLeft:'10%',letterSpacing:1}}>Confirmed Cases</Text>
               <Text style={{fontFamily:'MSRegular',marginRight:'10%',fontSize:16}}>{item.confirmed}</Text>
            </View>
            <View style={styles.textData}>
               <Text style={{fontFamily:'Right',fontSize:16,color:'orange',marginLeft:'10%',letterSpacing:1}}>Active Cases</Text>
               <Text style={{fontFamily:'MSRegular',marginRight:'8%',fontSize:16}}> {item.active} </Text>
            </View>
            <View style={styles.textData}>
               <Text style={{fontFamily:'Right',fontSize:16,color:'green',marginLeft:'10%',letterSpacing:1}}>Recovered Cases</Text>
               <Text style={{fontFamily:'MSRegular',marginRight:'10%',fontSize:16}}>{item.recovered}</Text>
            </View>
            <View style={styles.textData}>
               <Text style={{fontFamily:'Right',fontSize:16,color:'red',marginLeft:'10%',letterSpacing:1}}>Death Cases</Text>
               <Text style={{fontFamily:'MSRegular',marginRight:'10%',fontSize:16}}> {item.deceased} </Text>
            </View>
        </View>
        );
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
               
            <Button transparent style={{position:'absolute',top:8,left:12}} onPress={()=>this.props.navigation.goBack()}>
                       <Ionicons color='#ef8354' name="md-arrow-round-back" size={32}/>
                    </Button>
            <View style={{justifyContent:'center',alignItems:'center',marginTop:'2%'}}>
                    <Text style={{fontFamily:'Right',fontSize:18,color:'#4E4E4E'}}>COVID-19 Dashboard</Text>
                     <Text style={{fontFamily:'Right',fontSize:18,marginVertical:'4%'}}> {" "}{districtdata.state} :- District wise Data </Text>
            </View>

            
            <SafeAreaProvider>
            <SafeAreaView>
             <Accordion
             dataArray={districtdata.districtData}
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

export default District;

const styles=StyleSheet.create({
    textData:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:'3%'
    }
})