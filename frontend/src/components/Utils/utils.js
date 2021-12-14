import React from 'react'
// date-fns
import { compareAsc } from 'date-fns'
// Material UI
import { Button, CircularProgress, Container, Grid, MenuItem, TextField } from '@mui/material'
// React Hook Form
import { useController } from 'react-hook-form'
import { DatePicker } from '@mui/lab'

// Form helpers
export function useCustomController (props) {
  const { name, control, rules, defaultValue, ...rest } = props
  const controllerFunctions = useController({ name, control, rules, defaultValue })
  return { ...controllerFunctions, ...rest }
}

export const CustomInput = (props) => {
  const {
    form,
    handleSubmit,
    onSubmit,
    button,
    onCancel = null,
    styles = null,
    loading = false
  } = props

  const formArray = Object.keys(form)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid
        container
        direction='row'
        justifyContent='center'
        alignItems='center'
        spacing={3}
        sx={styles}
      >
        {formArray.map((field, index) => {
          const {
            field: { ref, value, onChange, ...inputProps },
            fieldState: { error },
            formState,
            type,
            options,
            ...otherProps
          } = form[field]

          if (type === 'date') {
            let errorMessage = ''
            if (error?.type === 'validate') {
              errorMessage = 'La fecha no puede ser menor que la actual'
            } else if (error?.message) {
              errorMessage = error?.message
            }

            return (
              <Grid key={index} item xs={12} sx={{ mb: 2 }}>
                <DatePicker
                  value={value || null}
                  onChange={(newDate) => onChange(newDate)}
                  renderInput={(params) =>
                    <TextField
                      {...params}
                      fullWidth
                      error={!!error}
                      helperText={errorMessage}
                    />}
                  inputFormat='dd/MM/yyyy'
                  {...inputProps}
                  {...otherProps}
                />
              </Grid>
            )
          }
          return (
            <Grid key={index} item xs={12} sx={{ mb: 2 }}>
              <TextField
                error={!!error}
                fullWidth
                onChange={onChange}
                helperText={error?.message || ''}
                inputRef={ref}
                type={type || 'text'}
                select={type === 'select'}
                value={value || ''}
                {...inputProps}
                {...otherProps}
              >
                {type === 'select' &&
                  options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
          )
        })}
        {onCancel &&
          <Grid item xs={6}>
            <Button onClick={onCancel} variant='outlined' fullWidth>
              Cancelar
            </Button>
          </Grid>}
        <Grid item xs={onCancel ? 6 : 12}>
          {!loading &&
            <Button type='submit' variant='contained' fullWidth>
              {button || 'Enviar'}
            </Button>}
          {loading &&
            <Button variant='contained' fullWidth>
              <CircularProgress size={25} sx={{ color: '#ffffff' }} />
            </Button>}
        </Grid>
      </Grid>
    </form>
  )
}

// Custom container
export const CustomContainer = (props) => {
  const { children, maxWidth = 'md', paddingTop = 50, paddingBottom = 20 } = props

  return (
    <div
      style={{
        backgroundColor: '#F2F2F0',
        height: '100%',
        minHeight: '100vh'
      }}
    >
      <Container
        style={{
          paddingTop,
          paddingBottom
        }}
        maxWidth={maxWidth}
      >
        {children}
      </Container>
    </div>
  )
}

// Date helper
export const dateIsGreaterThanCurrent = (data) => {
  const today = new Date(Date.now()).setHours(0, 0, 0, 0)
  return compareAsc(data, today) !== -1
}
