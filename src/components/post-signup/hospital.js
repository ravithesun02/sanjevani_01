import React ,{Component} from 'react';
import Loader from '../assests/reuse/loadingScreen';
import { Container, Content, Form, Picker, Accordion ,Icon, Button,Item, Label, Toast} from 'native-base';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {View,Text, Linking, ImageBackground,Image, StyleSheet,Switch, ActivityIndicator,Animated,Easing} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import Ionicons from 'react-native-vector-icons/Ionicons';


class Hospital extends React.PureComponent{

    constructor(props)
    {
        super(props);
        this.state={
            isLoading:false,
            resources:[],
            states:[],
            city:[],
            category:[],
            selectedState:'all_state',
            selectedCity:'all_city',
            selectedCategory:'all_category',
            renderData:[],
            isEnabled:false,
            isContentLoading:false,
            opacity:new Animated.Value(0)
        }
    }
    
    

  async  componentDidMount()
    {
        await this.fetchData();
    }
    fetchData=async()=>{
        this.setState({isLoading:true});

        try{
            let res=await fetch('https://api.covid19india.org/resources/resources.json');
            if(res.ok)
            {
                let data=await res.json();
              this.setState({
                    resources: data.resources,
                    renderData:data.resources
                });

                let StateList=new Array();
                let CategoryList=new Array();
                for(let i=0;i<this.state.resources.length;i++)
                {
                    if(!StateList.includes(this.state.resources[i].state))
                            StateList.push(this.state.resources[i].state);

                    if(!CategoryList.includes(this.state.resources[i].category))
                    CategoryList.push(this.state.resources[i].category);
                    
                }

                this.setState({
                    states:StateList,
                    category:CategoryList,
                    isLoading:false
                });

            }
        }
        catch(error)
        {
            console.log(error);
        }

        

    }

    setRenderData=()=>{
        let DataList=new Array();
        let state=this.state.selectedState;
        let city=this.state.selectedCity;
        let category=this.state.selectedCategory;

        if(state!=='all_state' && city!=='all_city' && category!=='all_category')
        {
            for(let i=0;i<this.state.resources.length;i++)
            {
                if(this.state.resources[i].state===state && this.state.resources[i].city===city && this.state.resources[i].category===category)
                    DataList.push(this.state.resources[i]);
            }

            
        }
        else if(state==='all_state' && category!=='all_category')
        {
            for(let i=0;i<this.state.resources.length;i++)
            {
                if( this.state.resources[i].category===category)
                    DataList.push(this.state.resources[i]);
            }

            
        }
        else if(state!=='all_state' && city!=='all_city' && category==='all_category')
        {
            for(let i=0;i<this.state.resources.length;i++)
            {
                if(this.state.resources[i].state===state && this.state.resources[i].city===city)
                    DataList.push(this.state.resources[i]);
            }

            
        }
        else if(state!=='all_state'&& city==='all_city' && category==='all_category')
        {
            console.log(this.state.selectedState);
            for(let i=0;i<this.state.resources.length;i++)
            {
                if(this.state.resources[i].state===state )
                    DataList.push(this.state.resources[i]);
            }

            
        }
        else if(state!=='all_state' && category!=='all_category')
        {
            for(let i=0;i<this.state.resources.length;i++)
            {
                if(this.state.resources[i].state===state  && this.state.resources[i].category===category)
                    DataList.push(this.state.resources[i]);
            }

            
        }
        else
        {
           DataList=this.state.resources;
        }

        this.setState({
            renderData:DataList
        })
    }

