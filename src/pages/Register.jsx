import { useState } from 'react'
import { Link } from 'react-router-dom'
import Alert from '../components/Alert'
import { validateEmail } from '../helpers/validationHelpers'
import axiosAPIClient from '../config/clientAxios'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [alert, setAlert] = useState({})

  const resetForm = () => {
    setName('')
    setEmail('')
    setPassword('')
    setRepeatPassword('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if ([name, email, password, repeatPassword].includes('')) {
      setAlert({
        message: 'All Fields Are Required',
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
    if (password.length < 6) {
      setAlert({
        message: 'Passwords minimum lenght is 6 chars',
        error: true,
      })
      return
    }

    if (password !== repeatPassword) {
      setAlert({
        message: "Passwords don't Match",
        error: true,
      })
      return
    }
    setAlert({})

    try {
      const { data } = await axiosAPIClient.post(`/users`, {
        name,
        email,
        password,
      })
      // console.log(data)
      setAlert(data)
      resetForm()
    } catch (error) {
      setAlert(error.response.data)
    }
  }

  const { message } = alert
  return (
    <>
      <h1 className='text-sky-600 font-black text-6xl capitalize'>
        Create your Account and Manage your{' '}
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
            htmlFor='name'
          >
            Name
          </label>
          <input
            id='name'
            type='text'
            placeholder='Your Full-Name'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

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
            placeholder='Register Email'
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

        <div className='my-5'>
          <label
            className='uppercase text-gray-600 block text-xl font-bold'
            htmlFor='confirm-password'
          >
            Confirm Password
          </label>
          <input
            id='confirm-password'
            type='password'
            placeholder='Confirm your Password'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={repeatPassword}
            onChange={e => setRepeatPassword(e.target.value)}
          />
        </div>

        <input
          type='submit'
          value='Create Account'
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
          to='reset-password'
          className='block text-center my-5 text-slate-500 uppercase text-sm'
        >
          Forgot My Password
        </Link>
      </nav>
    </>
  )
}

export default Register
