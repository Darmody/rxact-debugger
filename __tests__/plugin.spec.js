import { StateStream } from 'rxact'
import { plugin } from '../src/index'
import debuggerExample from './shared/debugger.example'
import optionExample from './shared/option.example'

describe('plugin', () => {
  debuggerExample(StateStream, [plugin()])
  optionExample(plugin, () => Component => Component)
})
