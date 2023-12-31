import { useNavigation } from "@react-navigation/native";
import { ResizeMode, Video } from "expo-av";
import React, { useRef } from "react";
import { Pressable, StyleSheet } from "react-native";
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

const AnimatedVideo = Animated.createAnimatedComponent(Video);

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
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = React.useState({});
  return (
    <Pressable
      style={{ flex: 1, flexDirection: "column" }}
      onPress={() => navigation.navigate("Detail", { videoRef })}
    >
      <AnimatedVideo
        sharedTransitionTag="sharedTag"
        ref={videoRef}
        style={styles.video}
        source={{
          uri: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      />
    </Pressable>
  );
};

export { HomeScreen };

const styles = StyleSheet.create({
  video: {
    height: 150,
    width: 150,
  },
});
