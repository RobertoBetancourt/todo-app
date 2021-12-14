const { gql } = require('graphql-request')

const LOGIN = gql`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      token
      user {
        id
        name
        email
      }
    }
  }
`

const SIGN_UP = gql`
  mutation SignUp($data: SignUpInput!) {
    signUp(data: $data) {
      token
      user {
        id
        name
        email
      }
    }
  }
`

const UPSERT_TODO = gql`
  mutation UpsertToDo($data: UpsertToDoInput!) {
    upsertToDo(data: $data) {
      id
      active
      createdAt
      title
      content
      completed
    }
  }
`

const TOGGLE_TODO_COMPLETED = gql`
  mutation ToggleToDoCompleted($data: ToggleToDoCompletedInput!) {
    toggleToDoCompleted(data: $data) {
      id
      title
      completed
    }
  }
`

module.exports = {
  LOGIN,
  SIGN_UP,
  UPSERT_TODO,
  TOGGLE_TODO_COMPLETED
}
