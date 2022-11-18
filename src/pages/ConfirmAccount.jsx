import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Alert from '../components/Alert'
import axiosAPIClient from '../config/clientAxios'
import { useEffectOnce } from '../hooks/useEffectOnce'

const ConfirmAccount = () => {
  const [alert, setAlert] = useState({})
  const [confirmedAccount, setConfirmedAccount] = useState(false)
  const params = useParams()
  const { id } = params

  useEffectOnce(() => {
    const confirmAccount = async () => {
      try {
        const url = `/users/confirm/${id}`
        const { data } = await axiosAPIClient(url)
        setAlert(data)
        setConfirmedAccount(true)
      } catch (error) {
        setAlert(error.response.data)
        setConfirmedAccount(false)
      }
    }
    confirmAccount()
  })

  const { message } = alert
  return (
    <>
      <h1 className='text-sky-600 font-black text-6xl capitalize'>
        Confirm your Account and Start Creating your{' '}
        <span className='text-slate-700'>projects</span>
      </h1>
      <div className='mt-20 md:mt-10 shadow-lg px-5 py-10 rounded-xl bg-white'>
        {message && <Alert alert={alert} />}
        {confirmedAccount && (
          <Link
            to='/'
            className='block text-center my-5 text-slate-500 uppercase text-sm'
          >
            Sign-In here
          </Link>
        )}
      </div>
    </>
  )
}

export default ConfirmAccount
