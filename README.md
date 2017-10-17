<h1 align="center">Rxact Debugger</h1>

[![npm version](https://img.shields.io/npm/v/rxact-debugger.svg?style=flat-square)](https://www.npmjs.com/package/rxact-debugger)
[![CircleCI master](https://img.shields.io/circleci/project/github/Darmody/rxact-debugger/master.svg?style=flat-square)](https://circleci.com/gh/Darmody/rxact-debugger/tree/master)
[![Coveralls github branch](https://img.shields.io/coveralls/github/Darmody/rxact-debugger/master.svg?style=flat-square)](https://coveralls.io/github/Darmody/rxact-debugger)

Debugger for Rxact.

[![screenshot](https://github.com/Darmody/rxact-debugger/blob/master/screenshot.png)](https://github.com/Darmody/rxact-debugger)

## Installation

```
  yarn add rxact
  yarn add rxact-debugger --dev
```

## Usage

There are two ways:

#### 1. Install as a plugin

```javascript
  import { setup, StateStream } from 'rxact'
  import { plugin as rxactDebugger } from 'rxact-debugger'

  setup({
    Observable: /** Observable lib you like **/,
    plugins: [rxactDebugger()],
  })

  const stream = new StateStream('stream', { name: 'rxact' })

  stream.debugger.start()
```

#### 2. Enhance StateStream

```javascript
  import { setup, StateStream } from 'rxact'
  import { decorator as rxactDebugger } from 'rxact-debugger'

  const EnhancedStateStream = decorator()(StateStream)

  setup({
    Observable: /** Observable lib you like **/,
    StateStream: EnhancedStateStream,
  })

  const stream = new EnhancedStateStream('stream', { name: 'rxact' })

  stream.debugger.start()
```

And you can access state streams in browser `developer console` via:

```javascript
  window.rxactDebugger.user // assume you have a stateStream named user
```

## API

#### plugin(options)

```javascript
  plugin(options: {
    start?: boolean | Array<stateStreamName: string>,
  })
```

Return a StateStream plugin.

* options: An object contain options.

  |    Property    | Type |          Description          | Default |
  | -------------  | ---- |          -----------          | ------- |
  | start  | bool/array | start logger default or not. If value is an array of name of state stream, it will only start logger of these state streams. | false |

#### decorator(options)

```javascript
  decorator(options: {
    start: ?boolean | Array<stateStreamName: string>,
  })
```

Return a function for wrapping StateStream.

* options: As same as plugin's options.

#### stateStream.debugger

```javascript
  stateStream.debugger: {
    start: Function,
    stop: Function,
  }
```

An debugger object, contains `start` and `stop` function.

* start: start logging.
* stop: stop logging.

## License

[MIT](https://github.com/Darmody/rxact-debugger/blob/master/LICENSE)
