import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { useEffectOnce } from '../hooks/useEffectOnce'
import useProjects from '../hooks/useProjects'
import Spinner from '../components/Spinner'
import FormTaskModal from '../components/FormTaskModal'

const Project = () => {
  const params = useParams()
  const { getProject, project, loading, handleFormTaskModal } = useProjects()

  useEffectOnce(() => {
    getProject(params.id)
  })

  const { name } = project
  if (loading) return <Spinner />
  return (
    <>
      <div className='flex justify-between'>
        <h1 className='font-black text-4xl'>{name}</h1>

        <div className='flex items-center gap-2 text-gray-400 betterhover:hover:text-black'>
          <Link
            to={`/projects/edit/${params.id}`}
            className='uppercase font-bold flex'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-6 h-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10'
              />
            </svg>{' '}
            Edit
          </Link>
        </div>
      </div>

      <button
        onClick={handleFormTaskModal}
        type='button'
        className='text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center mt-5 flex gap-2 items-center'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-5 h-5'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'
          />
        </svg>
        New Task
      </button>
      <FormTaskModal />
    </>
  )
}

export default Project
