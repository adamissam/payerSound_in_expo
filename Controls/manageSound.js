import { Audio } from "expo-av"; // import audio from expo-av

const soundObject = new Audio.Sound(); // create instance audio;
const source = require("../assets/sound/Niska_Bâtiment.mp3");
Audio.setAudioModeAsync({
  allowsRecordingIOS: false,
  interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
  playsInSilentModeIOS: true,
  shouldDuckAndroid: true,
  interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
});
let position = 0; // => position of the playing of the sound

/**
 * Function to initialize sound
 * @param {*} callback
 */
export const initializationSound = async (callback) => {
  try {
    const { status } = await Audio.requestPermissionsAsync();
    if (status === "granted") {
      const statusSound = await soundObject.getStatusAsync();
      console.log("status => ", status);

      if (!statusSound.isLoaded) {
        console.log("start init 1");
        await soundObject.loadAsync(source);
        await soundObject.setProgressUpdateIntervalAsync(50);
        // await soundObject.setOnPlaybackStatusUpdate(callback)
        // soundObject.playAsync();
      } else {
        console.log("start  2");
        await soundObject.stopAsync();
        await soundObject.unloadAsync();
        await soundObject.loadAsync(source);
        await soundObject.setProgressUpdateIntervalAsync(50);
        soundObject.setOnPlaybackStatusUpdate(callback);
      }
      const newStatusSound = await soundObject.getStatusAsync();
      console.log("test new status => ", newStatusSound);
      callback(newStatusSound.durationMillis);
    } else {
      callback(false);
    }
  } catch (error) {
    callback(false);
  }
};

export const startSoundFunction = async (callback) => {
  try {
    const { status } = await Audio.getPermissionsAsync(); // => check if user has permission for audio

    if (status === "granted") {
      const status = await soundObject.getStatusAsync(); // => check if there is an instance of  audio

      console.log("status => ", status);

      if (status.isLoaded && position == 0) {
        // if there is an instance of audio and user don't have start play audio
        console.log("start 1");
        soundObject.setOnPlaybackStatusUpdate(callback);
        soundObject.playAsync();
      } else if (status.isLoaded && position > 0) {
        // if user has already started play an audio
        console.log("start 2");
        console.log("status 2=> ", status);
        console.log("position => ", position);
        soundObject.setOnPlaybackStatusUpdate(callback);
        await soundObject.playFromPositionAsync(position);
      }
    } else {
      // if user has not permission
      callback(false);
    }
  } catch (error) {
    console.log("error play sound=> ", error);
    position = 0;
    await soundObject.stopAsync();
    await soundObject.unloadAsync();
  }
};

export const posePlayingSoundFunction = async () => {
  await soundObject.pauseAsync();
  const status = await soundObject.getStatusAsync();
  position = status.positionMillis;
  // console.log("asked sound pose => ", status);
  // console.log("type of sound pose => ", typeof status.volume);
};

export const updateSoundPower = async (value) => {
  console.log("//////");
  console.log("value audio => ", value);
  console.log("type of  audio => ", typeof value);
  let volume = parseFloat(value);
  console.log("volume => ", volume);
  console.log("//////");
  await soundObject.setVolumeAsync(volume);

  const status = await soundObject.getStatusAsync();
  console.log("status => ", status);
};
