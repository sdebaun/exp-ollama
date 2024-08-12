import { EventBus } from "ts-bus";
import pino from 'pino'

export { createEventDefinition, EventBus } from 'ts-bus'

export type BaseTask = {
  log?: 'info' | 'debug' | 'error';
  err?: Error;
  msg?: string;
};

// const lgr = pino()
// // lgr.info({ msg: 'pino logging started' })

// const bus = new EventBus();

// bus.subscribe('**', e => {
//   // console.log(e)
//   if (e.payload.log === 'debug') lgr.debug(e)
//   else if (e.payload.log === 'error') lgr.error(e)
//   else lgr.info(e)
// })

export const startBusService = () => {
  const lgr = pino()
  // lgr.info({ msg: 'pino logging started' })

  const bus = new EventBus();

  bus.subscribe('**', e => {
    // console.log(e)
    if (e.payload.log === 'debug') lgr.debug(e)
    else if (e.payload.log === 'error') lgr.error(e)
    else lgr.info(e)
  })

  return { bus }
}

// export { bus }