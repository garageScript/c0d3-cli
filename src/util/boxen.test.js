import { displayBoxUI } from './boxen'

describe('displayBoxUI', () => {
  test('Should display text', () => {
    expect(displayBoxUI('fakeText')).toBe(undefined)
  })
})
