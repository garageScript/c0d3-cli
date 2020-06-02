export interface Token {
  login: { cliToken: string }
  isTokenValid: boolean
}

export interface Credential {
  username: string
  password: string
}

export type VerifyToken = (url: string) => Promise<string>

export type GetToken = (credentials: Credential, url: string) => Promise<string>

export type SaveToken = (cliToken: string) => Promise<void>

export type CreateCredentialsFile = (cliToken: string) => Promise<void>
