// @flow
import type { StateStream } from 'rxact'

type Target = StateStream
type Emitters = {}
type Prop = string

export const METHOD_BLACK_LIST = [
  'constructor',
  'next',
  'eventRunner',
  'getState',
  'emitter',
]

export const isOperator = (target: Target, prop: Prop) =>
  typeof target[prop] === 'function' && !METHOD_BLACK_LIST.find(method => method === prop)
export const isEmitter = (emitters: Emitters, prop: Prop) => !!emitters[prop]
export const isDispose = (prop: Prop) => prop === 'dispose'
export const isDebugger = (prop: Prop) => prop === 'debugger'
export const isPresent = (target: Target, prop: Prop) => !!target[prop]
