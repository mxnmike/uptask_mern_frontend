import useAuth from './useAuth'
import useProjects from './useProjects'

const useAdmin = () => {
  const { project } = useProjects()
  const { auth } = useAuth()
  return project.owner === auth.user._id
}

export default useAdmin
