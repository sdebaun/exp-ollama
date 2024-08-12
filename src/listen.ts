import { PvRecorder } from '@picovoice/pvrecorder-node'
import { createEventDefinition, EventBus } from 'ts-bus';
import { BaseTask } from './bus';

const taskListenService =
  createEventDefinition<BaseTask & Record<string, any>>()('task.listen.service')
const taskListenStart =
  createEventDefinition<BaseTask & { recorder: any }>()('task.listen.start')
export const taskListenHear =
  createEventDefinition<BaseTask & { frame: any }>()('task.listen.hear')

export const startListenService = (bus: EventBus) => {
  // @picovoice/pvrecorder-node
  // https://github.com/Picovoice/pvrecorder
  let recorder;
  try {
    const devices: string[] = PvRecorder.getAvailableDevices()
    const primaryMic = devices.findIndex(s => s === 'MacBook Pro Microphone')
    console.log(devices, primaryMic)
    bus.publish(taskListenService({ data: { devices, primaryMic } }))

    recorder = new PvRecorder(512)
  } catch (err) {
    bus.publish(taskListenService({ err: (err as Error), log: 'error' }))
    process.exit()
  }

  // recorder.read() sends to porcupine
  async function pvRecorderListening() {
    bus.publish(taskListenService({ msg: 'starting listening...' }))
    try {
      recorder.start()
      bus.publish(taskListenStart({ recorder }))
    } catch (err) {
      bus.publish(taskListenStart({ recorder, err }))
    }
    while (recorder.isRecording) {
      const frame = await recorder.read()
      bus.publish(taskListenHear({ frame, log: 'debug' }))
    }
  }
  pvRecorderListening()
    .then(r => bus.publish(taskListenService({ msg: '...listening finished' })))
    .catch(err => bus.publish(taskListenService({ msg: '...listening FAILED', err })))
}

