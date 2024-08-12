// import process from 'process'
import { startBusService } from './bus'
// import { createEventDefinition } from 'ts-bus'
import { startListenService, taskListenHear } from './listen'
import { startWakeService, taskWakeCheck, taskWakeWoke } from './wake'
import { startRecordService, taskRecordDone, taskRecordStart } from './record'
import { startTranscribeService, taskTranscribeStart } from './transcribe'

const { bus } = startBusService()
startListenService(bus)

startWakeService(bus)
bus.subscribe(taskListenHear, ({ payload: { frame } }) => {
  bus.publish(taskWakeCheck({ frame, log: 'debug' }))
})

startRecordService(bus)
bus.subscribe(taskWakeWoke, () => {
  bus.publish(taskRecordStart({ filepath: '/tmp/test.wav' }))
})

startTranscribeService(bus)
bus.subscribe(taskRecordDone, ({ payload: { filepath } }) => {
  bus.publish(taskTranscribeStart({ filepath }))
})

// instruct service - translates text into instructions

// intent services - translates text into intent



// LISTEN SERVICE
// ------------------------------------------------------------

// const taskListenService =
//   createEventDefinition<BaseTask & Record<string, any>>()('task.listen.service')
// const taskListenStart =
//   createEventDefinition<BaseTask & { recorder: any }>()('task.listen.start')
// const taskListenHear =
//   createEventDefinition<BaseTask & { frame: any }>()('task.listen.hear')

// // @picovoice/pvrecorder-node
// // https://github.com/Picovoice/pvrecorder
// import { PvRecorder } from '@picovoice/pvrecorder-node'
// let recorder;
// try {
//   const devices: string[] = PvRecorder.getAvailableDevices()
//   const primaryMic = devices.findIndex(s => s === 'MacBook Pro Microphone')
//   console.log(devices, primaryMic)
//   bus.publish(taskListenService({ data: { devices, primaryMic }, log: 'info' }))

//   recorder = new PvRecorder(512)
// } catch (err) {
//   bus.publish(taskListenService({ err: (err as Error), log: 'error' }))
//   process.exit()
// }

// // recorder.read() sends to porcupine
// async function pvRecorderListening() {
//   bus.publish(taskListenService({ msg: 'starting listening...' }))
//   try {
//     recorder.start()
//     bus.publish(taskListenStart({ recorder }))
//   } catch (err) {
//     bus.publish(taskListenStart({ recorder, err }))
//   }
//   while (recorder.isRecording) {
//     const frame = await recorder.read()
//     bus.publish(taskListenHear({ frame, log: 'debug' }))
//   }
// }
// pvRecorderListening()
//   .then(r => console.log('listening finished'))
//   .catch(r => console.error('listening failed', r))

// // WAKE SERVICE
// // ------------------------------------------------------------

// // wakeword-zero - no types

// // @mathquis/node-personal-wakeword - not enough docs? how to hook up mic?
// // import WakewordDetector from '@mathquis/node-personal-wakeword';
// // import Mic

// const taskWakeService =
//   createEventDefinition<BaseTask & {}>()('task.wake.service')
// const taskWakeCheck =
//   createEventDefinition<BaseTask & { frame: any }>()('task.wake.check')
// const taskWakeWoke =
//   createEventDefinition<{ keywordIndexFound }>()('task.wake.woke')

// // @picovoice/porcupine-node!
// import { Porcupine } from '@picovoice/porcupine-node';
// const accessKey = "kiTh4AlTnCHsuLjeKEAVB/ilF7LAKz4SS/3Grl1fcvDlbWqo/hau0Q=="

// const porcupine = new Porcupine(
//   accessKey,
//   ['./porc/hey-shade_en_mac_v3_0_0.ppn'],
//   [0.5]
// )

// bus.subscribe(taskListenHear, ({ payload: { frame } }) => {
//   bus.publish(taskWakeCheck({ frame, log: 'debug' }))
// })

// bus.subscribe(taskWakeCheck, ({ payload: { frame } }) => {
//   try {
//     const keywordIndexFound = porcupine.process(frame)
//     if (keywordIndexFound >= 0) bus.publish(taskWakeWoke({ keywordIndexFound }))
//   } catch (err) {
//     bus.publish(taskWakeService({ err, log: 'error' }))
//   }
// })

// RECORDER SERVICE
// ------------------------------------------------------------

// 
// recorder waits for the ww trigger, then records until quiet
// and sends out recorded sound filepath
// import record from 'node-record-lpcm16'
// import * as fs from 'node:fs'

