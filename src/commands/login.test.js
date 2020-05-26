import login from './login'
import { saveToken } from '../util/credentials'

jest.mock('../util/prompt')
jest.mock('../util/credentials')

describe('c0d3 login', () => {
  test('should not throw error', async () => {
    const res = await login({ url: 'fakeUrl' })
    expect(res).toBe(undefined)
  })

  test('should throw error', () => {
    saveToken.mockRejectedValue()
    expect(login({url: 'fakeUrl'})).rejects.toThrowError()
  })
})
