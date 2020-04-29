import React ,{Component} from 'react';
import * as Location from 'expo-location';
import {Modal,View,Text,StyleSheet} from 'react-native';
import {Button} from 'native-base';
import {openSettings} from 'react-native-send-intent';

class LocationModule extends Component{

    componentDidMount()
    {
        this.getLocationAccess();
    }

    constructor(props)
    {
        super(props);
        this.state={
            isModal:false,
            openSetting:false
        }
    }

    getLocationAccess=async()=>{

        let {status}=await Location.getPermissionsAsync();

        if(status !=='granted')
        {
            await Location.requestPermissionsAsync();
        }
        else if(!await Location.hasServicesEnabledAsync())
        {
            this.setState({
                isModal:true
            });
        }

    }

    opensettings=()=>{

        openSettings("android.settings.LOCATION_SOURCE_SETTINGS");
        this.setState({
            openSetting:false
        })

    }

    render() {
        return (
            <Modal 
            onDismiss={()=>{this.state.openSetting?this.opensettings:undefined}}
            visible={this.state.isModal}
            transparent={true}
            animationType='fade'
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={{color:'red',fontWeight:'bold',marginVertical:5}}>It seems like you have disabled location services ! </Text>
                        <Button style={{borderRadius:10,justifyContent:'center',alignItems:'center',padding:8,backgroundColor:'#FF8A65'}} onPress={()=>{this.setState({isModal:false,openSetting:true})}}>
                            <Text style={{fontWeight:'bold',color:'white'}}>Enable Location Services</Text>
                        </Button>

                    </View>
                </View>

            </Modal>
            
        );
    }

}

const styles=StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      }
});

export default LocationModule;