    setCategoryData=()=>{
        let city=this.state.selectedCity;
        let CategoryList=new Array();
        let DataList=new Array();

        if(this.state.selectedState==='all_state')
        {
            for(let i=0;i<this.state.resources.length;i++)
                {
                    if(!CategoryList.includes(this.state.resources[i].category))
                        CategoryList.push(this.state.resources[i].category);
                }

                DataList=this.state.resources;
        }
        else if(this.state.selectedState!=='all_state' && this.state.selectedCity==='all_city')
        {
            for(let i=0;i<this.state.resources.length;i++)
            {
                if(this.state.resources[i].state===this.state.selectedState && !CategoryList.includes(this.state.resources[i].category))
                    {
                        CategoryList.push(this.state.resources[i].category);
                        DataList.push(this.state.resources[i]);
                    }
                    else if(CategoryList.includes(this.state.resources[i].category))
                        DataList.push(this.state.resources[i]);
    
            }
        }

        else
        {
            for(let i=0;i<this.state.resources.length;i++)
            {
                if(this.state.resources[i].city===city && !CategoryList.includes(this.state.resources[i].category))
                   {
                        CategoryList.push(this.state.resources[i].category);
                        DataList.push(this.state.resources[i]);
                   }
                   else if(CategoryList.includes(this.state.resources[i].category)&&this.state.resources[i].city===city)
                   DataList.push(this.state.resources[i]);
    
            }
        }
       

        this.setState({
            category:CategoryList,
            renderData:DataList
        });
    }


    setCityData=(state)=>{
        let CityList=new Array();
       // console.log(state);

        for(let i=0;i<this.state.resources.length;i++)
        {
            if(this.state.resources[i].state===state && !CityList.includes(this.state.resources[i].city))
                CityList.push(this.state.resources[i].city);

        }

       // console.log(CityList);

        this.setState({
            city:CityList
        });
    }

    onStateChange=async(value)=>{
       // console.log(value);

     //  this.setState({isLoading:true});

      await  this.setState({
            selectedState:value,
            selectedCity:'all_city',
            selectedCategory:'all_category'
        });

        if(this.state.selectedState!=='all_state')
        {
            this.setCityData(this.state.selectedState);
        }

       // console.log(this.state.selectedState);
        
       this.setCategoryData();

      // this.setState({isLoading:false});

      // this.setRenderData();
       

    }

    onCityChange=async(value)=>{
        await this.setState({
            selectedCity:value
        });
        console.log(this.state.selectedCity);

        this.setCategoryData();

        //this.setRenderData();
    }

    onCategoryChange=async(value)=>{
        await this.setState({
            selectedCategory:value
        });
      //  console.log(this.state.selectedCategory);

       this.setRenderData();
    }

    showToast=()=>{
        Toast.show({
            text:'Long press on contact to copy',
            type:'success',
            textStyle:{color:'white',fontFamily:'MSRegular'}
        });
    }

    _renderHeader=(item,expanded)=>{
        if(expanded)
        {
            this.showToast();
        }
        return (
            <View style={{
              flexDirection: "row",
              padding: 10,
              justifyContent: "space-between",
              alignItems: "center" ,
              margin:5
               }}>
            <Text style={{ fontFamily:'Right',fontSize:16 ,color:'#4e4e4e',width:'90%'}}>
                {" "}{item.nameoftheorganisation}
              </Text>
              {expanded
                ? <Icon style={{ fontSize: 18 }} name="remove-circle"  />
                : <Icon style={{ fontSize: 18 }} name="add-circle"/>}
            </View>
          );
    }

    copyToClipboard=(data)=>{

        Clipboard.setString(data);
        Toast.show({
            text:'Copied to clipboard',
            type:'success',
            textStyle:{color:'#4e4e4e',fontFamily:'MSRegular'}
        });

    }

