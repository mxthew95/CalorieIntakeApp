import * as React from 'react';
import { NavigationContainer  } from '@react-navigation/native';
import Navigator from './Stack';

export default function App(){
  return (
    <NavigationContainer>
      <Navigator/>
    </NavigationContainer>
  );
}