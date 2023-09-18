import { Button, StyleSheet, Text, View } from "react-native";
import React, { memo, useCallback, useRef, useState } from "react";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
const DetailScreen = memo(() => {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState({});
  const [currentTime, setCurrentTime] = useState(0);

  const onPlaybackStatus = useCallback((status: AVPlaybackStatus) => {
    setStatus(() => status);
  }, []);

  const onBackward = () => {
    videoRef.current?.setPositionAsync(currentTime - 1000 * 10);
  };

  const onForward = () => {
    videoRef.current?.setPositionAsync(currentTime + 1000 * 10);
  };
  return (
    <View>
      <Video
        style={styles.video}
        source={{
          uri: "https://firebasestorage.googleapis.com/v0/b/sedu-8a3d2.appspot.com/o/y2mate.is%20-%20The%20C%20ft.%20Gemlest%201MUSUN%20Lyrics%20-bD2pGlNaDe0-1080pp-1695008357.mp4?alt=media&token=885a71b0-7af1-4301-ace1-df140100f19a",
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        onPlaybackStatusUpdate={onPlaybackStatus}
        ref={videoRef}
        onFullscreenUpdate={(e) => console.log(e)}
      />
      <Button
        title={status?.isPlaying ? "Pause" : "Play"}
        onPress={() =>
          status.isPlaying
            ? videoRef.current?.pauseAsync()
            : videoRef.current?.playAsync()
        }
      />
    </View>
  );
});

DetailScreen.displayName = "DetailScreen";

export { DetailScreen };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    width: "100%",
    height: 300,
  },
});
