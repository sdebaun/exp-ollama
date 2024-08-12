import { startBusService } from './service/bus'
import { startListenService, taskListenHear } from './service/listen'
import { startWakeService, taskWakeCheck, taskWakeWoke } from './service/wake'
import { startRecordService, taskRecordDone, taskRecordStart } from './service/record'
import { startTranscribeService, taskTranscribeStart } from './service/transcribe'

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

// now instruct service

// now webapi?
// now webapp?