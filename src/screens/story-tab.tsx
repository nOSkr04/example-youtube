import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import React, { memo, useCallback } from "react";
import { LessonContainer } from "../components/lesson-container";
import useSWRInfinite from "swr/infinite";
import { StoryApi } from "../api";
import { IStory } from "../interface/story";
import { StoryContainer } from "../components/story-container";
const StoryTab = memo(() => {
  const { data, size, setSize, isLoading } = useSWRInfinite(
    (index) => `lesson.${index}`,
    async (index) => {
      const page = index.split(".").pop();
      const res = await StoryApi.getStorys({
        page: parseInt(`${page || 1}`, 10) + 1,
        limit: 10,
      });
      return res;
    },
    { revalidateAll: true }
  );

  const renderItem = useCallback(({ item }: { item: IStory }) => {
    return <StoryContainer item={item} />;
  }, []);

  if (!data) {
    return null;
  }

  return (
    <>
      {/* <AppBar right={<></>} title={"Өгүүллэг"}   /> */}
      <FlatList
        data={(data || []).map((entry) => entry.data).flat() as IStory[]}
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

StoryTab.displayName = "StoryTab";

export { StoryTab };

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
