import React, { useRef, useState, useEffect, memo, useCallback } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import VideoControls from "../components/video-controls";
import * as ScreenOrientation from "expo-screen-orientation";

export type Lesson = {
  lessonId: string;
  lessonVideoUrl: string;
  lessonTitle: string;
  lessonDescription: string;
  videoTotalDuration: string;
  lessonThumbnailImageUrl: string;
};

const playbackSpeedOptions: number[] = [0.5, 0.75, 1, 1.25, 1.5, 2];

const DetailScreen = memo(() => {
  const videoRef = useRef<Video>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  // Sets the current time, if the video is finished, moves to the next video
  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      return;
    }
    setLoading(false);
    setCurrentTime(status.positionMillis);
    if (status.didJustFinish) {
      videoRef.current?.pauseAsync();
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      videoRef.current?.pauseAsync();
    } else {
      videoRef.current?.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const playNextVideo = () => {
    videoRef.current?.setPositionAsync(currentTime + 1000 * 10);
    setCurrentTime(currentTime + 1000 * 10);
  };

  const playPreviousVideo = () => {
    videoRef.current?.setPositionAsync(currentTime - 1000 * 10);
    setCurrentTime(currentTime - 1000 * 10);
  };

  const togglePlaybackSpeed = () => {
    // Gets the next playback speed index
    const nextSpeedIndex = playbackSpeedOptions.indexOf(playbackSpeed) + 1;
    if (nextSpeedIndex < playbackSpeedOptions.length) {
      videoRef.current?.setRateAsync(
        playbackSpeedOptions[nextSpeedIndex],
        true
      );
      setPlaybackSpeed(playbackSpeedOptions[nextSpeedIndex]);
    }
    // If the last option i.e., 2x speed is applied, then move to the first option
    else {
      videoRef.current?.setRateAsync(playbackSpeedOptions[0], true);
      setPlaybackSpeed(playbackSpeedOptions[0]);
    }
  };

  const toggleMute = () => {
    videoRef.current?.setIsMutedAsync(isMuted);
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
      );
      setIsFullscreen(true);
    } else {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
      setIsFullscreen(false);
    }
  };

  const onSeek = useCallback((value: string | number) => {
    videoRef.current?.setPositionAsync(+value);
    setCurrentTime(+value);
  }, []);

  const onLoad = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      return;
    }
    setDuration(status?.durationMillis!);
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <Video
        ref={videoRef}
        source={{
          uri: "https://firebasestorage.googleapis.com/v0/b/sedu-8a3d2.appspot.com/o/y2mate.is%20-%20The%20C%20ft.%20Gemlest%201MUSUN%20Lyrics%20-bD2pGlNaDe0-1080pp-1695008357.mp4?alt=media&token=885a71b0-7af1-4301-ace1-df140100f19a",
        }}
        rate={playbackSpeed}
        isMuted={isMuted}
        shouldPlay={isPlaying}
        resizeMode={ResizeMode.CONTAIN}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        style={styles.videoContainer}
        onLoad={onLoad}
        usePoster={true}
        posterSource={require("../../assets/adaptive-icon.png")}
        posterStyle={styles.posterStyle}
        onLoadStart={() => setLoading(true)}
      />
      {!loading && (
        <VideoControls
          onTogglePlayPause={togglePlayPause}
          onPlayPreviousVideo={playPreviousVideo}
          onPlayNextVideo={playNextVideo}
          onToggleMute={toggleMute}
          onTogglePlaybackSpeed={togglePlaybackSpeed}
          onSeek={onSeek}
          onToggleFullscreen={toggleFullscreen}
          duration={duration}
          currentTime={currentTime}
          rate={playbackSpeed}
          isMuted={isMuted}
          shouldPlay={isPlaying}
          fullScreenValue={isFullscreen}
        />
      )}
    </GestureHandlerRootView>
  );
});

DetailScreen.displayName = "DetailScreen";

export { DetailScreen };

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "black",
  },
  videoContainer: {
    flex: 1,
  },
  posterStyle: {
    width: "auto",
    height: "auto",
    alignSelf: "center",
  },
});
