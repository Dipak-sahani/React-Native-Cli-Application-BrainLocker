/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View, Text, Pressable, Alert } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';


import ButtonShowcase from './src/screens/ButtonShowcase';
// import { initDB } from './src/config/init';
import { useEffect } from 'react';
// import { saveUser, getUser } from "./src/database/user.table";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Button from './src/components/Button/Button';
import { PlusIcon, CheckIcon, ArrowRightIcon, SaveIcon, DeleteIcon } from './src/components/Icons';
import { initDB } from './src/database/db';
import { createUserTable, saveUser, getUser, dropUsersTable } from "./src/database/user.table";
import { createQuestionTable, addCreatedAtColumn ,dropQuestionsTable } from './src/database/question.table';
import CreateQuestionScreen from './src/screens/CreateQuestionScreen';
import QuestionsListScreen from './src/screens/QuestionsListScreen';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/theme/ThemeContext';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const Tab = createBottomTabNavigator();


  const saveUserInfo = async () => {
  await saveUser({
    name: "Dipak",
    age: 21,
    className: "B.Tech",
    email: "dipak@example.com"
  });

  console.log("User saved!");
};


const loadUser = async () => {
  const user = await getUser();
  console.log("Loaded user:", user);
};
  
 useEffect(() => {
  const setupDB = async () => {
    await initDB();          // initialize DB connection
    await createUserTable(); // create the users table
    await createQuestionTable();
  };

  setupDB().catch((err) => console.error("DB setup error:", err));
}, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
         <AppNavigator/>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  textView:{
    marginTop:20,
  },
  buttonSpacing:{
    marginBottom:12
  }
});

export default App;
