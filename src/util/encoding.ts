/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const encode = (payload: any): string => {
  const payloadString = JSON.stringify(payload)
  const encodedString = Buffer.from(payloadString).toString('base64')
  return encodedString
}

export const decode = (payload: any): any => {
  const buff = Buffer.from(payload, 'base64')
  const decodedString = buff.toString('ascii')
  return JSON.parse(decodedString)
}
