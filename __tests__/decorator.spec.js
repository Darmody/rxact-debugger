import { StateStream } from 'rxact'
import { decorator } from '../src/index'
import debuggerExample from './shared/debugger.example'
import optionExample from './shared/option.example'

describe('decorator', () => {
  debuggerExample(decorator()(StateStream), [])
  optionExample(() => () => {}, decorator)
})
