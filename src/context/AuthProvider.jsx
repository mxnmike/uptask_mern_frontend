import { useState, useEffect, createContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosAPIClient from '../config/clientAxios'
import useProjects from '../hooks/useProjects'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({})
  const [loading, setLoading] = useState(false)
  // const { resetProjectsProvider } = useProjects()

  const navigate = useNavigate()

  const handleSignOut = () => {
    localStorage.removeItem('token')
    console.log('token:', localStorage.getItem('token'))
    navigate('/')
    setAuth({})
    // resetProjectsProvider()
  }

  useEffect(() => {
    setLoading(true)
    const authenticateUser = async () => {
      const token = localStorage.getItem('token')
      console.log('token useEffect:', token)
      if (!token) {
        console.log('falseToken')
        setLoading(false)
        navigate('/')
        return
      }
      console.log('token true:', !token)
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
      try {
        const { data } = await axiosAPIClient('/users/profile', config)
        console.log('profile:', data)
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
    <AuthContext.Provider value={{ auth, setAuth, loading, handleSignOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider }
export default AuthContext
