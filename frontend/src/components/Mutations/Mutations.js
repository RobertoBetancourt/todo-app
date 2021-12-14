import { gql } from '@apollo/client'

export const LOGIN = gql`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      token
    }
  }
`

export const SIGN_UP = gql`
  mutation Mutation($data: SignUpInput!) {
    signUp(data: $data) {
      user {
        id
      }
    }
  }
`

export const UPSERT_TODO = gql`
  mutation UpsertToDo($data: UpsertToDoInput!) {
    upsertToDo(data: $data) {
      id
      active
      createdAt
      updatedAt
      title
      content
    }
  }
`

export const DELETE_TODO = gql`
  mutation DeleteToDo($data: DeleteToDoInput!) {
    deleteToDo(data: $data) {
      id    
    }
  }
`

export const TOGGLE_TODO_COMPLETED = gql`
  mutation ToggleToDoCompleted($data: ToggleToDoCompletedInput!) {
    toggleToDoCompleted(data: $data) {
      id
    }
  }
`
