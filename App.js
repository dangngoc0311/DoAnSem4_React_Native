import React from 'react';
import 'react-native-gesture-handler';
import Providers from "./navigation/NavIndex";
import { LogBox } from 'react-native';

const App = () => {
    return <Providers />;
}
console.disableYellowBox = true;
LogBox.ignoreAllLogs(true);
export default App;