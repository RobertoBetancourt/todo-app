import { gql } from '@apollo/client'

export const GET_ALL_TODOS = gql`
  query GetAllToDos {
    getAllToDos {
      id
      active
      title
      content
      completed
      completedDate
      dueDate
    }
  }
`

export const GET_TO_DO = gql`
  query GetToDo($data: GetToDoInput!) {
    getToDo(data: $data) {
      id
      title
      content
      dueDate
    }
  }
`
