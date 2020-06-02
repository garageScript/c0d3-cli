import { Lesson } from './prompt'

export interface Submission {
  lessonId: string
  challengeId: string
  cliToken: string
  diff: string
}

export type GetLessons = (url: string) => Promise<[Lesson]>

export type SendSubmission = (
  url: string,
  submission: Submission
) => Promise<void>
