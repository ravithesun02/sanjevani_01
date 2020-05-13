import React from 'react';
import { Text,View } from 'react-native';
import { Picker } from 'native-base';
import {Statelist} from '../assests/statelist';


var Data = [];
var statelist= [Statelist];
class Hospital extends React.Component{

    static navigationOptions={
        drawerLabel:'Hospital'
    }
    
    state={
        isLoading:false,
        selectedstate: null,
        selectedCity:null,
        selectedService: null,
    }
    fetchStateData=async ()=>{
        this.setState({
            isLoading:true
        });
        let res=await fetch('https://api.covid19india.org/resources/resources.json');

        if(res.ok)
        {
            let data=await res.json();

            //console.log(data);
            Data=data.data.statewise;
        }

        this.setState({
            isLoading:false
        });
    }
    onValueChange(value) {
        this.setState({
          selectedstate: value
        });
      }

    render(){
        let pickerItem = statelist.map((props)=>{
            return( <Picker.Item label={props} value={props} />);
        });
        return(
            <View>
                <View style={{width:'100%',height:'20%',alignItems:'center',paddingTop:'5%'}}>
                    <Text>WHAT RESOURCES ARE YOU LOOKING FOR ?</Text>
                </View>
                <Picker
              mode="dropdown"
              style={{ width: 120 }}
              selectedValue={this.state.selectedstate}
              onValueChange={this.onValueChange.bind(this)}
            >
                {pickerItem}
            </Picker>
            </View>
        );
    }
}
export default Hospital