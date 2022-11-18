import { useState } from 'react'
import useProjects from '../hooks/useProjects'
import Alert from './Alert'

const ProjectForm = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [client, setClient] = useState('')

  const { alert, showAlert, submitProject } = useProjects()

  const handleSubmit = async e => {
    e.preventDefault()

    if ([name, description, dueDate, client].includes('')) {
      showAlert({ error: true, message: 'All Fields are Required' })
      return
    }
    showAlert({})
    try {
      await submitProject({ name, description, dueDate, client })
      setName('')
      setDescription('')
      setDueDate('')
      setClient('')
    } catch (error) {
      showAlert(error.response.data)
    }
  }
  const { message } = alert
  return (
    <form
      className='bg-white py-10 px-5 md:w-1/2 rounded-lg'
      onSubmit={handleSubmit}
    >
      {message && <Alert alert={alert} />}
      <div className='mb-5'>
        <label
          className='text-gray-700 uppercase font-bold text-sm'
          htmlFor='name'
        >
          Project Name
        </label>
        <input
          id='name'
          type='text'
          className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
          placeholder='Project Name'
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      <div className='mb-5'>
        <label
          className='text-gray-700 uppercase font-bold text-sm'
          htmlFor='description'
        >
          Description
        </label>
        <textarea
          id='description'
          className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
          placeholder='Project Description'
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <div className='mb-5'>
        <label
          className='text-gray-700 uppercase font-bold text-sm'
          htmlFor='due-date'
        >
          Due Date
        </label>
        <input
          id='due-date'
          type='date'
          className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />
      </div>

      <div className='mb-5'>
        <label
          className='text-gray-700 uppercase font-bold text-sm'
          htmlFor='client-name'
        >
          Client Name
        </label>
        <input
          id='client-name'
          type='text'
          className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md shadow'
          placeholder='Client Name'
          value={client}
          onChange={e => setClient(e.target.value)}
        />
      </div>
      <input
        type='submit'
        className='bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer betterhover:hover:bg-sky-700 transition-colors'
        placeholder='Client Name'
        value='create project'
      />
    </form>
  )
}

export default ProjectForm
