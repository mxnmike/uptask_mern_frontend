import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const ProjectPreview = ({ project }) => {
  const { auth } = useAuth()
  const { name, _id, client, owner } = project

  return (
    <div className='border-b p-5 flex justify-between'>
      <div className='flex items-center gap-2'>
        <p className='flex-1'>
          {name}
          <span className='ml-2 text-sm text-gray-500 uppercase'>
            {' '}
            {client}
          </span>
        </p>
        {auth.user._id != owner && (
          <p className='p-1 text-xs rounded-lg text-white bg-green-500 font-bold uppercase px-4 mr-5'>
            Collaborador
          </p>
        )}
      </div>

      <Link
        to={`${_id}`}
        className='text-gray-600 betterhover:hover:text-gray-800 uppercase text-sm font-bold'
      >
        View Project
      </Link>
    </div>
  )
}

export default ProjectPreview
