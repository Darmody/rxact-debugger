// @flow
import { StateStream } from 'rxact'
import {
  operatorLogger,
  emitterLogger,
} from './logger'
import {
  isOperator,
  isEmitter,
  isDispose,
  isDebugger,
  isPresent,
} from './helpers'

export const clean = () => {
  window.rxactDebugger = undefined
}

function createDebuggerProxy(instance) {
  const streamName = instance.streamName
  const handler = {
    get: (target, prop) => {
      if (isDebugger(prop)) {
        return {
          start: () => {
            this.isStarted = true
          },
          stop: () => {
            this.isStarted = false
          }
        }
      }

      let type = 'operator'

      if (!isPresent(target, prop)) {
        console.warn(`Operator does not exist: ${streamName}.${prop}`)
      }
      if (!isOperator(target, prop) || isEmitter(target.emitters, prop)) {
        return target[prop]
      }

      if (isDispose(prop)) {
        type = 'dispose'
      }

      return (...params) => {
        if (this.isStarted) {
          operatorLogger(type, 'log', streamName, prop)
        }

        return target[prop](...params)
      }
    },
    set: (target, prop, value) => {
      if (target[prop]) {
        console.warn(`Operator redefined: ${streamName}.${prop}`)
      }
      target[prop] = value

      return true
    },
  }

  return new Proxy(instance, handler)
}

function createEmitterProxy(instance) {
  const handler = {
    apply: (target, thisArg, argumentsList) => {
      const [name, emitter] = argumentsList

      const loggableEmitter = (...params) => prevState => {
        const nextState = emitter(...params)(prevState)

        if (this.isStarted) {
          emitterLogger(instance.streamName, name, prevState, nextState)
        }

        return nextState
      }

      return target.call(thisArg, name, loggableEmitter)
    }
  }

  return new Proxy(instance.emitter, handler)
}

export type Options = {
  start?: Boolean | Array<string>,
}

const isStartDefault = (start, stream) => start === true || (Array.isArray(start) &&
  start.find(item => item === stream))

const defaultOptions = {
  start: false,
}

const rxactDebugger = (options: Options = {}) =>  {
  if (typeof options !== 'object' || Array.isArray(options)) {
    throw new Error('rxact-debugger: Expect options to be an object.')
  }

  return (instance: StateStream) => {
    const finalOptions = { ...defaultOptions, ...options }
    const { start } = finalOptions
    const startDefault = isStartDefault(start, instance.streamName)
    const context = {
      isStarted: false
    }

    const debuggableProxy = createDebuggerProxy.call(context, instance)
    const emitterProxy = createEmitterProxy.call(context, instance)

    instance.emitter = emitterProxy

    if (!window.rxactDebugger) {
      window.rxactDebugger = {}
    }
    window.rxactDebugger[instance.streamName] = debuggableProxy

    if (startDefault) {
      debuggableProxy.debugger.start()
    }

    return debuggableProxy
  }
}

export default rxactDebugger
