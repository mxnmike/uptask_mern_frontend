import { useState } from 'react'
import useProjects from '../hooks/useProjects'
import Alert from './Alert'

const FormCollaborator = () => {
  const [email, setEmail] = useState('')
  const { showAlert, alert, submitCollaborator, projecto } = useProjects()
  const handleSubmit = e => {
    e.preventDefault()
    if (email === '') {
      showAlert({ message: 'Email is required', error: true })
      return
    }
    submitCollaborator(email)
  }
  const { message } = alert
  return (
    <form
      className='bg-white py-10 px-5 md:w-1/2 rounded-lg shadow'
      onSubmit={handleSubmit}
    >
      {message && <Alert alert={alert} />}
      <div className='mb-5'>
        <label
          className='text-gray-700 uppercase font-bold text-sm'
          htmlFor='email'
        >
          Collaborator Email
        </label>

        <input
          className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
          id='email'
          type='email'
          placeholder='Users Email'
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <input
        type='submit'
        className='bg-sky-600 betterhover:hover:bg-sky-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors rounded text-sm'
        value='Search Collaborator'
      />
    </form>
  )
}

export default FormCollaborator
