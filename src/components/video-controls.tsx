import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { Slider } from "@miblanchard/react-native-slider";
import Animated from "react-native-reanimated";

type Props = {
  onTogglePlayPause: () => void;
  onPlayPreviousVideo: () => void;
  onPlayNextVideo: () => void;
  onToggleMute: () => void;
  onTogglePlaybackSpeed: () => void;
  onSeek: (value: string | number) => void;
  onToggleFullscreen: () => Promise<void>;
  duration: number;
  currentTime: number;
  rate: number;
  isMuted: boolean;
  shouldPlay: boolean;
  fullScreenValue: boolean;
};

const VideoControls = ({
  onTogglePlayPause,
  onPlayPreviousVideo,
  onPlayNextVideo,
  onToggleMute,
  onTogglePlaybackSpeed,
  onSeek,
  onToggleFullscreen,
  duration,
  currentTime: time,
  rate,
  isMuted,
  shouldPlay,
  fullScreenValue,
}: Props) => {
  function formatTime(milliseconds: number): string {
    const duration = milliseconds / 1000;

    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration - hours * 3600) / 60);
    const seconds = parseInt(`${duration - hours * 3600 - minutes * 60}`, 10);

    let result = `${hours < 10 ? "0" + hours : hours}:`.replace("00:", "");
    result += `${minutes < 10 ? "0" + minutes : minutes}:`;
    result += `${seconds < 10 ? "0" + seconds : seconds}`;

    return result;
  }

  return (
    <Animated.View
      style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 2 }}
    >
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={() => {
            onTogglePlayPause();
          }}
          style={styles.controlButton}
        >
          <Ionicons
            name={shouldPlay ? "pause" : "play-sharp"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPlayPreviousVideo}
          style={styles.controlButton}
        >
          <MaterialIcons name="replay-10" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPlayNextVideo}
          style={styles.controlButton}
        >
          <MaterialIcons name="forward-10" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onToggleMute();
          }}
          style={styles.controlButton}
        >
          <Ionicons
            name={isMuted ? "volume-mute" : "volume-high"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onTogglePlaybackSpeed();
          }}
          style={styles.controlButton}
        >
          <Text style={styles.playbackSpeedText}>{`${rate}x`}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onToggleFullscreen();
          }}
          style={styles.controlButton}
        >
          <MaterialIcons
            name={fullScreenValue ? "fullscreen-exit" : "fullscreen"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{formatTime(time)}</Text>
        <Slider
          containerStyle={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={time}
          onValueChange={(value: any) => {
            onSeek(value);
          }}
          onSlidingComplete={(value: any) => {
            onSeek(value);
          }}
          minimumTrackTintColor="#FFF"
          maximumTrackTintColor="#AAA"
          thumbTintColor="#FFF"
        />
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#000",
  },
  controlButton: {
    marginHorizontal: 10,
  },
  playbackSpeedText: {
    color: "white",
    fontSize: 16,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    alignSelf: "center",
    backgroundColor: "black",
    padding: 10,
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  timeText: {
    color: "white",
    fontSize: 12,
  },
});

export default VideoControls;
