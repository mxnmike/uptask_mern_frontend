import { useState, useEffect, createContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosAPIClient from '../config/clientAxios'

const ProjectsContext = createContext()

const ProjectsProvider = ({ children }) => {
  const [project, setProject] = useState({})
  const [projects, setProjects] = useState([])
  const [alert, setAlert] = useState({})
  const [loading, setLoading] = useState(false)
  const [formTaskModal, setFormTaskModal] = useState(false)
  const [authorizedUser, setAuthorizedUser] = useState(false)

  //TASKS
  const [tasks, setTasks] = useState([])

  // const { resetTasksProvider } = useTasks()

  const navigate = useNavigate()

  useEffect(() => {
    const getProjects = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
        const { data } = await axiosAPIClient('/projects', config)
        setProjects(data.projects)
      } catch (error) {
        setAlert(error.response.data)
      }
    }
    return () => getProjects()
  }, [authorizedUser])

  const showAlert = alert => {
    setAlert(alert)
    setTimeout(() => {
      setAlert({})
    }, 5000)
  }

  const submitProject = async project => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
      if (project.id) {
        //Editing
        const { data } = await axiosAPIClient.put(
          `/projects/${project.id}`,
          project,
          config
        )
        const { updatedProject } = data
        const updatedProjects = projects.map(projectState =>
          projectState._id === updatedProject._id
            ? updatedProject
            : projectState
        )
        setProjects(updatedProjects)
        setAlert({ error: false, message: `Project Saved Successfully` })
      } else {
        const { data } = await axiosAPIClient.post('/projects', project, config)
        setProjects([...projects, data])
        setAlert({ error: false, message: `Project Created Successfully` })
      }
      setTimeout(() => {
        setAlert({})
        setProject({})
        navigate('/projects')
      }, 3000)
    } catch (error) {
      setAlert(error.response.data)
    }
  }

  const getProject = async id => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) return
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
      const { data } = await axiosAPIClient(`/projects/${id}`, config)
      setProject(data.project)
    } catch (error) {
      setAlert(error.response.data)
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async id => {
    try {
      const token = localStorage.getItem('token')

      if (!token) return

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
      const { data } = await axiosAPIClient.delete(`/projects/${id}`, config)
      setAlert(data)
      const updatedProjects = projects.filter(
        projectState => projectState._id !== id
      )
      setProjects(updatedProjects)
    } catch (error) {
      setAlert(error.response.data)
    } finally {
      setLoading(false)
      setTimeout(() => {
        setAlert({})
        setProject({})
        navigate('/projects')
      }, 3000)
    }
  }

  const handleFormTaskModal = () => {
    setFormTaskModal(!formTaskModal)
  }

  const resetProjectsProvider = () => {
    const token = localStorage.getItem('token')
    if (token) return
    setProjects([])
    setProject({})
    setAuthorizedUser(false)
  }

  const submitTask = async task => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
      if (task.id) {
        //Editing
        const { data } = await axiosAPIClient.put(
          `/tasks/${task.id}`,
          task,
          config
        )

        const { updatedTask } = data
        const updatedTasks = updatedTask.map(taskState =>
          taskState._id === updatedTask._id ? updatedTask : taskState
        )
        setTasks(updatedTasks)
        setAlert({ error: false, message: `Task Saved Successfully` })
      } else {
        const { data } = await axiosAPIClient.post('/tasks', task, config)
        setTasks([...tasks, data])
        setAlert({ error: false, message: `Task Created Successfully` })
      }
      setTimeout(() => {
        setAlert({})
        navigate(`/projects/${task.project}`)
      }, 3000)
    } catch (error) {
      setAlert(error.response.data)
    }
  }

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        alert,
        showAlert,
        submitProject,
        getProject,
        deleteProject,
        project,
        loading,
        formTaskModal,
        handleFormTaskModal,
        resetProjectsProvider,
        setAuthorizedUser,
        submitTask,
        tasks,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  )
}

export { ProjectsProvider }
export default ProjectsContext
