import { Routes, Route } from 'react-router-dom'
// Components
import Dashboard from './components/Dashboard/Dashboard'
import Login from './components/Login/Login'
import SignUp from './components/Login/SignUp'
import PrivateRoute from './components/Routes/PrivateRoute'
// Material UI
import { CssBaseline } from '@mui/material'
import UpsertToDo from './components/ToDo/UpsertToDo'

function App () {
  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path='/iniciar-sesion' element={<Login />} />
        <Route path='/registro' element={<SignUp />} />
        <Route
          path='/'
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path='crear-todo'
          element={
            <PrivateRoute>
              <UpsertToDo />
            </PrivateRoute>
          }
        />
        <Route
          path='editar-todo/:toDo'
          element={
            <PrivateRoute>
              <UpsertToDo />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App