    _renderContent=(item)=>{

        return(
            <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#dcdcdc',borderRadius:20,elevation:10}} >
                <View style={{flex:1,flexDirection:'row',marginVertical:'3%'}}>
                    <View style={{width:'30%',justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontFamily:'Right',fontSize:15,color:'#4e4e4e'}}> Organisation</Text>
                    </View>
                    <View style={{width:'70%',justifyContent:'center',alignItems:'center'}}>
                        <Button transparent style={{width:'100%'}} onPress={()=>Linking.openURL(item.contact)}>
                        <Text style={{fontFamily:'MSRegular',fontSize:15,color:'blue',textDecorationLine:'underline'}}> {item.nameoftheorganisation} </Text>
                        </Button>
                        </View>
                </View>
                <View style={{flex:1,flexDirection:'row',marginVertical:'3%'}}>
                    <View style={{width:'30%',justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontFamily:'Right',fontSize:15,color:'#4e4e4e'}}>Category</Text>
                    </View>
                    <View style={{width:'70%',justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontFamily:'MSRegular',fontSize:15,color:'#4e4e4e'}}> {item.category} </Text>
                    </View>
                </View>
                <View style={{flex:1,flexDirection:'row',marginVertical:'3%'}}>
                    <View style={{width:'30%',justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontFamily:'Right',fontSize:15,color:'#4e4e4e'}}>Contact</Text>
                    </View>
                    <View style={{width:'70%',justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontFamily:'MSRegular',fontSize:15,color:'#4e4e4e'}} onLongPress={()=>{this.copyToClipboard(item.phonenumber)}}> {item.phonenumber} </Text>
                    </View>
                </View>
                <View style={{flex:1,flexDirection:'row',marginVertical:'3%'}}>
                    <View style={{width:'30%',justifyContent:'center',alignItems:'center'}}>
                         <Text style={{fontFamily:'Right',fontSize:15,color:'#4e4e4e'}}>City</Text>
                    </View>
                    <View style={{width:'70%',justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontFamily:'MSRegular',fontSize:15,color:'#4e4e4e'}}> {item.city} </Text>
                    </View>
                </View>
                <View style={{flex:1,flexDirection:'row',marginVertical:'3%'}}>
                    <View style={{width:'30%',justifyContent:'center',alignItems:'center'}}>
                         <Text style={{fontFamily:'Right',fontSize:15,color:'#4e4e4e'}}>State</Text>
                    </View>
                    <View style={{width:'70%',justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontFamily:'MSRegular',fontSize:15,color:'#4e4e4e'}}> {item.state} </Text>
                    </View>
                </View>
                <View style={{flex:1,flexDirection:'row',marginVertical:'3%'}}>
                    <View style={{width:'30%',justifyContent:'center',alignItems:'center'}}>
                        <Text  style={{fontFamily:'Right',fontSize:15,color:'#4e4e4e'}}>Description</Text>
                    </View>
                    <View style={{width:'70%',justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontFamily:'MSRegular',fontSize:15,color:'#4e4e4e'}}> {item.descriptionandorserviceprovided} </Text>
                    </View>
                </View>

            </View>
        )

    }

    toggler=async()=>{
     
       await this.setState({isEnabled:!this.state.isEnabled});

        if(!this.state.isEnabled)
             this.setState({
            selectedCategory:'all_category',
            selectedCity:'all_city',
            selectedState:'all_state'
        });

        this.onStateChange('all_state');

       

    }

    onLoad = () => {
        //console.log('anime');
        this.state.opacity.setValue(0);
       Animated.timing(this.state.opacity, {
         toValue: 1,
         duration: 1000,
         useNativeDriver: true,
       }).start();
     }

