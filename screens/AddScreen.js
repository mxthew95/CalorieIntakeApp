import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Alert } from 'react-native';
import { Button, LinearProgress, Overlay } from 'react-native-elements';
import { config } from '../Static';

const axios = require('axios').default;

const AddScreen = ({ navigation }) => {
    const [number, setNumber] = useState('0');
    const [invalid, setInvalid] = useState(false);
    const [visible, setVisible] = useState(false);
    const [crazyAmount, setCrazyAmount] = useState(false);

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

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    const postData = async () => {
        setVisible(true);
        try {
            const resp = await axios.post('https://myrestapionheroku.herokuapp.com/api/add-calorie', { amount: number });
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

    return (
        <View style={styles.container}>
            <View style={styles.inputRow}>
                <TextInput
                    onChangeText={onChangeNumber}
                    value={number}
                    placeholderTextColor='black'
                    keyboardType="numeric"
                    autoFocus={true}
                    style={styles.input}
                    textAlign='center'
                />
                <Text style={styles.unit}>kcal</Text>
            </View>
            {invalid && <View><Text style={{ color: 'red' }}>Invalid format</Text></View>}
            {crazyAmount && <View><Text style={{ color: 'red' }}>Are you kidding me? No human body can withstand that amount</Text></View>}
            <View style={styles.saveBtn}>
                <Button
                    title="SAVE"
                    raised={true}
                    onPress={postData}
                    disabled={invalid || crazyAmount}
                />
            </View>
            <Overlay isVisible={visible} overlayStyle={styles.overlay}>
                <View style={{ alignSelf: 'center' }}><Text style={styles.savingText}>Saving...</Text></View>
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
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center'
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
    saveBtn: {
        margin: 20,
        width: 200
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
    }
});

export default AddScreen;