import { BaseTask, createEventDefinition, EventBus } from "./bus"

const taskTranscribeService =
  createEventDefinition<BaseTask & {}>()('task.transcribe.service')
export const taskTranscribeStart =
  createEventDefinition<BaseTask & { filepath: string }>()('task.transcribe.start')
const taskTranscribeDone =
  createEventDefinition<BaseTask & { transcript: string }>()('task.transcribe.done')

// // with whisper
// import whisper from 'whisper-node'
// export const startTranscribeService = (bus: EventBus) => {
//   bus.subscribe(taskTranscribeStart, async ({ payload: { filepath } }) => {
//     try {
//       const transcript = await whisper(filepath, { modelName: 'tiny.en' })
//       bus.publish(taskTranscribeDone({ transcript }))

//     } catch (err) {
//       bus.publish(taskTranscribeService({ err }))
//     }
//   })
// }

// // with local xenova
// import { pipeline } from '@xenova/transformers';
// export const startTranscribeService = async (bus: EventBus) => {
//   bus.subscribe(taskTranscribeStart, async ({ payload: { filepath } }) => {
//     try {
//       let transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
//       const output = await transcriber(filepath)
//       bus.publish(taskTranscribeDone({ transcript: output.toString() }))
//     } catch (err) {
//       bus.publish(taskTranscribeService({ err }))
//     }
//   })
// }

// with deepgram
import { createClient } from '@deepgram/sdk'
import fs from 'fs'

export const startTranscribeService = async (bus: EventBus) => {
  bus.subscribe(taskTranscribeStart, async ({ payload: { filepath } }) => {
    const deepgram = createClient('1d7f5a0efa419590b202ae91d0671c22afbddc79')
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      fs.readFileSync(filepath),
      {
        // model: 'whisper-model',
        // INSUFFICIENT PERMISSIONS from whisper-model
        // model: 'nova-2',
        // ^ this one just sucks
        model: 'whisper',
        language: 'en-US',
        smart_format: true,
      }
    )
    if (error) {
      bus.publish(taskTranscribeService({ err: error }))
    } else if (!error && result) {
      // result.results.
      const transcript = result.results.channels[0].alternatives[0].transcript
      bus.publish(taskTranscribeDone({ transcript }))
    }
  })
}
