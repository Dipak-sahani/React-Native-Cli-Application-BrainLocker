import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../theme/ThemeContext";

import HomeScreen from "../screens/HomeScreen";
import CreateQuestionScreen from "../screens/CreateQuestionScreen";
import QuestionsListScreen from "../screens/QuestionsListScreen";
import UserProfileScreen from "../screens/UserProfileScreen";
import AddQuestionsScreen from "../screens/AddQuestionsScreen";

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const { currentTheme, isDark } = useTheme();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,

          tabBarIcon: ({ color, size, focused }) => {
            let iconName = "";

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "AddQuestion") {
              iconName = focused ? "add-circle" : "add-circle-outline";
            } else if (route.name === "AllQuestions") {
              iconName = focused ? "list" : "list-outline";
            } else if (route.name === "User") {
              iconName = focused ? "person-circle" : "person-circle-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },

          // Keep your original green for active, but use theme for inactive
          tabBarActiveTintColor: "#4CAF50", // Your original green
          tabBarInactiveTintColor: currentTheme.colors.textMuted,
          
          // Theme-based background
          tabBarStyle: {
            backgroundColor: currentTheme.colors.card,
            borderTopColor: currentTheme.colors.border,
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
            shadowColor: currentTheme.colors.shadow,
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: isDark ? 0.3 : 0.1,
            shadowRadius: 8,
            elevation: 8,
          },
          
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="AddQuestion" component={AddQuestionsScreen} />
        <Tab.Screen name="AllQuestions" component={QuestionsListScreen} />
        <Tab.Screen name="User" component={UserProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;