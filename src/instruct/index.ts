import record from 'node-record-lpcm16'
import fs from 'fs'
import { createEventDefinition, EventBus } from 'ts-bus'
import { BaseTask } from '../bus'

export const taskInstructService =
  createEventDefinition<BaseTask & Record<any, any>>()('task.record.service')
export const taskInstructStart =
  createEventDefinition<BaseTask & { transcript: string }>()('task.record.start')
export const taskInstructDone =
  createEventDefinition<BaseTask & {}>()('task.record.done')

export const startInstructService = (bus: EventBus) => {
  // here is where we talk to ollama
  bus.subscribe(taskInstructStart, ({ payload: { transcript } }) => {
    try {
      // const file = fs.createWriteStream(filepath, { encoding: 'binary' })
      // const options = {
      //   sampleRate: 16000,
      //   // sampleRate: 44100,
      //   // verbose: true,
      //   endOnSilence: true,
      //   // threshold: 5.0,
      //   // thresholdStart: 0.1,
      //   thresholdEnd: '0.2',
      //   silence: '2.0'
      // }
      // const recording = record.record(options)
      // bus.publish(taskInstructService({ filepath, options }))

      // recording
      //   .stream()
      //   .on('err', err => bus.publish(taskInstructService({ log: 'error', err, filepath })))
      //   .on('data', data => bus.publish(taskInstructService({ log: 'debug', data })))
      //   .pipe(file)

      // // setTimeout(() => recording.stop(), 3000)

      // file.on('close', r => {
      //   bus.publish(taskInstructDone({ filepath }))
      // })
    } catch (err) {
      bus.publish(taskInstructService({ log: 'error', err: err.toString() }))
    }
  })
}

// bus.subscribe(taskRecordStart, ({ payload: { filepath } }) => {
//   try {
//     const file = fs.createWriteStream(filepath, { encoding: 'binary' })
//     const options = {
//       sampleRate: 16000,
//       // sampleRate: 44100,
//       // verbose: true,
//       endOnSilence: true,
//       // threshold: 5.0,
//       // thresholdStart: 0.1,
//       thresholdEnd: '0.2',
//       silence: '3.0'
//     }
//     const recording = record.record(options)
//     bus.publish(taskRecordService({ filepath, options }))

//     recording
//       .stream()
//       .on('err', err => bus.publish(taskRecordService({ log: 'error', err, filepath })))
//       .on('data', data => bus.publish(taskRecordService({ log: 'debug', data })))
//       .pipe(file)

//     // setTimeout(() => recording.stop(), 3000)

//     file.on('close', r => {
//       bus.publish(taskRecordDone({ filepath }))
//     })
//   } catch (err) {
//     bus.publish(taskRecordService({ log: 'error', err: err.toString() }))
//   }
// })

