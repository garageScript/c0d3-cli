export interface Challenge {
  id: string
  order: number
  title: string
}

export interface Lesson {
  id: string
  order: number
  title: string
  challenges: [Challenge]
}

export interface Choices {
  [key: string]: Lesson
}

export type GetMapFromOptions = (array: ArrayValue) => Choices

export type GetOptionDisplayStr = (array: ArrayValue) => string

export type ArrayValue = [Lesson | Challenge]

export type AskForChallenges = (
  lessons: [Lesson]
) => Promise<{
  lessonId: string
  challengeId: number
}>
