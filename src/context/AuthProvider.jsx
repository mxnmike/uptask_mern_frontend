import { useState, useEffect, createContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosAPIClient from '../config/clientAxios'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({})
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const authenticateUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }
      console.log(token)
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
      try {
        const { data } = await axiosAPIClient('/users/profile', config)
        setAuth(data)
        navigate('/projects')
      } catch (error) {
        setAuth({})

        throw {
          code: 404,
          message: 'User Not Found',
          error: true,
        }
      }
      setLoading(false)
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
