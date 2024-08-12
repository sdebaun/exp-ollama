import record from 'node-record-lpcm16'
import fs from 'fs'
import { createEventDefinition, EventBus } from 'ts-bus'
import { BaseTask } from './bus'

export const taskRecordService =
  createEventDefinition<BaseTask & Record<any, any>>()('task.record.service')
export const taskRecordStart =
  createEventDefinition<BaseTask & { filepath: string }>()('task.record.start')
export const taskRecordDone =
  createEventDefinition<BaseTask & { filepath: string }>()('task.record.done')

export const startRecordService = (bus: EventBus) => {
  bus.subscribe(taskRecordStart, ({ payload: { filepath } }) => {
    try {
      const file = fs.createWriteStream(filepath, { encoding: 'binary' })
      const options = {
        sampleRate: 16000,
        // sampleRate: 44100,
        // verbose: true,
        endOnSilence: true,
        // threshold: 5.0,
        // thresholdStart: 0.1,
        thresholdEnd: '0.2',
        silence: '2.0'
      }
      const recording = record.record(options)
      bus.publish(taskRecordService({ filepath, options }))

      recording
        .stream()
        .on('err', err => bus.publish(taskRecordService({ log: 'error', err, filepath })))
        .on('data', data => bus.publish(taskRecordService({ log: 'debug', data })))
        .pipe(file)

      // setTimeout(() => recording.stop(), 3000)

      file.on('close', r => {
        bus.publish(taskRecordDone({ filepath }))
      })
    } catch (err) {
      bus.publish(taskRecordService({ log: 'error', err: err.toString() }))
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

