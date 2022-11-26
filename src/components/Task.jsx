import { formatDate } from '../helpers/validationHelpers'
import useProjects from '../hooks/useProjects'
import useAdmin from '../hooks/useAdmin'

const Task = ({ task }) => {
  const { handleModalEditTask, handleModalDeleteTask, completeTask } =
    useProjects()
  const { name, description, priority, dueDate, _id, state } = task
  const admin = useAdmin()

  return (
    <div className='border-b p-5 flex justify-between items-center'>
      <div className='flex flex-col items-start'>
        <p className='mb-1 text-xl'>{name}</p>
        <p className='mb-1 text-sm text-gray-500 uppercase'>{description}</p>
        <p className='mb-1 text-sm'>{formatDate(dueDate)}</p>
        <p className='mb-1 text-gray-600'>Priority: {priority}</p>
        {state && (
          <p
            className='text-xs bg-green-600 uppercase p-1 rounded-lg text-white px-4
          '
          >
            Completed by: {task.completed.name}
          </p>
        )}
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
        <button
          className={`${
            state ? 'bg-sky-600' : 'bg-gray-600'
          } px-4 py-3 text-white font-bold uppercase text-sm rounded-lg`}
          onClick={() => completeTask(_id)}
        >
          {state ? 'Complete' : 'Incomplete'}
        </button>

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
