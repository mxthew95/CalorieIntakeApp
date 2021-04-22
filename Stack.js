import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import EditScreen from './screens/EditScreen';
import AddScreen from './screens/AddScreen';
const Stack = createStackNavigator();

export default function Navigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 24
                },
            }}
        >
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: 'Daily Calorie Intake',
                }}
            />
            <Stack.Screen
                name="Edit"
                component={EditScreen}
                options={{
                    title: 'Update Calorie'
                }}
            />

            <Stack.Screen
                name="Add"
                component={AddScreen}
                options={{
                    title: 'Add Calorie Intake'
                }}
            />
        </Stack.Navigator>
    )
}