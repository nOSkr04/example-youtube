import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { memo } from "react";
import { ILesson } from "../interfaces/lesson";
import { Image } from "expo-image";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
type Props = {
  item: ILesson;
};

const width = Dimensions.get("window").width;

const LessonContainer = memo(({ item }: Props) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.root}
      onPress={() => navigation.navigate("DetailScreen")}
    >
      <Image
        source={item.img}
        style={styles.image}
        contentFit="cover"
        transition={1000}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.contentContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="videocam" size={20} color="gray" />
            <Text style={styles.description}>{item.time}</Text>
          </View>
          <Entypo name="dot-single" size={24} color="gray" />
          <View style={styles.iconContainer}>
            <Ionicons name="eye" size={20} color="gray" />
            <Text style={styles.description}>{item.seen}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

LessonContainer.displayName = "LessonContainer";

export { LessonContainer };

const styles = StyleSheet.create({
  root: {
    marginTop: 12,
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 12,
    flex: 1,
  },
  image: {
    width: width * 0.4,
    height: width * 0.22,
    borderRadius: 6,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    marginLeft: 12,
    marginBottom: 8,
    fontWeight: "600",
  },
  description: {
    fontWeight: "400",
    color: "gray",
    marginLeft: 4,
  },
});
