import React from 'react'
import { useForm } from 'react-hook-form'
// Material UI
import { Avatar, Box, Button, Container, Typography } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
// Utils
import { CustomInput, useCustomController } from '../Utils/utils'
import { useMutation } from '@apollo/client'
import { SIGN_UP } from '../Mutations/Mutations'
// React Router
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'

const SignUp = (props) => {
  const { control, handleSubmit } = useForm()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const onSubmit = (data) => {
    signUp({ variables: { data } })
  }

  const handleOnCompleted = () => {
    navigate('/iniciar-sesion')
    enqueueSnackbar('El registro fue exitoso', { variant: 'success' })
  }

  const handleError = (error) => {
    const errorMessage = error?.graphQLErrors[0]?.message
    enqueueSnackbar(errorMessage || 'El registro no fue exitoso', { variant: 'error' })
  }

  const [signUp] = useMutation(SIGN_UP, {
    onCompleted: handleOnCompleted,
    onError: handleError
  })

  const form = {
    name: useCustomController({
      name: 'name',
      control,
      rules: { required: 'El nombre es requerido' },
      label: 'Nombre'
    }),
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
          height: '95vh',
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
          Registro
        </Typography>
        <CustomInput
          form={form}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          button='Registrarse'
        />
        <Button
          onClick={() => navigate('/iniciar-sesion')}
          fullWidth
          sx={{ mt: 2 }}
        >
          ¿Ya tienes cuenta? Inicia sesión
        </Button>
      </Box>
    </Container>
  )
}

export default SignUp
