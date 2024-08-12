import { Porcupine } from '@picovoice/porcupine-node';
import { createEventDefinition, EventBus } from 'ts-bus';
import { BaseTask } from '../bus';

const taskWakeService =
  createEventDefinition<BaseTask & {}>()('task.wake.service')
export const taskWakeCheck =
  createEventDefinition<BaseTask & { frame: any }>()('task.wake.check')
export const taskWakeWoke =
  createEventDefinition<{ keywordIndexFound }>()('task.wake.woke')

const accessKey = "kiTh4AlTnCHsuLjeKEAVB/ilF7LAKz4SS/3Grl1fcvDlbWqo/hau0Q=="
const porcupine = new Porcupine(
  accessKey,
  ['./porc/hey-shade_en_mac_v3_0_0.ppn'],
  [0.5]
)

export const startWakeService = (bus: EventBus) => {
  bus.subscribe(taskWakeCheck, ({ payload: { frame } }) => {
    try {
      const keywordIndexFound = porcupine.process(frame)
      if (keywordIndexFound >= 0) bus.publish(taskWakeWoke({ keywordIndexFound }))
    } catch (err) {
      bus.publish(taskWakeService({ err, log: 'error' }))
    }
  })
}
