import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable } from "react-native";
import Animated, {
  Easing,
  SharedTransition,
  withSpring,
  withTiming,
} from "react-native-reanimated";

// export const customTransition = SharedTransition.custom((values) => {
//   "worklet";
//   return {
//     width: withTiming(values.targetWidth, {
//       easing: Easing.quad,
//     }),
//     height: withTiming(values.targetHeight, {
//       easing: Easing.quad,
//     }),
//     originX: withTiming(values.targetOriginX, {
//       easing: Easing.quad,
//     }),
//     originY: withTiming(values.targetOriginY, {
//       easing: Easing.quad,
//     }),
//   };
// });

const springConfig = {
  mass: 1,
  damping: 100,
  stiffness: 500,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
};

export const customTransition = SharedTransition.custom((values) => {
  "worklet";
  return {
    height: withSpring(values.targetHeight, springConfig),
    width: withSpring(values.targetWidth, springConfig),
    originX: withSpring(values.targetOriginX, springConfig),
    originY: withSpring(values.targetOriginY, springConfig),
  };
});

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <Pressable
      style={{ flex: 1, flexDirection: "column" }}
      onPress={() => navigation.navigate("Detail")}
    >
      <Animated.Image
        sharedTransitionTag="sharedTag"
        sharedTransitionStyle={customTransition}
        style={{ width: 150, height: 150 }}
        source={{
          uri: "https://images.pexels.com/photos/18056655/pexels-photo-18056655/free-photo-of-a-humpback-whale-emerging-from-the-water.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
        }}
      />
    </Pressable>
  );
};

export { HomeScreen };
