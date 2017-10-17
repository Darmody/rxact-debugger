// @flow
import type { StateStream } from 'rxact'
import type { Options } from './debugger'
import rxactDebugger, { clean } from './debugger'

const plugin = rxactDebugger
const decorator = (options: Options) => {
  const debuggerPlugin = rxactDebugger(options)

  return (StateStream: StateStream) => {
    return class DebuggableStream extends StateStream {
      constructor(...params: Array<any>) {
        const instance = super(...params)

        return debuggerPlugin(instance)
      }
    }
  }
}

export {
  plugin,
  decorator,
  clean,
}
