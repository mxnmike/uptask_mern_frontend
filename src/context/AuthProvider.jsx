import { useState, useEffect, createContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosAPIClient from '../config/clientAxios'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({})
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    const authenticateUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
      try {
        const { data } = await axiosAPIClient('/users/profile', config)
        console.log('profile')
        setAuth(data)
        // navigate('/projects')
      } catch (error) {
        console.log('error:', error)
        setAuth({})

        throw {
          code: 404,
          message: 'User Not Found',
          error: true,
        }
      } finally {
        setLoading(false)
      }
    }
    return () => authenticateUser()
  }, [])

  return (
    <AuthContext.Provider value={{ auth, setAuth, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider }
export default AuthContext
