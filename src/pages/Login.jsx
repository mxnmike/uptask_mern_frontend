import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axiosAPIClient from '../config/clientAxios'
import Alert from '../components/Alert'
import useAuth from '../hooks/useAuth'
import useProjects from '../hooks/useProjects'

const Login = () => {
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [alert, setAlert] = useState({})

  const { setAuth } = useAuth()
  const { setAuthorizedUser } = useProjects()
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    if ([email, password].includes('')) {
      setAlert({ error: true, message: 'All Fields are Required' })
    }
    setAlert({})
    try {
      const { data } = await axiosAPIClient.post(`/users/login`, {
        email,
        password,
      })
      localStorage.setItem('token', data.user.token)
      setAuth(data)
      setAlert({})
      setAuthorizedUser(true)
      navigate('/projects')
    } catch (error) {
      setAlert(error.response.data)
    }
  }

  const { message } = alert

  return (
    <>
      <h1 className='text-sky-600 font-black text-6xl capitalize'>
        Sign In and Manage your <span className='text-slate-700'>projects</span>
      </h1>
      {message && <Alert alert={alert} />}
      <form
        className='my-10 bg-white shadow rounded-lg p-10'
        onSubmit={handleSubmit}
      >
        <div className='my-5'>
          <label
            className='uppercase text-gray-600 block text-xl font-bold'
            htmlFor='email'
          >
            Email
          </label>
          <input
            id='email'
            type='email'
            placeholder='Registered Email'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className='my-5'>
          <label
            className='uppercase text-gray-600 block text-xl font-bold'
            htmlFor='password'
          >
            Password
          </label>
          <input
            id='password'
            type='password'
            placeholder='Register Password'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <input
          type='submit'
          value='Sign-In'
          className='bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded betterhover:hover:cursor-pointer betterhover:hover:bg-sky-800 transition-colors'
        />
      </form>
      <nav className='lg:flex lg:justify-between'>
        <Link
          to='register'
          className='block text-center my-5 text-slate-500 uppercase text-sm'
        >
          No account? Register here
        </Link>
        <Link
          to='reset-password'
          className='block text-center my-5 text-slate-500 uppercase text-sm'
        >
          Forgot My Password
        </Link>
      </nav>
    </>
  )
}

export default Login