// const taskRecordService =
//   createEventDefinition<BaseTask & Record<any, any>>()('task.record.service')
// const taskRecordStart =
//   createEventDefinition<BaseTask & { filepath: string }>()('task.record.start')
// const taskRecordDone =
//   createEventDefinition<BaseTask & { filepath: string }>()('task.record.done')

// bus.subscribe(taskWakeWoke, () => {
//   bus.publish(taskRecordStart({ filepath: '/tmp/test.wav' }))
// })

// // bus.subscribe(taskWakeWoke, ({ payload: { keywordIndexFound: keywordFound } }) => {
// bus.subscribe(taskRecordStart, ({ payload: { filepath } }) => {
//   // const filepath = '/tmp/test.wav'
//   try {
//     const file = fs.createWriteStream(filepath, { encoding: 'binary' })
//     const recording = record.record({
//       sampleRate: 16000,
//       // sampleRate: 44100,
//       verbose: true,
//       endOnSilence: true,
//       silence: '2.0'
//     })
//     // bus.publish(taskRecordService({ filepath }))

//     recording
//       .stream()
//       .on('err', err => bus.publish(taskRecordService({ log: 'error', err, filepath })))
//       // .on('data', data => lgr.debug({ data }))
//       .pipe(file)

//     setTimeout(() => recording.stop(), 5000)

//     file.on('close', r => {
//       bus.publish(taskRecordDone({ filepath }))
//     })
//   } catch (err) {
//     bus.publish(taskRecordService({ log: 'error', err: err.toString() }))
//   }
// })


// TRANSCRIPTION SERVICE
// ------------------------------------------------------------

// whisper for STT
// import { nodewhisper } from 'nodejs-whisper'
// import { createClient } from '@deepgram/sdk'
import { AssemblyAI } from 'assemblyai'

// import { startRecordService, taskRecordDone } from './record'
// import { startTranscribeService, taskTranscribeStart } from './transcribe'
// import { startListenService } from './listen'


// const taskTranscribeService =
//   createEventDefinition<BaseTask & {}>()('task.transcribe.service')
// const taskTranscribeStart =
//   createEventDefinition<BaseTask & { filepath: string }>()('task.transcribe.start')
// const taskTranscribeDone =
//   createEventDefinition<BaseTask & { transcription: string }>()('task.transcribe.done')

// bus.subscribe(taskRecordDone, async ({ payload: { filepath } }) => {
//   bus.publish(taskTranscribeStart({ filepath }))
// })



// const audioUrl =
//   'https://storage.googleapis.com/aai-web-samples/5_common_sports_injuries.mp3'

// const config = {
//   audio_url: audioUrl
// }

// bus.subscribe(taskTranscribeStart, async ({ payload: { filepath } }) => {
//   const client = new AssemblyAI({
//     apiKey: "0b652a5d92964a94b49305c8c4648801"
//   })

//   try {
//     const transcription = await client.transcripts.transcribe({
//       audio_url: filepath
//     })
//     // console.log(transcript.text)
//     bus.publish(taskTranscribeDone({ transcription: transcription.text || '' }))
//   } catch (err) {
//     console.log(err)
//     bus.publish(taskTranscribeService({ err }))
//   }
// })


// bus.subscribe(taskTranscribeStart, async ({ payload: { filepath } }) => {
//   const deepgram = createClient('1d7f5a0efa419590b202ae91d0671c22afbddc79')
//   const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
//     fs.readFileSync(filepath),
//     {
//       // model: 'whisper-model',
//       model: 'nova-2',
//       language: 'en-US',
//       smart_format: true,
//     }
//   )
//   if (error) {
//     bus.publish(taskTranscribeService({ err: error }))
//   } else if (!error && result) {
//     bus.publish(taskTranscribeDone({ transcription: JSON.stringify(result) }))
//   }
// })


// bus.subscribe(taskTranscribeStart, async ({ payload: { filepath } }) => {
//   const transcription = await nodewhisper(filepath, {
//     modelName: 'base.en',
//     autoDownloadModelName: 'base.en',
//     // withCuda: true,
//   })
//   bus.publish(taskTranscribeDone({ transcription }))
// })




// function taskWakeCheck(arg0: { frame: any; log: string }): any {
//   throw new Error('Function not implemented.')
// }
// the ollama outbound api

// zigbee controller

// web ui - express or effect?

// lgr.info('Main.ts finished.')

// while (true) { }