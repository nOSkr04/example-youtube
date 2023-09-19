import { StyleSheet, View } from "react-native";
import React from "react";
import Animated, {
  FadeInLeft,
  SharedTransition,
  withSpring,
} from "react-native-reanimated";
import { customTransition } from "./home";
import { LightBox } from "./lightbox";
import { useNavigation } from "@react-navigation/native";
const DetailScreen = () => {
  const transition = SharedTransition.custom((values) => {
    "worklet";
    return {
      height: withSpring(values.targetHeight),
      width: withSpring(values.targetWidth),
    };
  });
  const navigation = useNavigation();
  return (
    // <BlurView
    //   style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    //   intensity={40}
    //   tint="dark"
    // >
    //   <Animated.Image
    //     sharedTransitionTag="sharedTag"
    //     style={{ width: 300, height: 300 }}
    //     sharedTransitionStyle={customTransition}
    //     source={{
    //       uri: "https://images.pexels.com/photos/18056655/pexels-photo-18056655/free-photo-of-a-humpback-whale-emerging-from-the-water.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    //     }}
    //   />
    //   <Animated.Text entering={FadeInLeft.duration(400).delay(500)}>
    //     Delgerengui
    //   </Animated.Text>
    // </BlurView>
    <LightBox onClosed={() => navigation.goBack()}>
      <View>
        <Animated.Image
          sharedTransitionTag="sharedTag"
          style={{ width: 300, height: 300 }}
          sharedTransitionStyle={customTransition}
          source={{
            uri: "https://images.pexels.com/photos/18056655/pexels-photo-18056655/free-photo-of-a-humpback-whale-emerging-from-the-water.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
          }}
        />
        <Animated.Text entering={FadeInLeft.duration(400).delay(500)}>
          Delgerengui
        </Animated.Text>
      </View>
    </LightBox>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({});
