import Rx from 'rxjs'
import { setup, teardown, StateStream } from 'rxact'

export default (plugin, decorator) => {
  describe('options', () => {
    beforeEach(() => {
      window.console.log = jest.fn()
      window.console.group = jest.fn()
      window.console.groupCollapsed = jest.fn()
      window.console.groupEnd = jest.fn()
    })

    afterEach(() => {
      window.console.log.mockRestore()
      window.console.group.mockRestore()
      window.console.groupCollapsed.mockRestore()
      window.console.groupEnd.mockRestore()

      teardown()
    })

    it('without options', () => {
      const TestStateStream = decorator()(StateStream)
      setup({
        StateStream: TestStateStream,
        Observable: Rx.Observable,
        plugins: [plugin()],
      })

      const stream = new TestStateStream('stream', 0)
      stream.emitter('emitter1', () => () => 1)
      stream.emitter1()

      expect(window.console.log.mock.calls).toEqual([])
    })

    it('throw error if options are invalid', () => {
      expect(() => {
        const TestStateStream = decorator('')(StateStream)
        setup({
          StateStream: TestStateStream,
          Observable: Rx.Observable,
          plugins: [plugin('')],
        })
      }).toThrow()

      expect(() => {
        const TestStateStream = decorator({})(StateStream)
        setup({
          Observable: Rx.Observable,
          plugins: [plugin({})],
          StateStream: TestStateStream,
        })
      }).not.toThrow()
    })

    it('start loggin on all streams', () => {
      const TestStateStream = decorator({ start: true })(StateStream)
      setup({
        StateStream: TestStateStream,
        Observable: Rx.Observable,
        plugins: [plugin({ start: true })],
      })

      const stream = new TestStateStream('stream', 0)
      stream.emitter('emitter1', () => () => 1)
      stream.emitter1()

      expect(window.console.log.mock.calls).toMatchSnapshot()
      expect(window.console.groupCollapsed.mock.calls).toMatchSnapshot()
    })

    it('start logging on part streams', () => {
      const TestStateStream = decorator({ start: ['test1'] })(StateStream)
      setup({
        StateStream: TestStateStream,
        Observable: Rx.Observable,
        plugins: [plugin({ start: ['test1'] })],
      })

      const test1 = new TestStateStream('test1', 0)
      const test2 = new TestStateStream('test2', 0)
      test1.emitter('emitter1', () => () => 1)
      test1.emitter1()
      test2.emitter('emitter2', () => () => 1)
      test2.emitter2()

      expect(window.console.log.mock.calls).toMatchSnapshot()
      expect(window.console.groupCollapsed.mock.calls).toMatchSnapshot()
    })
  })
}
