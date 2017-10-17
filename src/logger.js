// @flow
const BOLD = 'font-weight:bold;'
const UNDERLINE = 'text-decoration:underline;'
const COLOR = color => `color:${color};`

const toObject = (state) => {
  if (state.toJS) {
    return state.toJS()
  }

  return state
}

export const operatorLogger = (
  type: string, logger: string = 'log', streamName: string, operatorName: string
) => {
  let prefix = ''
  let action = ''
  let color = ''

  switch (type) {
    case 'emitter': {
      prefix = 'STATE   '
      action = 'updated'
      color = '#3dbd7d'
      break
    }
    case 'dispose': {
      prefix = 'DISPOSE   '
      action = 'disposed'
      color = '#f04134'
      break
    }
    default: {
      prefix = 'OPERATOR'
      action = 'called '
      color = '#948aec'
      break
    }
  }

  console[logger](
    `%c${prefix} %c ${action}  %c${streamName}->${operatorName}`,
    BOLD + COLOR(color),
    BOLD + COLOR('#108ee9'),
    UNDERLINE + BOLD + COLOR('#5a5a5a'),
  )
}

const stateLog = (color, content, state) => {
  console.log(
    `%c${content}`,
    COLOR(color) + BOLD,
    state,
  )
}

export const emitterLogger = (
  streamName: string,
  emitterName: string,
  prevState: any,
  nextState: any,
) => {
  operatorLogger('emitter', 'groupCollapsed', streamName, emitterName)
  stateLog('#5a5a5a', 'prevState:', toObject(prevState))
  stateLog('#ffce3d', 'nextState:', toObject(nextState))
  console.groupEnd()
}
