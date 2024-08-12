import { startBusService } from './bus'
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
