import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { millisToMinutesAndSeconds } from "../Controls/getTimeFromMilisecond";
import { BoxShadow } from "react-native-shadow";
import {
  startSoundFunction,
  posePlayingSoundFunction,
  updateSoundPower,
  initialisationSound,
} from "../Controls/manageSound";
const assets = {
  imageNiska: require("../assets/niska_du_lundi_au_lundi.jpg"),
};

const PlayerSound = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [durationAudio, setDurationAudio] = useState(0.0);
  const [maxDurationAudio, setMaxDurationAudio] = useState(0.0);
  const [soundPower, setSoundPower] = useState(1.0);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    initialisation();
  }, []);

  // const maxDuration = 5.0;
  const maxSoundPower = 1;
  const shadowOpt = {
    width: 160,
    height: 170,
    color: "#fff",
    border: 2,
    radius: 3,
    opacity: 0.1,
    x: 0,
    y: 3,
    style: styles.shadowBox,
  };
  /**
   *  intialise all functions
   */
  const initialisation = async () => {
    console.log("test 1");
    initialisationSound(async (callback) => {
      // console.log("callBack => ", callback);
      if (callback != false) {
        setHasPermission(true);
        const handleTime = await millisToMinutesAndSeconds(callback);
        // console.log("init calback => ", handleTime);
        setMaxDurationAudio(handleTime);
      } else {
        setHasPermission(false);
      }
    });
  };

  const startPlayingSound = () => {
    if (hasPermission) {
      startSoundFunction(
        (callback) => handleTimeFromSound(callback),
        durationAudio
      );
    } else {
      initialisationSound();
    }
  };

  const getDurationOfSound = (time) => {
    let times = millisToMinutesAndSeconds(time.positionMillis);
    setMaxDurationAudio(times);
  };
  const handleTimeFromSound = (callback) => {
    let time = millisToMinutesAndSeconds(callback.positionMillis);
    console.log("time => ", time);
    setDurationAudio(time);
    // console.log("calback from sound = > ", callback);
    setIsPlaying(true);
  };

  const stopPlayingSound = () => {
    posePlayingSoundFunction();
    setIsPlaying(false);
  };
  const handleSoundPower = (value) => {
    setSoundPower(value);
    updateSoundPower(value.toFixed(1));
  };
  return (
    <LinearGradient colors={["#fff", "#222"]} style={styles.gardient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.imageArtiste}>
          <Image
            source={assets.imageNiska}
            style={{ width: "95%", height: "94%", borderRadius: 10 }}
            resizeMode="cover"
          />
        </View>
        {/* 
        <BoxShadow setting={shadowOpt}>
          <Image
            source={assets.imageNiska}
            style={{ width: "87.5%", height: "92%", borderRadius: 10 }}
            resizeMode="cover"
          />
        </BoxShadow> */}

        <View style={styles.timer}>
          <Slider
            style={styles.slider}
            maximumValue={maxDurationAudio}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
            onValueChange={(value) => setDurationAudio(value)}
          />
          <View style={styles.containerTime}>
            <Text style={styles.time}>{durationAudio}</Text>
            <Text style={styles.time}>- {maxDurationAudio}</Text>
          </View>
        </View>
        <View style={styles.containerControle}>
          <TouchableOpacity>
            <AntDesign name="banckward" size={30} color="#fff" />
          </TouchableOpacity>

          {isPlaying ? (
            <TouchableOpacity onPress={() => stopPlayingSound()}>
              <Entypo name="controller-stop" size={58} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => startPlayingSound()}>
              <AntDesign name="caretright" size={60} color="#fff" />
            </TouchableOpacity>
          )}

          <AntDesign name="forward" size={30} color="#fff" />
          <TouchableOpacity></TouchableOpacity>
        </View>
        <View style={styles.containerSoundControle}>
          <Foundation name="volume-none" size={24} color="#fff" />
          <Slider
            style={styles.sliderSound}
            maximumValue={maxSoundPower}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
            value={soundPower}
            onValueChange={(value) => handleSoundPower(value)}
          />
          <FontAwesome5 name="volume-up" size={24} color="#fff" />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default PlayerSound;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  gardient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  imageArtiste: {
    alignSelf: "center",
    width: "80%",
    height: "40%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 16,
    shadowColor: "white",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
  },
  timer: {
    width: "80%",
    marginVertical: 10,
    alignSelf: "center",
    backgroundColor: "rgba(169,169,169 ,0.2)",
    borderRadius: 10,
    paddingBottom: 10,
  },
  slider: {
    height: 40,
    width: "100%",
  },
  containerTime: {
    width: "87%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  time: {
    color: "#fff",
    fontSize: 15,
    fontStyle: "italic",
  },
  containerControle: {
    width: "87%",
    alignSelf: "center",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  containerSoundControle: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    marginVertical: 10,
    backgroundColor: "rgba(169,169,169 ,0.2)",
    borderRadius: 10,
    paddingVertical: 10,
  },
  sliderSound: {
    width: "75%",
    height: 40,
  },
  shadowBox: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
});