    render()
    {
        const animatedStyle = {
 
            opacity: this.state.opacity
       
          }

        const renderState=this.state.states.map((item,index)=>{
            return(
                <Picker.Item key={index+1} label={item} value={item}/>
            );
        });

        const renderCity=this.state.city.map((item,index)=>{
            return(
                <Picker.Item key={index+1} label={item} value={item}/>
            )
        });
        const renderCategory=this.state.category.map((item,index)=>{
            return <Picker.Item key={index+1} label={item} value={item}/>
        })

        if(this.state.isLoading)
        {
            return <Loader/>
        }
        else
        {
            return(
               
                  <ImageBackground source={require('../assests/images/back.png')} style={{width:'100%',height:'100%'}}>

                      <View style={{flex:1,justifyContent:'center',marginBottom:'3%'}}>

                      <View style={styles.titleImage}>
                      <Button transparent style={{position:'absolute',top:4,left:10}} onPress={()=>this.props.navigation.toggleDrawer()}>
                           <Ionicons color='#ef8354' name="md-menu" size={32}/>
                        </Button>
                      <Image style={{width:250,height:45}} source={require('../assests/images/title.png')}/>
                      </View>

                      <View style={{justifyContent:'center',alignItems:'center',marginTop:'2%'}}>
                        <Text style={{fontFamily:'Right',fontSize:18,color:'#4E4E4E'}}>COVID-19 Dashboard</Text>
                         <Text style={{fontFamily:'Right',fontSize:18,marginVertical:'4%'}}>Help Centers</Text>
                </View>
                 <View style={{justifyContent:'center',alignItems:'center',flexDirection:'row',marginBottom:'2%'}}>
                <Switch
                trackColor={{false:'#dcdcdc',true:'green'}}
                thumbColor={this.state.isEnabled ? 'green':'#dcdcdc'}
                value={this.state.isEnabled}
                onValueChange={this.toggler}
                />
                <Text style={{fontFamily:'Right',fontSize:15,color:'#4e4e4e'}}>See Specificied Data</Text>
                </View>   
                

                    {
                        this.state.isEnabled &&
                        <Animated.View style={{backgroundColor:'#dcdcdc',elevation:10,padding:'2%',borderRadius:20,...animatedStyle}} onLoad={this.onLoad()} >
                       <Form>
                           <View style={{flexDirection:'row',marginTop:'2%'}}>
                               <View style={{width:'50%',justifyContent:'center'}}>
                           <Label style={{textAlign:'center',fontFamily:'Right',color:'#4e4e4e'}}>Select State</Label>
                           <Picker
                           mode='dropdown'
                           placeholder='Select State '
                           note={false}
                           selectedValue={this.state.selectedState}
                           onValueChange={this.onStateChange.bind(this)}
                           >
                               <Picker.Item key={0} label='All State' value='all_state' />

                                {renderState}
                           </Picker>
                           </View>
                            <View style={{width:'50%',justifyContent:'center'}}>
                                <Label style={{textAlign:'center',fontFamily:'Right',color:'#4e4e4e'}}>Select City</Label>
                           <Picker
                           
                           mode='dropdown'
                           note={false}
                           selectedValue={this.state.selectedCity}
                           onValueChange={this.onCityChange.bind(this)}
                           >
                            <Picker.Item key={0} label='All Cities' value='all_city'/>
                            {renderCity}

                           </Picker>
                           </View>
                           </View>
                           <Label style={{textAlign:'center',fontFamily:'Right',color:'#4e4e4e'}}>Select Category</Label>
                           <Picker
                           mode='dropdown'
                           note={false}
                           selectedValue={this.state.selectedCategory}
                           onValueChange={this.onCategoryChange.bind(this)}
                           >
                               <Picker.Item key={0} label='All Categories' value='all_category'/>

                                {renderCategory}

                           </Picker>
                       </Form>
                       </Animated.View>

                    }

                      {
                          this.state.isContentLoading ?
                          <ActivityIndicator size='large' color='#4e4e4e' />
                          :
                      
                      <SafeAreaProvider>
                            <SafeAreaView>

                           
                       <Accordion
                       dataArray={this.state.renderData}
                       animation={true}
                       expanded={true}
                       renderHeader={this._renderHeader}
                       renderContent={this._renderContent}

                       />
                        </SafeAreaView>
                        </SafeAreaProvider>}
                        </View>
                        </ImageBackground>
            )
        }
    }
}

export default Hospital;

const styles=StyleSheet.create({
    titleImage:{
        justifyContent:'center',
        alignItems:'center',
        marginTop:10,
        elevation:5,
        paddingBottom:5
       
    }
})