import React, { useCallback, useEffect } from "react";
import { View, Button, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  useAnimatedStyle,
  withRepeat,
  withSequence,
} from "react-native-reanimated";

const ANGLE = 10;
const TIME = 100;
const EASING = Easing.elastic(1.5);

const HomeScreen = () => {
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}deg` }],
  }));

  const wobble = useCallback(() => {
    // highlight-next-line
    rotation.value = withSequence(
      // deviate left to start from -ANGLE
      withTiming(-ANGLE, { duration: TIME / 2, easing: EASING }),
      // wobble between -ANGLE and ANGLE 7 times
      withRepeat(
        withTiming(ANGLE, {
          duration: TIME,
          easing: EASING,
        }),
        7,
        true
      ),
      // go back to 0 at the end
      withTiming(0, { duration: TIME / 2, easing: EASING })
      // highlight-next-line
    );
  }, []);

  useEffect(() => {
    wobble();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../../assets/icon.png")}
        style={[styles.box, animatedStyle]}
      />
      <Animated.View style={[styles.box, animatedStyle]} />
    </View>
  );
};

export { HomeScreen };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  box: {
    height: 120,
    width: 120,
    backgroundColor: "#b58df1",
    borderRadius: 20,
    marginBottom: 30,
  },
});
