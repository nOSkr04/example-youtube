import { StyleSheet, Text, View } from "react-native";
import React, { memo } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { LessonTab } from "./lesson-tab";
import { StoryTab } from "./story-tab";

const Tab = createMaterialTopTabNavigator();

const HomeScreen = memo(() => {
  return (
    <View style={styles.root}>
      <Tab.Navigator>
        <Tab.Screen
          name="LessonTab"
          component={LessonTab}
          options={{ title: "" }}
        />
        <Tab.Screen
          name="StoryTab"
          component={StoryTab}
          options={{ title: "" }}
        />
      </Tab.Navigator>
    </View>
  );
});

HomeScreen.displayName = "HomeScreen";

export { HomeScreen };

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
