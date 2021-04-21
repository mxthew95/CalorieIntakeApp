import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
    Text,
    FlatList,
    Button
} from 'react-native';

import { notification } from '../src/Notification';

import { config } from '../Static';

import CalorieCard from '../components/CalorieCard';

const axios = require('axios').default;

const HomeScreen = ({ navigation }) => {
    const [calories, setCalories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefeshing] = useState(false);

    const getApiData = async () => {
        const resp = await axios.get('https://myrestapionheroku.herokuapp.com/api/get-calories');
        if (resp.status == 200) {
            console.log(resp.data);
            setLoading(false);
            setRefeshing(false);
            setCalories(resp.data);
        }
        else {
            setLoading(false);
            alert(resp);
        }
    };

    const handleRefresh = async () => {
        setRefeshing(true);
        getApiData();
    };

    useEffect(() => {
        notification.getScheduledNotifications((notifications) => {
            notification.removeAllDeliveredNotifications();
            if (notifications.length < 1) {
                // notification.deleteChannel('1');
                // notification.createChannel('1');
                // //current time in mil
                // const currentTime = Date.now();
                // const d = new Date().getDate();
                // const m = new Date().getMonth() + 1;
                // const y = new Date().getFullYear();
                // let scheduledTime = Date.parse(`${m}/${d}/${y} 23:39:00`);

                // if(currentTime > scheduledTime){
                //     scheduledTime += (24*60*60*1000);
                // }

                // console.log((new Date(scheduledTime)).toString());

                // notification.scheduledNotify('1', 'Notification title', 'Notification message...', scheduledTime);
            }
            else {
                console.log(`notification has been scheduled at ${notifications[0].date}`);
            }
        });

        getApiData();
    }, [navigation]);

    // const handlePress = () => {
    //     notification.cancelAllLocalNotifications();
    // };

    const renderItem = ({ item }) => {
        const dateObj = (new Date(item.createdAt)).toString().split(' ');
        const day = dateObj[0];
        const date = day+', '+dateObj.slice(1, 4).join(' ');

        return (
            <CalorieCard id={item._id} amount={item.amount} date={date} navigate={navigation.navigate}/>
        );
    }

    if (loading) {
        return (
            <ActivityIndicator size="large" color={config.primary} animating={loading} />
        );
    }

    if (calories.length > 0) {
        return (

            <SafeAreaView style={styles.container}>
                <View>
                    <FlatList
                        data={calories}
                        renderItem={renderItem}
                        keyExtractor={item => item._id}
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        horizontal={true}
                    />
                </View>
            </SafeAreaView>

        );
    }

    return (
        <View style={styles.container}><Text style={styles.empty}>Much empty...</Text></View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        marginTop: 10
    },
    empty: {
        marginTop: 10,
        fontSize: 20,
        color: config.primary
    }
});

export default HomeScreen;