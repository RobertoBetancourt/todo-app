import React from 'react'
import { useForm } from 'react-hook-form'
// Material UI
import { Avatar, Box, Button, Container, Typography } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
// Utils
import { CustomInput, useCustomController } from '../Utils/utils'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../Mutations/Mutations'
// React Router
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'

const Login = (props) => {
  const { control, handleSubmit } = useForm()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const onSubmit = (data) => {
    login({ variables: { data } })
  }

  const handleOnCompleted = (data) => {
    const token = data?.login?.token
    localStorage.setItem('todo-token', token)
    navigate('/')
  }

  const handleError = (error) => {
    const errorMessage = error?.graphQLErrors[0]?.message
    enqueueSnackbar(errorMessage || 'Las credenciales no son correctas', { variant: 'error' })
  }

  const [login] = useMutation(LOGIN, {
    onCompleted: handleOnCompleted,
    onError: handleError
  })

  const form = {
    email: useCustomController({
      name: 'email',
      control,
      rules: { required: 'El email es requerido' },
      label: 'Correo'
    }),
    password: useCustomController({
      name: 'password',
      control,
      rules: { required: 'La contraseña es requerida' },
      label: 'Contraseña',
      type: 'password'
    })
  }

  return (
    <Container component='main' maxWidth='xs'>
      <Box
        sx={{
          height: '85vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant='h5' style={{ margin: '1rem' }}>
          Iniciar sesión
        </Typography>
        <CustomInput
          form={form}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          button='Iniciar sesión'
        />
        <Button
          onClick={() => navigate('/registro')}
          fullWidth
          sx={{ mt: 2 }}
        >
          ¿No tienes cuenta? Regístrate
        </Button>
      </Box>
    </Container>
  )
}

export default Login
