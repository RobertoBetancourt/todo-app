import React from 'react'
// Apollo Client
import { useMutation } from '@apollo/client'
// Material UI
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Grid,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material'
// date-fns
import { format } from 'date-fns'
// Material Icons
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
// Mutations
import { TOGGLE_TODO_COMPLETED } from '../Mutations/Mutations'
// Queries
import { GET_ALL_TODOS } from '../Queries/Queries'

const ToDoCard = ({ info, navigate, setOpen, setIdToDelete }) => {
  const handleDelete = () => {
    setIdToDelete(info.id)
    setOpen(true)
  }

  const handleToggle = () => {
    toggleToDoCompleted({
      variables: {
        data: {
          id: info.id,
          completedDate: new Date(Date.now())
        }
      }
    })
  }

  const [toggleToDoCompleted] = useMutation(TOGGLE_TODO_COMPLETED, {
    refetchQueries: [
      { query: GET_ALL_TODOS }
    ],
    awaitRefetchQueries: true
  })

  const dueDate = new Date(info?.dueDate)
  const completedDate = new Date(info?.completedDate)

  return (
    <Card sx={{ minWidth: 275, mb: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={1}>
            <Tooltip title={info.completed ? 'Quitar como completada' : 'Marcar como completada'}>
              <IconButton onClick={handleToggle}>
                {info.completed ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs={11}>
            <Typography variant='h5' sx={{ mb: 0 }}>{info.title}</Typography>
            {!info.completed &&
              <Typography
                color='primary'
                variant='subtitle2'
                sx={{ fontSize: 13, mb: 1 }}
                gutterBottom
              >
                {`Fecha límite: ${format(new Date(dueDate.valueOf() + dueDate.getTimezoneOffset() * 60 * 1000), 'dd/MM/yyyy')}`}
              </Typography>}
            {info.completed &&
              <Typography
                variant='subtitle2'
                color='primary'
                sx={{ fontSize: 13, mb: 1 }}
                gutterBottom
              >
                {`Tarea completada el ${format(new Date(completedDate.valueOf() + completedDate.getTimezoneOffset() * 60 * 1000), 'dd/MM/yyyy')}`}
              </Typography>}
            <Typography variant='body1'>{info.content}</Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          onClick={() => navigate(`editar-todo/${info.id}`)}
          variant='outlined'
          size='small'
        >
          Editar
        </Button>
        <Button
          onClick={handleDelete}
          variant='outlined'
          color='error'
          size='small'
        >
          Eliminar
        </Button>
      </CardActions>
    </Card>
  )
}

export default ToDoCard
