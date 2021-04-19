import * as React from 'react';
import {
    View,
    StyleSheet,
    Text,
    Button,
} from 'react-native';

import { notification } from '../src/Notification';

const HomeScreen = ({ navigation }) => {
    const handlePress = () => {
        notification.configure();
        notification.createChannel('1');
        notification.notify('1','Notification title','Notification message...');
    };

    return (
        <View style={styles.container}>
            <Button title="Notify" onPress={handlePress}></Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HomeScreen;