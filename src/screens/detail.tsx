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
import { ResizeMode, Video } from "expo-av";

const AnimatedVideo = Animated.createAnimatedComponent(Video);

const DetailScreen = ({ route }) => {
  const { videoRef } = route.params;
  const navigation = useNavigation();
  const [status, setStatus] = React.useState({});
  return (
    // <BlurView
    //   style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    //   intensity={40}
    //   tint="dark"
    // >
    //   <Animated.Image
    //     sharedTransitionTag="sharedTag"
    //     style={}
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
      <AnimatedVideo
        sharedTransitionTag="sharedTag"
        ref={videoRef}
        style={{ width: 300, height: 300 }}
        source={{
          uri: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      />
    </LightBox>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({});
