import React, { useRef, useState, useEffect, memo } from "react";
import { View } from "react-native";
import { ResizeMode, Video } from "expo-av";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import VideoControls from "../components/video-controls";
import * as ScreenOrientation from "expo-screen-orientation";

const playbackSpeedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];
const DetailScreen = memo(() => {
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState({});
  const videoRef = useRef<Video>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [orientation, setOrientation] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Simulate fetching lessons by course
    const fakeLessons = [
      {
        lessonId: "1",
        lessonVideoUrl:
          "https://firebasestorage.googleapis.com/v0/b/sedu-8a3d2.appspot.com/o/y2mate.is%20-%20The%20C%20ft.%20Gemlest%201MUSUN%20Lyrics%20-bD2pGlNaDe0-1080pp-1695008357.mp4?alt=media&token=885a71b0-7af1-4301-ace1-df140100f19a",
        lessonTitle: "Lesson 1",
        lessonDescription: "Introduction to React Native 1",
        videoTotalDuration: "600",
        lessonThumbnailImageUrl:
          "https://images.pexels.com/photos/12601624/pexels-photo-12601624.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
      },
      {
        lessonId: "2",
        lessonVideoUrl:
          "https://firebasestorage.googleapis.com/v0/b/sedu-8a3d2.appspot.com/o/y2mate.is%20-%20The%20C%20ft.%20Gemlest%201MUSUN%20Lyrics%20-bD2pGlNaDe0-1080pp-1695008357.mp4?alt=media&token=885a71b0-7af1-4301-ace1-df140100f19a",
        lessonTitle: "Lesson 2",
        lessonDescription: "Introduction to React Native 2",
        videoTotalDuration: "800",
        lessonThumbnailImageUrl:
          "https://images.pexels.com/photos/12601624/pexels-photo-12601624.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
      },
      // Add more lessons here
    ];
    setLessons(fakeLessons);
    setSelectedLesson(fakeLessons[0]);
  }, []);

  //sets the current time, if video is finished, moves to the next video
  const handlePlaybackStatusUpdate = (status: any) => {
    setCurrentTime(status.positionMillis);
    if (status.didJustFinish) {
      playNextVideo();
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
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex((prevIndex) => prevIndex + 1);
    }
  };

  const playPreviousVideo = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex((prevIndex) => prevIndex - 1);
    }
  };

  const togglePlaybackSpeed = () => {
    //gets the next playback speed index
    const nextSpeedIndex = playbackSpeedOptions.indexOf(playbackSpeed) + 1;
    if (nextSpeedIndex < playbackSpeedOptions.length) {
      videoRef.current?.setRateAsync(
        playbackSpeedOptions[nextSpeedIndex],
        true
      );
      setPlaybackSpeed(playbackSpeedOptions[nextSpeedIndex]);
    }
    //if the last option i.e. 2x speed is applied. then moves to first option
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
    setOrientation(await ScreenOrientation.getOrientationAsync());
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* <ActivityIndicator  size="large" /> */}
      {lessons.length > 0 && (
        <>
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
            style={{ flex: 1 }}
          />
          <VideoControls
            onTogglePlayPause={togglePlayPause}
            onPlayPreviousVideo={playPreviousVideo}
            onPlayNextVideo={playNextVideo}
            onToggleMute={toggleMute}
            onTogglePlaybackSpeed={togglePlaybackSpeed}
            onSeek={(value) => {
              videoRef.current?.setPositionAsync(+value);
              setCurrentTime(+value);
            }}
            onToggleFullscreen={toggleFullscreen}
            duration={+selectedLesson?.videoTotalDuration}
            currentTime={currentTime}
            rate={playbackSpeed}
            isMuted={isMuted}
            shouldPlay={isPlaying}
            fullScreenValue={isFullscreen}
          />
        </>
      )}
      {/* //this section is only displayed when fullscreen is not active */}
      {orientation == 1 && <View>{/* Simulate other UI elements here */}</View>}
    </GestureHandlerRootView>
  );
});

DetailScreen.displayName = "DetailScreen";

export { DetailScreen };
