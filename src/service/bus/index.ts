import { createEventDefinition, EventBus } from "ts-bus";
import pino from 'pino'

export { createEventDefinition, EventBus } from 'ts-bus'

export type BaseTask = {
  log?: 'info' | 'debug' | 'error';
  err?: Error;
  msg?: string;
};

export const taskBaseService =
  createEventDefinition<BaseTask & Record<any, any>>()('task.base.service')

export const startBusService = () => {
  const lgr = pino()

  const bus = new EventBus();

  bus.subscribe('**', e => {
    if (e.payload.log === 'debug') lgr.debug(e)
    else if (e.payload.log === 'error') lgr.error(e)
    else lgr.info(e)
  })

  bus.publish(taskBaseService({ msg: 'Base service started with pino and bus.' }))
  return { bus }
}