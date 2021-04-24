import React, { useState, useCallback } from 'react';
import { View, TextInput, StyleSheet, Text, Alert, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { Button, LinearProgress, Overlay } from 'react-native-elements';
import { config } from '../Static';
import { useFocusEffect } from '@react-navigation/native'

const axios = require('axios').default;

const EditScreen = ({ navigation, route }) => {
    const { calorieID } = route.params;
    const [loading, setLoading] = useState(true);
    const [calorie, setCalorie] = useState(null);
    const [number, setNumber] = useState('0');
    const [invalid, setInvalid] = useState(false);
    const [visible, setVisible] = useState(false);
    const [appError, setAppError] = useState(false);
    const [action, setAction] = useState('');

    const onChangeNumber = (input) => {
        if(+input > 50000){
            setCrazyAmount(true);
            setNumber(input);
            return;
        }
        else{
            setCrazyAmount(false);
        }

        if (input.length > 0 && !input.match(/^\d{1,6}(\.\d{1,2})?$/)) {
            setInvalid(true);
        }
        else {
            setInvalid(false);
            input = +input + '';
        }
        setNumber(input)
    };

    const updateData = async () => {
        setAction('Saving')
        setVisible(true);
        try {
            const resp = await axios.put(`https://myrestapionheroku.herokuapp.com/api/update-calorie/${calorieID}`, { amount: number });
            console.log(resp.data);
            navigation.navigate('Home');
        }
        catch (err) {

            Alert.alert(
                "Oops, something went wrong...",
                err.message
            );
        }
        setVisible(false);
    }

    const confirmDelete = () => {
        Alert.alert(
            "Delete Calorie",
            "Are you sure you want delete?",
            [
                {
                    text: "Confirm",
                    onPress: () => deleteData(),
                },
                { text: "Cancel" }
            ]
        );
    }

    const deleteData = async () => {
        setAction('Deleting')
        setVisible(true);
        try {
            const resp = await axios.delete(`https://myrestapionheroku.herokuapp.com/api/delete-calorie/${calorieID}`);
            console.log(resp.status);
            navigation.navigate('Home');
        }
        catch (err) {

            Alert.alert(
                "Oops, something went wrong...",
                err.message
            );
        }
        setVisible(false);
    };

    const getData = async () => {
        try {
            const resp = await axios.get(`https://myrestapionheroku.herokuapp.com/api/get-calorie/${calorieID}`);
            console.log(resp.data);
            setCalorie(resp.data);
            setNumber(resp.data.amount);
        }
        catch (err) {
            setAppError(true);
            Alert.alert(
                "Oops, something went wrong...",
                err.message
            );
        }
        setLoading(false);
    };

    const handleRefresh = async () => {
        setAppError(false);
        setLoading(true);
        getData();
    };

    useFocusEffect(
        useCallback(() => {
            getData();
        }, [])
    );

    if (loading) {
        return (
            <ActivityIndicator size="large" color={config.primary} animating={loading} />
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

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.updateText}>Last update: </Text>
                <Text style={styles.updateText}>{new Date(calorie.updatedAt).toString().split(' ').slice(0, 5).join(' ')}</Text>
            </View>
            <View style={styles.inputRow}>
                <TextInput
                    onChangeText={onChangeNumber}
                    value={number}
                    placeholderTextColor='black'
                    keyboardType="numeric"
                    style={styles.input}
                    textAlign='center'
                />
                <Text style={styles.unit}>kcal</Text>
            </View>
            {invalid && <View><Text style={{ color: 'red' }}>Invalid format</Text></View>}
            {crazyAmount && <View><Text style={{ color: 'red' }}>Are you kidding me? No human body can withstand that amount</Text></View>}
            <View style={styles.buttonRow}>

                <Button
                    title="SAVE"
                    raised={true}
                    onPress={updateData}
                    disabled={invalid || crazyAmount}
                    buttonStyle={{ height: 50, width: 100 }}
                />


                <Button
                    title="DELETE"
                    raised={true}
                    buttonStyle={{ height: 50, width: 100 }}
                    onPress={confirmDelete}
                />

            </View>
            <Overlay isVisible={visible} overlayStyle={styles.overlay}>
                <View style={{ alignSelf: 'center' }}><Text style={styles.savingText}>{action}...</Text></View>
                <LinearProgress color="primary" />
            </Overlay>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 20
    },
    updateText: {
        fontWeight: 'bold',
        color: config.primary,
        margin: 10
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    buttonRow: {
        marginTop: 20,
        flexDirection: 'row',
        width: '80%',
        justifyContent: 'space-evenly'
    },
    unit: {
        marginLeft: 5,
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0096db'

    },
    input: {
        backgroundColor: '#d1d1d1',
        borderRadius: 10.5,
        width: 150,
        height: 80,
        color: 'black',
        fontWeight: 'bold',
        fontSize: 28
    },
    savingText: {
        fontSize: 20,
        color: config.primary,
        fontWeight: 'bold'
    },
    overlay: {
        justifyContent: 'space-evenly',
        width: 160,
        height: 120,
        borderRadius: 8
    }, refreshLogo: {
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
    emptyContainer: {
        marginTop: 20,
        alignSelf: 'center'
    },
});

export default EditScreen;