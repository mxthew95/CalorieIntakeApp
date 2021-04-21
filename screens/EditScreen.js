import React from 'react';
import { View, Text } from 'react-native';

const EditScreen = ({ navigation, route }) => {
    return (
        <View><Text>ID is {route.params.calorieID}</Text></View>
    );
};

const styles = StyleSheet.create({

});

export default EditScreen;