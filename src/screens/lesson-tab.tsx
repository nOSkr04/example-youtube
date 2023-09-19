import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import React, { memo, useCallback } from "react";
import { ILesson } from "../interface/lesson";
import { LessonContainer } from "../components/lesson-container";
import useSWRInfinite from "swr/infinite";
import { LessonsApi, StoryApi } from "../api";
const LessonTab = memo(() => {
  const { data, size, setSize, isLoading } = useSWRInfinite(
    (index) => `lesson.${index}`,
    async (index) => {
      const page = index.split(".").pop();
      const res = await LessonsApi.getLessons({
        page: parseInt(`${page || 1}`, 10) + 1,
        limit: 10,
      });
      return res;
    },
    { revalidateAll: true }
  );

  const renderItem = useCallback(({ item }: { item: ILesson }) => {
    return <LessonContainer item={item} />;
  }, []);

  if (!data) {
    return null;
  }

  return (
    <>
      {/* <AppBar right={<></>} title={"Сургалт"}   /> */}
      <FlatList
        data={(data || []).map((entry) => entry.data).flat() as ILesson[]}
        keyExtractor={(item) => item._id}
        onEndReached={() => setSize(size + 1)}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              setSize(1);
            }}
            refreshing={isLoading}
          />
        }
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        style={styles.root}
      />
    </>
  );
});

LessonTab.displayName = "LessonTab";

export { LessonTab };

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
