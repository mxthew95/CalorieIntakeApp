import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
    Text,
    FlatList,
    Alert,
    TouchableOpacity,
    Image,
    Dimensions
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native'

import { notification } from '../src/Notification';

import { config } from '../Static';

import CalorieCard from '../components/CalorieCard';

import { VictoryChart, VictoryGroup, VictoryBar, VictoryAxis, VictoryTheme, VictoryLegend } from 'victory-native';

const axios = require('axios').default;

const HomeScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [calories, setCalories] = useState([]);
    const [appError, setAppError] = useState(false);
    const [refreshing, setRefeshing] = useState(false);
    const [chartData, setChartData] = useState([]);

    const getApiData = async () => {
        try {
            const resp = await axios.get('https://myrestapionheroku.herokuapp.com/api/get-calories');
            console.log(resp.data);
            if (resp.data.length > 0) {
                setCalories(resp.data);
                let data = resp.data.slice(resp.data.length - 10).map((el, i) => {
                    return {
                        x: i + 1,
                        y: +el.amount,
                    };
                });
                console.log(data)
                setChartData(data);
            }
        }
        catch (err) {
            setAppError(true);
            Alert.alert(
                "Oops, something went wrong...",
                err.message
            );
        }
        setRefeshing(false);
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            getApiData();
        }, [])
    );

    const handlePullRefresh = async () => {
        setRefeshing(true);
        getApiData();
    };

    const handleRefresh = async () => {
        setAppError(false);
        setLoading(true);
        getApiData();
    };

    // useEffect(() => {
    //     notification.getScheduledNotifications((notifications) => {
    //         notification.removeAllDeliveredNotifications();
    //         if (notifications.length < 1) {
    //             notification.deleteChannel('1');
    //             notification.createChannel('1');
    //             //current time in mil
    //             const currentTime = Date.now();
    //             const d = new Date().getDate();
    //             const m = new Date().getMonth() + 1;
    //             const y = new Date().getFullYear();
    //             let scheduledTime = Date.parse(`${m}/${d}/${y} 23:39:00`);

    //             if(currentTime > scheduledTime){
    //                 scheduledTime += (24*60*60*1000);
    //             }

    //             console.log((new Date(scheduledTime)).toString());

    //             notification.scheduledNotify('1', 'Notification title', 'Notification message...', scheduledTime);
    //         }
    //         else {
    //             console.log(`notification has been scheduled at ${notifications[0].date}`);
    //         }
    //     });
    // }, []);

    const renderItem = ({ item }) => {
        const dateObj = (new Date(item.createdAt)).toString().split(' ');
        const day = dateObj[0];
        const date = day + ', ' + dateObj.slice(1, 4).join(' ');

        return (
            <CalorieCard id={item._id} amount={item.amount} date={date} navigate={navigation.navigate} />
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
                        onRefresh={handlePullRefresh}
                        horizontal={true}
                    />
                </View>
                <View style={styles.addContainer}>
                    <TouchableOpacity style={styles.addTouchable} onPress={() => { navigation.navigate('Add') }}>
                        <Image
                            style={styles.refreshLogo}
                            source={require('../logo/addIcon.png')}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, height: 1, marginLeft: 12, backgroundColor: config.secondary }} />
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ color: config.primary }}>Your Calorie Intake</Text>
                        <Text style={{ color: config.primary }}>(Last 10)</Text>
                    </View>
                    <View style={{ flex: 1, height: 1, marginRight: 12, backgroundColor: config.secondary }} />
                </View>
                {chartData.length > 0 && (<View style={{ alignSelf: 'center' }}>
                    <VictoryChart domainPadding={5}>
                        <VictoryAxis
                            domain={[1, chartData.length]}
                            tickCount={chartData.length}
                            tickFormat={(tick) => tick}
                            fixLabelOverlap={true}
                        />
                        <VictoryLegend x={Dimensions.get('screen').width / 2 - 50} data={[{ name: "kcal", symbol: { fill: "#4f9deb" } }]} />
                        <VictoryBar
                            data={chartData}
                            animate={{
                                onEnter: {
                                    duration: 500,
                                    before: () => ({
                                        _y: 0,
                                    })
                                }
                            }}
                            style={{ data: { fill: '#4f9deb' } }}
                        />
                    </VictoryChart>
                </View>)}
            </SafeAreaView>

        );
    }

    if (appError) {
        return (
            <View style={styles.emptyContainer}>
                <TouchableOpacity style={styles.refreshTouchable} onPress={handleRefresh}>
                    <Image
                        style={styles.refreshLogo}
                        source={require('../logo/refreshIcon.png')}
                    />
                </TouchableOpacity>
            </View>
        );
    }

    if (!appError) {
        return (
            <>
                <View style={styles.emptyContainer}>
                    <Text style={styles.empty}>No calories added...</Text>
                </View>
                <View style={styles.addContainer}>
                    <TouchableOpacity style={styles.addTouchable} onPress={() => { navigation.navigate('Add') }}>
                        <Image
                            style={styles.refreshLogo}
                            source={require('../logo/addIcon.png')}
                        />
                    </TouchableOpacity>
                </View>
            </>
        )
    }

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        marginTop: 10
    },
    emptyContainer: {
        marginTop: 20,
        alignSelf: 'center'
    },
    empty: {
        marginTop: 10,
        fontSize: 20,
        color: config.primary
    },
    refreshLogo: {
        width: 34,
        height: 34
    },
    refreshTouchable: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 48,
        height: 48,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#b5b5b5'
    },
    addTouchable: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
    },
    addContainer: {
        marginTop: 5,
        alignItems: 'center'
    },
});

export default HomeScreen;