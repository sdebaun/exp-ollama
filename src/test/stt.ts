import { pipeline } from '@xenova/transformers';
import wavefile from 'wavefile';
import fs from 'fs'
import whisper from 'whisper-node'

const run = async () => {
  const filepath = '/tmp/test.wav'
  // const filepath = '~/Downloads/speaker_0.mp3'
  // const filepath = '~/Downloads/Speaker29_000.wav'
  const transcript = await whisper(filepath, { modelName: 'tiny.en' })
  console.log('transcript', transcript)
  // let transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
  // const output = await transcriber('/tmp/test.wav')
  // console.log(output)
  // Load audio data
  // let url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/jfk.wav';
  // let buffer = Buffer.from(await fetch(url).then(x => x.arrayBuffer()))
  // let url = '/tmp/test.wav';
  // let buffer = Buffer.from(fs.readFileSync(url))
  // // Read .wav file and convert it to required format
  // let wav = new wavefile.WaveFile(buffer);
  // wav.toBitDepth('32f'); // Pipeline expects input as a Float32Array
  // wav.toSampleRate(16000); // Whisper expects audio with a sampling rate of 16000
  // let audioData = wav.getSamples();
  // if (Array.isArray(audioData)) {
  //   if (audioData.length > 1) {
  //     const SCALING_FACTOR = Math.sqrt(2);

  //     // Merge channels (into first channel to save memory)
  //     for (let i = 0; i < audioData[0].length; ++i) {
  //       audioData[0][i] = SCALING_FACTOR * (audioData[0][i] + audioData[1][i]) / 2;
  //     }
  //   }

  //   // Select first channel
  //   audioData = audioData[0];
  // }
}

run()
  .then(r => console.log('done', r))
  .catch(r => console.log('err', r))