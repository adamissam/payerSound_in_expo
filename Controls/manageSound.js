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
// let position = 0; // => position of the playinf of the sound

/**
 * Function to intialise sound
 * @param {*} callback
 */
export const initialisationSound = async (callback) => {
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

export const startSoundFunction = async (callback, position) => {
  try {
    const { status } = await Audio.getPermissionsAsync();
    if (status === "granted") {
      //   const { sound: soundObject, status } = await Audio.Sound.createAsync(
      //     source,
      //     {
      //       shouldPlay: false,
      //     }
      //   );

      const status = await soundObject.getStatusAsync();
      console.log("status => ", status);
      //   if(status.)
      //   startPlaySoundWoithoutInstance();
      //   const status = await soundObject.getStatusAsync();
      if (status.isLoaded && position == 0) {
        console.log("start 1");
        await soundObject.setOnPlaybackStatusUpdate(callback);
        soundObject.playAsync();
      } else {
        console.log("start 2");
        console.log("status 2=> ", status);
        await soundObject.setOnPlaybackStatusUpdate(callback);
        await soundObject.playFromPositionAsync(position);

        await soundObject.stopAsync();
        await soundObject.unloadAsync();
      }
    } else {
      callback(false);
    }
  } catch (error) {
    console.log("error play sound=> ", error);
  }
};

async function startPlaySoundWoithoutInstance() {
  //   soundObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
  //   Audio.Sound.createAsync(source,downloadFirst = true)
  //   await soundObject.loadAsync(source, (onPlaybackStatusUpdate = null));
  await soundObject.loadAsync(source);
  soundObject.setProgressUpdateIntervalAsync(50);
  soundObject.playAsync();
}

export const posePlayingSoundFunction = async () => {
  await soundObject.pauseAsync();
  //   await soundObject.unloadAsync(); // remove instance of sound
  const status = await soundObject.getStatusAsync();
  position = status.positionMillis;
  console.log("asked sound pose => ", status);
  console.log("type of sound pose => ", typeof status.volume);
};

export const updateSoundPower = async (value) => {
  console.log("value audio => ", value);
  console.log("type of  audio => ", typeof value);
  soundObject.setVolumeAsync(parseInt(value));

  const status = await soundObject.getStatusAsync();
  console.log("status => ", status);
};
