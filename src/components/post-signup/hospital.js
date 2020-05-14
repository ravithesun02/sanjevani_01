import React  from 'react';
import { Text,View } from 'react-native';
import { Picker, Button } from 'native-base';


var Data = [];
var statelist= [];
class Hospital extends React.Component{

    static navigationOptions={
        drawerLabel:'Hospital'
    }
    
    state={
        isLoading:false,
        selectedstate: null,
        selectedCity:null,
        selectedService: null,
        CityList:[],
        Search:null
    }
    fetchStateData=async ()=>{
        this.setState({
            isLoading:true
        });
        let res=await fetch('https://api.covid19india.org/resources/resources.json');

        if(res.ok)
        {
            let data=await res.json();
            Data= data.resources
          // console.log(Data);
           Data.map((ele) => {
               if( !statelist.includes(ele.state)){
                   statelist.push(ele.state)
               }
           })
          // console.log(statelist);
        }

        this.setState({
            isLoading:false
        });
    }

    componentDidMount(){
       this.fetchStateData()
       // console.log("State Data Called");
    }
    componentDidUpdate(){
        if(this.state.selectedstate !== null){
            this.state.CityList=[]
            Data.map((prop) => {
                if(prop.state === this.state.selectedstate && !this.state.CityList.includes(prop.city)){
                   this.state.CityList.push(prop.city)
                }
            })
          }
          console.log(this.state.CityList);
    }

    onValueChangeState(value) {
        this.setState({
          selectedstate: value
        });
      }
    onValueChangeCity(value){
        this.setState({selectedCity:value});
    }


    render(){
        let stateView= statelist.map((props)=>{
            return(
            <Picker.Item label={props} value={props} />
            )
        })
        let cityView =this.state.CityList.map((cities)=>{
            return(
            <Picker.Item label={cities} value={cities} />
            )
        })
        return(
            <View>
                <View style={{width:'100%',height:'20%',alignItems:'center',paddingTop:'5%'}}>
                    <Text>WHAT RESOURCES ARE YOU LOOKING FOR ?</Text>
                </View>
                <Picker
              mode="dropdown"
              style={{ width: 120 }}
              selectedValue={this.state.selectedstate}
              onValueChange={this.onValueChangeState.bind(this)}>
                  <Picker.Item label="All STATE" value="null" />
                  {stateView}
            </Picker>
            <Picker
            mode="dropdown"
              style={{ width: 120 }}
              selectedValue={this.state.selectedCity}
              onValueChange={this.onValueChangeCity.bind(this)}>
                  <Picker.Item label="example" />
                  {cityView}
            </Picker>
            <View>
                <Button onPress={()=>this.setState({Search:true})}>
                    <Text>Search</Text>
                </Button>
            </View>
            </View>
        );
    }
}
export default Hospital