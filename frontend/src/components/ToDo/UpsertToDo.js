import React from 'react'
// Apollo Client
import { useMutation, useQuery } from '@apollo/client'
// Material UI
import { Card, CardContent, CircularProgress, Typography } from '@mui/material'
// Mutations
import { UPSERT_TODO } from '../Mutations/Mutations'
// Notistack
import { useSnackbar } from 'notistack'
// Queries
import { GET_ALL_TODOS, GET_TO_DO } from '../Queries/Queries'
// React Hook Form
import { useForm } from 'react-hook-form'
// React Router
import { useNavigate, useParams } from 'react-router-dom'
// Utils
import {
  CustomContainer,
  CustomInput,
  dateIsGreaterThanCurrent,
  useCustomController
} from '../Utils/utils'

const UpsertToDo = (props) => {
  const { control, handleSubmit } = useForm()
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const { toDo } = useParams()

  const { loading: loadingToDo, data } = useQuery(
    GET_TO_DO,
    {
      variables: { data: { id: parseInt(toDo) } },
      skip: !toDo
    }
  )

  const onSubmit = (data) => {
    upsertToDo({
      variables: {
        data: {
          id: toDo ? parseInt(toDo) : null,
          ...data
        }
      }
    })
  }

  const handleOnCompleted = (data) => {
    navigate('/')
    enqueueSnackbar(
      toDo ? 'To-do editado exitosamente' : 'To-do creado exitosamente',
      { variant: 'success' }
    )
  }

  const handleError = (error) => {
    const errorMessage = error?.graphQLErrors[0]?.message
    enqueueSnackbar(errorMessage || 'No fue posible crear el to-do', { variant: 'error' })
  }

  const [upsertToDo, { loading }] = useMutation(UPSERT_TODO, {
    onCompleted: handleOnCompleted,
    onError: handleError,
    refetchQueries: [
      { query: GET_ALL_TODOS }
    ],
    awaitRefetchQueries: true
  })

  if (loadingToDo) {
    return (
      <CircularProgress />
    )
  }

  return (
    <UpsertToDoForm
      navigate={navigate}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      loading={loading}
      control={control}
      initialValues={data?.getToDo}
      toDo={toDo}
    />
  )
}

const UpsertToDoForm = (props) => {
  const {
    navigate,
    control,
    handleSubmit,
    onSubmit,
    loading,
    initialValues,
    toDo
  } = props

  const form = {
    title: useCustomController({
      name: 'title',
      control,
      rules: { required: 'El título es requerido' },
      label: 'Título',
      defaultValue: initialValues?.title || null
    }),
    dueDate: useCustomController({
      name: 'dueDate',
      control,
      label: 'Fecha límite',
      rules: { required: 'La fecha límite es requerida', validate: dateIsGreaterThanCurrent },
      type: 'date',
      minDate: Date.now(),
      defaultValue: initialValues?.dueDate ? new Date(initialValues?.dueDate) : null
    }),
    content: useCustomController({
      name: 'content',
      control,
      label: 'Detalles (opcional)',
      minRows: 3,
      multiline: true,
      defaultValue: initialValues?.content || null
    })
  }

  return (
    <CustomContainer maxWidth='sm' paddingTop={60}>
      <Card>
        <CardContent>
          <Typography variant='h5'>Crear to-do</Typography>
          <CustomInput
            form={form}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            onCancel={() => navigate('/')}
            styles={{ paddingTop: 3, paddingBottom: 1 }}
            button={toDo ? 'Actualizar to-do' : 'Crear to-do'}
            loading={loading}
          />
        </CardContent>
      </Card>
    </CustomContainer>
  )
}

export default UpsertToDo
