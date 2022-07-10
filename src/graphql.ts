export const GET_LESSONS = `
  query getLesson {
    lessons {
      id
      title
      challenges {
        id
        title
        order
      }
      order
    }
  }
`
export const IS_TOKEN_VALID = `
  query isTokenValid($cliToken: String!) {
    isTokenValid(cliToken: $cliToken)
  }
`
export const GET_CLI_TOKEN = `
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password){
      cliToken
    }
  }
`
export const POST_SUBMISSION = `
  mutation createSubmission(
    $lessonId: Int!
    $challengeId: Int!
    $diff: String!
  ) {
    createSubmission(
      lessonId: $lessonId
      challengeId: $challengeId
      diff: $diff
    ) {
      id
      diff
    }
  }
`
