import React, { memo, useMemo, useState } from "react";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Dimensions, StatusBar, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const DRAG_LIMIT = 100;
const SCREEN_WIDTH = Dimensions.get("window").width;
const RADIO = (SCREEN_WIDTH - 22) / SCREEN_WIDTH;

type Props = {
  onClosed: () => void;
  LightFooterComponent?: JSX.Element;
  LightHeaderComponent?: JSX.Element;
  children: JSX.Element;
};

const LightBox = memo(
  ({
    children,
    LightHeaderComponent,
    LightFooterComponent,
    onClosed,
  }: Props) => {
    const [closing, setClosing] = useState(false);

    const insets = useSafeAreaInsets();
    const offsetX = useSharedValue(0);
    const offsetY = useSharedValue(0);

    const dragGesture = Gesture.Pan()
      .minPointers(1)
      .maxPointers(1)
      .onStart(() => {
        offsetX.value = 0;
        offsetY.value = 0;
      })
      .onUpdate((e) => {
        offsetX.value = e.translationX;
        offsetY.value = e.translationY;
      })
      .onEnd((e) => {
        const whenDragLimitReached = () => {
          runOnJS(setClosing)(true);

          offsetX.value = withTiming(0, { duration: 200 });
          offsetY.value = withTiming(25, { duration: 200 }, () => {
            runOnJS(onClosed)();
          });
        };

        if (e.translationY < -DRAG_LIMIT) {
          whenDragLimitReached();
          return;
        }

        if (e.translationY > DRAG_LIMIT) {
          whenDragLimitReached();
          return;
        }

        if (e.translationX < -DRAG_LIMIT) {
          whenDragLimitReached();
          return;
        }

        if (e.translationX > DRAG_LIMIT) {
          whenDragLimitReached();
          return;
        }

        offsetX.value = withTiming(0, { duration: 200 });
        offsetY.value = withTiming(0, { duration: 200 });
      });

    const animatedOffset = useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: offsetX.value },
          { translateY: offsetY.value },
        ],
      };
    });

    const animatedScale = useAnimatedStyle(() => {
      const scale = interpolate(
        offsetY.value,
        [-DRAG_LIMIT, 0, DRAG_LIMIT],
        [1, RADIO, 1],
        "clamp"
      );

      return {
        transform: [
          { translateX: offsetX.value },
          { translateY: offsetY.value },
          { scale },
        ],
      };
    });

    const animatedBackdrop = useAnimatedStyle(() => {
      const opacity = interpolate(
        offsetY.value,
        [-DRAG_LIMIT, 0, DRAG_LIMIT],
        [0, 1, 0],
        "clamp"
      );
      return {
        opacity,
      };
    });

    const animatedPosition = useAnimatedStyle(() => {
      const opacity = interpolate(
        offsetY.value,
        [-DRAG_LIMIT / 3, 0, DRAG_LIMIT / 3],
        [0, 1, 0],
        "clamp"
      );
      return {
        opacity,
      };
    });

    const animatedContent = useMemo(() => {
      return [
        closing ? animatedScale : animatedOffset,
        styles.content,
        {
          borderRadius: closing ? 20 : 0,
        },
      ];
    }, [animatedOffset, closing, animatedScale]);

    return (
      <SafeAreaView style={styles.container}>
        {!closing && (
          <Animated.View style={[styles.backdrop, animatedBackdrop]} />
        )}

        {LightHeaderComponent && (
          <Animated.View
            style={[styles.header, animatedPosition, { marginTop: insets.top }]}
          >
            {LightHeaderComponent}
          </Animated.View>
        )}

        <View style={styles.children}>
          <GestureDetector gesture={dragGesture}>
            <Animated.View style={animatedContent}>{children}</Animated.View>
          </GestureDetector>
        </View>

        {LightFooterComponent && (
          <Animated.View
            style={[
              styles.footer,
              animatedPosition,
              { marginBottom: insets.bottom },
            ]}
          >
            {LightFooterComponent}
          </Animated.View>
        )}

        <StatusBar barStyle="light-content" />
      </SafeAreaView>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "column",
    backgroundColor: "black",
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    width: SCREEN_WIDTH,
    overflow: "hidden",
  },
  children: {
    flex: 0.85,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    position: "absolute",
    top: 0,
    zIndex: 10,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    zIndex: 10,
    left: 0,
    right: 0,
  },
});

LightBox.displayName = "LightBox";

export { LightBox };
