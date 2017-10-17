import Rx from 'rxjs'
import { setup, teardown } from 'rxact'
import { Map } from 'immutable'
import { clean } from '../../src/debugger'

export default (StateStream, plugins) => {
  describe('Debugger', () => {
    beforeEach(() => {
      window.console.warn = jest.fn()
      window.console.log = jest.fn()
      window.console.group = jest.fn()
      window.console.groupCollapsed = jest.fn()
      window.console.groupEnd = jest.fn()

      setup({
        Observable: Rx.Observable,
        plugins,
        StateStream,
      })
    })

    afterEach(() => {
      window.console.warn.mockRestore()
      window.console.log.mockRestore()
      window.console.group.mockRestore()
      window.console.groupCollapsed.mockRestore()
      window.console.groupEnd.mockRestore()

      teardown()
    })

    it('store stateStreams into window', () => {
      const stream1 = new StateStream('stream1')
      const stream2 = new StateStream('stream2')

      expect(window.rxactDebugger[stream1.streamName]).toBeDefined()
      expect(window.rxactDebugger[stream2.streamName]).toBeDefined()
    })

    it('add debugger to stateStream instance', () => {
      const stream = new StateStream('stream')
      expect(stream.debugger).toBeDefined()
    })

    it('emitter logging', () => {
      const stream = new StateStream('stream', 0)

      stream.emitter('emitter1', value => prevState => (prevState + value))
      stream.debugger.start()
      stream.emitter(1)
      stream.emitters.emitter1(1)

      expect(window.console.log.mock.calls).toMatchSnapshot()
      expect(window.console.groupCollapsed.mock.calls).toMatchSnapshot()
    })

    it('operator logging', () => {
      const stream = new StateStream('stream', 0)
      stream.operator1 = () => {}
      stream.debugger.start()
      stream.operator1()

      expect(window.console.log.mock.calls).toMatchSnapshot()
    })

    it('keep operator behavior as same as before', () => {
      const stream = new StateStream('stream', 0)
      stream.operator1 = (value) => value
      stream.debugger.start()
      const value = stream.operator1(1)

      expect(value).toEqual(1)
    })

    it('dispose logging', () => {
      const stream = new StateStream('stream', 0)
      stream.debugger.start()
      stream.dispose()
      expect(window.console.log.mock.calls).toMatchSnapshot()
    })

    it('skip debugging black list methods', () => {
      const stream = new StateStream('stream', 0)
      stream.debugger.start()
      stream.next(() => 1)
      stream.eventRunner(e$ => e$)
      stream.getState()
      stream.emitter('emitter1', () => () => 1)

      expect(window.console.log.mock.calls).toEqual([])
      expect(window.console.groupCollapsed.mock.calls).toEqual([])
    })

    it('stop logging', () => {
      const stream = new StateStream('stream', 0)

      const mockSubscriber = jest.fn()
      stream.state$.subscribe(mockSubscriber)
      stream.emitter('emitter1', value => prevState => (prevState + value))
      stream.operator = (value) => (value)
      stream.debugger.start()
      stream.emitter1(1)
      stream.debugger.stop()
      stream.emitter1(1)
      const value = stream.operator(1)

      expect(value).toEqual(1)
      expect(window.console.log.mock.calls).toMatchSnapshot()
      expect(window.console.groupCollapsed.mock.calls).toMatchSnapshot()
      expect(mockSubscriber.mock.calls).toEqual([[0], [1], [2]])
    })

    it('clean', () => {
      expect(window.rxactDebugger).toBeDefined()
      clean()
      expect(window.rxactDebugger).not.toBeDefined()
    })

    it('operator redefine', () => {
      const stream = new StateStream('stream', 0)

      stream.operator = (value) => (value)
      stream.operator = (value) => (value)

      expect(window.console.warn.mock.calls).toMatchSnapshot()
    })

    it('operator does not exist', () => {
      const stream = new StateStream('stream', 0)

      stream.operator

      expect(window.console.warn.mock.calls).toMatchSnapshot()
    })

    it('work with Immutable', () => {
      const stream = new StateStream('stream', Map({ state: 0 }))
      stream.emitter('emitter1', () => state => state)
      stream.debugger.start()
      stream.emitter1()

      expect(window.console.log.mock.calls).toMatchSnapshot()
    })
  })
}
