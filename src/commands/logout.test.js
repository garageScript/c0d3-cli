import logout from './logout'
import { promises as fsPromises } from 'fs'

jest.mock('fs', () => {
  return {
    promises: {
      rmdir: jest.fn(),
    }
  }
})

describe('c0d3 logout', () => {
  test('Should delete .c0d3 folder', () => {
    fsPromises.rmdir.mockResolvedValue()
    expect(logout()).resolves.toBe(undefined)
    expect(fsPromises.rmdir).toBeCalled()
  })

  test('Should throw error', () => {
    fsPromises.rmdir.mockRejectedValue('sdf')
    expect(logout())
    expect(fsPromises.rmdir).toBeCalled()
  })
})