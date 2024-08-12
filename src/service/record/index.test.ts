import { startBusService } from '../bus'
import { taskRecordStart } from '.'

const { bus } = startBusService()

bus.publish(taskRecordStart({ filepath: '/tmp/test.wav' }))