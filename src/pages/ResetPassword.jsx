import { Link } from 'react-router-dom'
import { useState } from 'react'
import { validateEmail } from '../helpers/validationHelpers'
import Alert from '../components/Alert'
import axiosAPIClient from '../config/clientAxios'

const ResetPassword = () => {
  const [email, setEmail] = useState('')
  const [alert, setAlert] = useState({})
  const resetForm = () => {
    setEmail('')
    setTimeout(() => {
      setAlert({})
    }, 2000)
  }
  const handleSubmit = async e => {
    e.preventDefault()
    if (email === '') {
      setAlert({
        message: 'E-mail filed is Required',
        error: true,
      })
      return
    }
    if (validateEmail(email) === false) {
      setAlert({
        message: 'Please enter a Valid E-mail',
        error: true,
      })
      return
    }
    setAlert({})
    try {
      const { data } = await axiosAPIClient.post(`/users/reset-password`, {
        email,
      })
      setAlert(data)
      resetForm()
    } catch (error) {
      console.log(error.response.data)
      setAlert(error.response.data)
    }
  }
  const { message } = alert
  return (
    <>
      <h1 className='text-sky-600 font-black text-6xl capitalize'>
        Recover your Access and Dont loose your Projects{' '}
        <span className='text-slate-700'>projects</span>
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
            placeholder='Email'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <input
          type='submit'
          value='Send Reset Link'
          className='bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded betterhover:hover:cursor-pointer betterhover:hover:bg-sky-800 transition-colors'
        />
      </form>
      <nav className='lg:flex lg:justify-between'>
        <Link
          to='/'
          className='block text-center my-5 text-slate-500 uppercase text-sm'
        >
          Have an Account? Sign-In here
        </Link>
        <Link
          to='register'
          className='block text-center my-5 text-slate-500 uppercase text-sm'
        >
          No account? Register here
        </Link>
        {/* <Link
          to='reset-password'
          className='block text-center my-5 text-slate-500 uppercase text-sm'
        >
          Forgot My Password
        </Link> */}
      </nav>
    </>
  )
}

export default ResetPassword
