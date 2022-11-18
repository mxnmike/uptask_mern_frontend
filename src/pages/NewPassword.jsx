import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axiosAPIClient from '../config/clientAxios'
import Alert from '../components/Alert'

const NewPassword = () => {
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [resetedPassword, setResetedPassword] = useState(false)
  const [confirmedToken, setConfirmedToken] = useState(false)
  const [alert, setAlert] = useState({})
  const params = useParams()
  const { token } = params

  const resetForm = () => {
    setPassword('')
    setRepeatPassword('')
  }

  useEffect(() => {
    const confirmToken = async () => {
      try {
        const url = `/users/reset-password/${token}`
        await axiosAPIClient(url)
        // setAlert(data)
        setConfirmedToken(true)
      } catch (error) {
        setAlert(error.response.data)
        return
      }
    }
    return () => confirmToken()
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()

    if ([password, repeatPassword].includes('')) {
      setAlert({
        message: 'All Fields Are Required',
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
        message: "Passwords doesn't Match",
        error: true,
      })
      return
    }
    setAlert({})
    try {
      const { data } = await axiosAPIClient.post(
        `/users/reset-password/${token}`,
        {
          password,
        }
      )
      setAlert(data)
      setResetedPassword(true)
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
        Reset your password and don't loose access to your{' '}
        <span className='text-slate-700'>projects</span>
      </h1>

      {message && <Alert alert={alert} />}
      {confirmedToken && (
        <form
          className='my-10 bg-white shadow rounded-lg p-10'
          onSubmit={handleSubmit}
        >
          <div className='my-5'>
            <label
              className='uppercase text-gray-600 block text-xl font-bold'
              htmlFor='password'
            >
              New Password
            </label>
            <input
              id='password'
              type='password'
              placeholder='Register New Password'
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
              Confirm New Password
            </label>
            <input
              id='confirm-password'
              type='password'
              placeholder='Confirm your New Password'
              className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
              value={repeatPassword}
              onChange={e => setRepeatPassword(e.target.value)}
            />
          </div>

          <input
            type='submit'
            value='Save New Password'
            className='bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded betterhover:hover:cursor-pointer betterhover:hover:bg-sky-800 transition-colors'
          />

          {resetedPassword && (
            <Link
              to='/'
              className='block text-center my-5 text-slate-500 uppercase text-sm'
            >
              Sign-In here
            </Link>
          )}
        </form>
      )}
    </>
  )
}

export default NewPassword
