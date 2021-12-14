import React from 'react'
// Apollo Client
import { useQuery } from '@apollo/client'
// Components
import DeleteToDoModal from '../ToDo/DeleteToDoModal'
import SettingsMenu from '../Menu/Menu'
import ToDoCard from '../ToDo/ToDoCard'
// Material Icons
import AddCircleIcon from '@mui/icons-material/AddCircle'
// Material UI
import { Button, CircularProgress, Typography } from '@mui/material'
// Queries
import { GET_ALL_TODOS } from '../Queries/Queries'
// React Router
import { useNavigate } from 'react-router-dom'
// Utils
import { CustomContainer } from '../Utils/utils'

const Dashboard = () => {
  const { loading, error, data } = useQuery(GET_ALL_TODOS, { fetchPolicy: 'network-only' })
  const navigate = useNavigate()

  const [open, setOpen] = React.useState(false)
  const [idToDelete, setIdToDelete] = React.useState(null)

  if (loading) {
    return (
      <CustomContainer paddingTop={100}>
        <CircularProgress />
      </CustomContainer>
    )
  }

  if (error) {
    return (
      <CustomContainer paddingTop={100}>
        <Typography>Ha ocurrido un error</Typography>
      </CustomContainer>
    )
  }

  let toDos = []
  if (data) {
    toDos = data.getAllToDos
  }

  return (
    <>
      <DeleteToDoModal
        open={open}
        setOpen={setOpen}
        id={idToDelete}
      />
      <CustomContainer>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <Button
            variant='contained'
            startIcon={<AddCircleIcon />}
            onClick={() => navigate('/crear-todo')}
          >
            Crear to-do
          </Button>
          <SettingsMenu />
        </div>
        {
          toDos.length === 0 &&
            <Typography sx={{ mt: 8 }} variant='h4'>
              No hay to-dos en este momento
            </Typography>
        }
        {toDos.length > 0 &&
          toDos.map(toDo =>
            <ToDoCard
              key={toDo.id}
              info={toDo}
              navigate={navigate}
              setOpen={setOpen}
              setIdToDelete={setIdToDelete}
            />)}
      </CustomContainer>
    </>
  )
}

export default Dashboard
