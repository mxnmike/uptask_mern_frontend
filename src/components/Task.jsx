import { formatDate } from '../helpers/validationHelpers'
import useProjects from '../hooks/useProjects'
import useAdmin from '../hooks/useAdmin'

const Task = ({ task }) => {
  const { handleModalEditTask, handleModalDeleteTask } = useProjects()
  const { name, description, priority, dueDate, _id, state } = task
  const admin = useAdmin()

  return (
    <div className='border-b p-5 flex justify-between items-center'>
      <div>
        <p className='mb-1 text-xl'>{name}</p>
        <p className='mb-1 text-sm text-gray-500 uppercase'>{description}</p>
        <p className='mb-1 text-sm'>{formatDate(dueDate)}</p>
        <p className='mb-1 text-gray-600'>Priority: {priority}</p>
      </div>
      <div className='flex gap-2'>
        {admin && (
          <button
            className='bg-indigo-600 px-4 py-3 text-white font-bold uppercase text-sm rounded-lg'
            onClick={() => handleModalEditTask(task)}
          >
            Edit
          </button>
        )}
        {state ? (
          <button className='bg-sky-600 px-4 py-3 text-white font-bold uppercase text-sm rounded-lg'>
            Complete
          </button>
        ) : (
          <button className='bg-gray-600 px-4 py-3 text-white font-bold uppercase text-sm rounded-lg'>
            Incomplete
          </button>
        )}
        {admin && (
          <button
            className='bg-red-600 px-4 py-3 text-white font-bold uppercase text-sm rounded-lg'
            onClick={() => handleModalDeleteTask(task)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  )
}

export default Task
