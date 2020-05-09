import React from 'react';
import {Text, View,Dimensions,StyleSheet} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';

const {height,width}=Dimensions.get('window');
class PDF extends React.Component{
    render(){
        return(
            <ScrollView style={styles.PDF}>
                <Text>TERMS OF SERVICE </Text> 
                        <Text>These terms of service (Terms) govern your use of the Sanjevani
                        application for mobile and handheld devices (App) and the services
                        provided thereunder. Please read these terms and conditions
                        (Terms) carefully before you download, install or use the App. By
                        clicking on the “I Agree” button, you signify your acceptance of the
                        Terms, and your agreement to be bound by them. The Terms may be
                        amended from time to time with notice to you. In order to continue
                        using the App, you will be required to accept the revised Terms.
                        Failure to comply with the Terms can result in suspension of your
                        ability to use the App.</Text>
                        <Text>1. SERVICE OVERVIEW</Text>
                       <Text> The App is part of a service designed to enable registered users who
                        come in contact with other registered users who have tested positive
                        or are suspect for the severe acute respiratory syndrome
                        Coronavirus (COVID-19) to be notified, traced and suitably
                        supported (Services). When the App is installed on your mobile or
                        handheld device, it detects when your device comes within GPS
                        range of any other registered user's device and initiates a protocol by
                        which all necessary personal information (including location
                        information) about registered person is collected, and securely
                        stored in the App on your device. In the event you test positive for
                        COVID-19, the Government of India will contact all registered users
                        that you have come in contact with you over the past 30 days to
                        administer the appropriate medical intervention. Similarly, you will
                        be notified if any of the persons you came in contact with over the
                        past 30 days has tested positive for COVID-19.</Text>
                        <Text>2. REQUIREMENTS FOR USE</Text>
                      <Text>  You agree to turn on and allow the App access to the GPS services on
                        your mobile or handheld device. You acknowledge that if your device
                        is switched off or is in airplane mode, if GPS services on your device
                        are turned off or if you revoke the App's access to GPS services on
                        your device, it will not be able to gather all necessary information
                        which will impair the completeness and accuracy of the Services. You
                        agree to keep the mobile or handheld device on which the App is
                        installed in your possession at all times and not to share it with or
                        allow anyone else to use it. You acknowledge that if you do so it
                        could result in you being falsely identified as being COVID-19 positive
                        or not being identified when you are.</Text>
                        <Text> 3. USE</Text>
                      <Text>  You agree that you will only use the App in good faith and will not
                        provide false or misleading information about yourself or your
                        infection status. You agree that you will not do anything to throttle,
                        engineer a denial of service, or in any other manner impair the
                        performance or functionality of the App. You agree that you will not
                        tamper with, reverse-engineer or otherwise use the App for any
                        purpose for which it was not intended including, but not limited to,
                        accessing information about registered users stored in the App,
                        identifying or attempting to identify other registered users or gaining
                        or attempting to gain access to the cloud database of the Service.
                        You can also get latest updates on this pandemic on the dashboard.
                        We are working on many more updates that will help us to fight
                        against this pandemic.</Text>
                        <Text>4. PRIVACY</Text>
                      <Text>  You hereby consent to the collection and use of your personal
                        information for the provision of the Services. The details of the
                        personal information collected and the manner in which it is
                        collected and by whom as well as the purposes for which it will be
                        used is more fully set out in our privacy policy which is available
                        here. You are free to choose not to provide this information at any
                        time by revoking the App's access to GPS services or by deleting the
                        App from mobile or handheld device. However, should you do so,
                        you acknowledge that you will no longer be able to avail of the
                        Services.</Text>
                       <Text>5. DISRUPTION</Text> 
                      <Text>  You agree that you have no expectation of, or right to permanent
                        and uninterrupted access to the Services. While the Services are
                        intended to be accessible to you from everywhere on a 24x7 basis,
                        from time to time and without prior notice of downtime, access to
                        the App or the Services or to any part thereof may be suspended on
                        either a temporary or permanent basis and either with respect to all
                        or a certain class of users.</Text>
                        <Text>6. LIMITATION OF LIABILITY</Text>
                      <Text>  You agree and acknowledge that the admin will not be liable for any
                        claims in relation to the use of the App, including but not limited to
                        (a) your inability to access or use the App or the Services; (b) the
                        failure of the App or the Services to accurately identify persons in
                        your proximity who have tested positive to COVID-19; (c) the
                        accuracy of the information provided by the App or the Services as to
                        whether the persons you have come in contact with in fact been
                        infected by COVID-19; (d) any unauthorised access to your
                        information or modification thereof.</Text>
                        <Text>7. DISCLAIMER</Text>
                      <Text>  The App is being made available on an "as is" basis and the admin
                        makes no warranties of any kind, whether express, implied, statutory
                        or otherwise, with respect to the functioning of the App or its ability
                        to accurately identify those who have tested positive to COVID-19.
                        All services such as those provided by this App are never wholly free
                        from defects, errors and bugs, and the Government of India provides
                        no warranty or representation to that effect or that the App will be
                        compatible with any application, or software not specifically
                        identified as compatible. Admin specifically disclaims any implied
                        warranties of fitness for a particular purpose or non-infringement.
                        The functioning of the App is dependent on the compliance by all
                        registered users of the App with these Terms. Accordingly,
                        unauthorised access to your information or modification thereof.</Text>
                        <Text>8. GOVERNING LAW </Text>
                       <Text> These Terms shall be governed by the laws of India. The Doctors
                        nearby your location will upload the location information of suspect
                        or positive cases of Covid-19. The police will get updates of covid-19
                        tested positive person’s location and accurate measures will be
                        taken by them.
                </Text>
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    PDF: {
        width:width,
        height:height
    }
});
export default PDF;