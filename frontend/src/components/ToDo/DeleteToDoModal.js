import React from 'react'
// Apollo Client
import { useMutation } from '@apollo/client'
// Material UI
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material'
// Mutations
import { DELETE_TODO } from '../Mutations/Mutations'
// Notistack
import { useSnackbar } from 'notistack'
// Queries
import { GET_ALL_TODOS } from '../Queries/Queries'

const DeleteToDoModal = ({ id, open, setOpen }) => {
  const { enqueueSnackbar } = useSnackbar()

  const handleClose = () => {
    setOpen(false)
  }

  const handleDelete = () => {
    deleteToDo({
      variables: {
        data: {
          id
        }
      }
    })
  }

  const handleOnCompleted = () => {
    handleClose()
    enqueueSnackbar(
      'To-do eliminado exitosamente',
      { variant: 'success' }
    )
  }

  const handleError = (error) => {
    const errorMessage = error?.graphQLErrors[0]?.message
    enqueueSnackbar(errorMessage || 'No fue posible eliminar el to-do', { variant: 'error' })
  }

  const [deleteToDo] = useMutation(DELETE_TODO, {
    onCompleted: handleOnCompleted,
    onError: handleError,
    refetchQueries: [
      { query: GET_ALL_TODOS }
    ],
    awaitRefetchQueries: true
  })

  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>
        ¿Estás seguro de que deseas eliminar el to-do?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Esta acción no se puede deshacer.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          Cancelar
        </Button>
        <Button variant='outlined' color='error' onClick={handleDelete}>
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteToDoModal
