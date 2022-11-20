import { Link, useNavigate } from 'react-router-dom'
// import useProjects from '../hooks/useProjects'
import useTasks from '../hooks/useTasks'

const Header = () => {
  const navigate = useNavigate()
  // const { resetProjectsProvider } = useProjects()
  // const { resetTasksProvider } = useTasks()

  const handleSignOut = () => {
    localStorage.removeItem('token')
    // resetProjectsProvider()
    // resetTasksProvider()
    navigate('/')
  }

  return (
    <header className='px-4 py-5 bg-white border-b'>
      <div className='md:flex md:justify-between'>
        <h2 className='text-4xl text-sky-600 font-black text-center'>UpTask</h2>
        <input
          className='rounded-lg lg:w-96 block p-2 border'
          type='search'
          placeholder='Search Project'
        />

        <div className='flex items-center gap-4'>
          <Link
            to='/projects'
            className='font-bold uppercase'
          >
            Projects
          </Link>
          <button
            onClick={handleSignOut}
            className='text-white text-sm bg-sky-600 p-3 rounded-md uppercase font-bold'
            type='button'
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
