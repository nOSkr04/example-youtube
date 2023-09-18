import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { memo, useCallback } from "react";
import { data } from "./data";
import { ILesson } from "../interfaces/lesson";
import { LessonContainer } from "../components/lesson-container";

const LessonTab = memo(() => {
  const renderItem = useCallback(({ item }: { item: ILesson }) => {
    return <LessonContainer item={item} />;
  }, []);
  return (
    <View>
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
});

LessonTab.displayName = "LessonTab";

export { LessonTab };

const styles = StyleSheet.create({});
