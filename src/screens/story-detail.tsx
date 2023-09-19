import React, { useRef, useState, memo, useCallback } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import VideoControls from "../components/video-controls";
import * as ScreenOrientation from "expo-screen-orientation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { NavigationRoutes, RootStackParamList } from "../../navigation/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import useSWR from "swr";
import { StoryApi } from "../api";
import { IStory } from "../interface/story";
const playbackSpeedOptions: number[] = [0.5, 0.75, 1, 1.25, 1.5, 2];

type Props = NativeStackScreenProps<
  RootStackParamList,
  NavigationRoutes.StoryDetailScreen
>;

const StoryDetailScreen = memo(({ route }: Props) => {
  const { id } = route.params;
  const sf = useSafeAreaInsets();
  const navigation = useNavigation();
  const videoRef = useRef<Video>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [firstPress, setFirstPress] = useState(false);

  const { data } = useSWR<IStory>(`story.${id}`, async () => {
    const res = await StoryApi.getStory({ id });
    return res;
  });

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

  const appBar = useCallback(() => {
    return {
      marginTop: sf.top,
      marginHorizontal: 16,
    };
  }, []);

  const onBack = useCallback(async () => {
    navigation.goBack();
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
    setIsFullscreen(false);
  }, []);

  if (!data) {
    return null;
  }

  return (
    <Pressable style={styles.root} onPress={() => setFirstPress(!firstPress)}>
      {!firstPress && (
        <View style={appBar()}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <AntDesign name={"left"} color={"white"} size={16} />
          </TouchableOpacity>
        </View>
      )}
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size={"large"} color={"white"} />
        </View>
      )}
      <Video
        ref={videoRef}
        source={{
          uri: data.url,
        }}
        rate={playbackSpeed}
        isMuted={isMuted}
        shouldPlay={isPlaying}
        resizeMode={ResizeMode.CONTAIN}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        style={styles.videoContainer}
        onLoad={onLoad}
        usePoster={true}
        posterSource={{ uri: data.photo }}
        posterStyle={styles.posterStyle}
        onLoadStart={() => setLoading(true)}
      />

      {!firstPress && (
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
    </Pressable>
  );
});

StoryDetailScreen.displayName = "StoryDetailScreen";

export { StoryDetailScreen };

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
  backButton: {
    padding: 8,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
