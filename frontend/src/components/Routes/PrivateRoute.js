import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('todo-token')
  return token ? children : <Navigate to='/iniciar-sesion' replace />
}

export default PrivateRoute
