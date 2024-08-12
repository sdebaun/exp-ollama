import { bus } from './bus'
import { taskRecordStart } from './record'

bus.publish(taskRecordStart({ filepath: '/tmp/test.wav' }))