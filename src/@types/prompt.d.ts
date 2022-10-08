export interface Challenge {
  id: number
  order: number
  title: string
}

export interface Lesson {
  id: number
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
  lessonId: number
  challengeId: number
  lessonOrder: string
  challengeOrder: number
}>

export type AskForConfirmation = (message: string) => Promise<Question>

export type Question = { question: boolean }
