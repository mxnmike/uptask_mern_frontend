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
  const [deleteTaskModal, setDeleteTaskModal] = useState(false)
  const [authorizedUser, setAuthorizedUser] = useState(false)
  const [task, setTask] = useState({})
  const [collaborator, setCollaborator] = useState({})
  const [deleteCollaboratorModal, setDeleteCollaboratorModal] = useState(false)

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
  // SECTION:- PROJECTS

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
        console.log('Editing')
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
        console.log('Creating New')
        const { data } = await axiosAPIClient.post('/projects', project, config)
        setProjects([...projects, data])
        setAlert({ error: false, message: `Project Created Successfully` })
      }
      setTimeout(() => {
        if (project._id) return
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
      setAlert({})
    } catch (error) {
      console.log('Error:', error.response.data)
      setAlert(error.response.data)
      navigate('/projects')
    } finally {
      setLoading(false)
      setTimeout(() => {
        setAlert({})
      }, 3000)
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

  // SECTION: - TASKS

  const handleFormTaskModal = () => {
    setFormTaskModal(!formTaskModal)
    setTask({})
  }

  const handleDeleteTaskModal = () => {
    setDeleteTaskModal(!deleteTaskModal)
    // setTask({})
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
        //Editing task
        const { data } = await axiosAPIClient.put(
          `/tasks/${task.id}`,
          task,
          config
        )

        const { updatedTask } = data
        const updatedTasks = project.tasks.map(taskState =>
          taskState._id === updatedTask._id ? updatedTask : taskState
        )

        const updatedProject = { ...project }
        updatedProject.tasks = updatedTasks
        setProject(updatedProject)
        setAlert({ error: false, message: `Task Saved Successfully` })
      } else {
        const { data } = await axiosAPIClient.post('/tasks', task, config)
        const updatedProject = { ...project }
        updatedProject.tasks = [...project.tasks, data.task]
        setProject(updatedProject)
        setAlert({ error: false, message: `Task Created Successfully` })
      }
      setTimeout(() => {
        setAlert({})
        setFormTaskModal(false)
      }, 1000)
    } catch (error) {
      setAlert(error.response.data)
    }
  }

  const deleteTask = async () => {
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
      const { data } = await axiosAPIClient.delete(`/tasks/${task._id}`, config)
      setAlert(data)
      setProject(updatedProject)
    } catch (error) {
      setAlert(error.response.data)
    } finally {
      setLoading(false)
      setTask({})
      setDeleteTaskModal(false)
      setTimeout(() => {
        setAlert({})
      }, 3000)
    }
  }

  const handleModalEditTask = task => {
    setFormTaskModal(!formTaskModal)
    setTask(task)
  }

  const handleModalDeleteTask = task => {
    setDeleteTaskModal(!deleteTaskModal)
    setTask(task)
  }

  // SECTION: - COLLABORATORS

  const submitCollaborator = async email => {
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
      const { data } = await axiosAPIClient.post(
        '/projects/collaborators',
        { email },
        config
      )
      // setAlert({})
      console.log('submit collaborator:', data)
      setCollaborator(data.user)
    } catch (error) {
      setAlert(error.response.data)
    } finally {
      setLoading(false)
    }
  }

  const addCollaborator = async email => {
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
      const { data } = await axiosAPIClient.post(
        `/projects/collaborators/${project._id}`,
        email,
        config
      )
      setAlert(data)
      setCollaborator({})
    } catch (error) {
      setAlert(error.response.data)
    } finally {
      setLoading(false)
      setTimeout(() => {
        setAlert({})
      }, 3000)
    }
  }

  const removeCollaborator = async () => {
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
      const { data } = await axiosAPIClient.post(
        `/projects/delete-collaborator/${project._id}`,
        { id: collaborator._id },
        config
      )
      setAlert(data)

      const updatedProject = { ...project }
      updatedProject.collaborators = updatedProject.collaborators.filter(
        collaboratorState => collaboratorState._id !== collaborator._id
      )
      setProject(updatedProject)
      setCollaborator({})
    } catch (error) {
      setAlert(error.response.data)
    } finally {
      setLoading(false)
      setDeleteCollaboratorModal(false)
      setTimeout(() => {
        setAlert({})
      }, 3000)
    }
  }

  const handleDeleteCollaboratorModal = () => {
    setDeleteCollaboratorModal(!deleteCollaboratorModal)
  }

  const handleModalDeleteCollaborator = collaborator => {
    setDeleteCollaboratorModal(!deleteCollaboratorModal)
    setCollaborator(collaborator)
  }

  const completeTask = async id => {
    try {
      const token = localStorage.getItem('token')

      if (!token) return

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
      const { data } = await axiosAPIClient.post(
        `/tasks/state/${id}`,
        {},
        config
      )

      const updatedProject = { ...project }
      updatedProject.tasks = updatedProject.tasks.map(taskState =>
        taskState._id === data.task._id ? data.task : taskState
      )
      setProject(updatedProject)
      setAlert({})
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
        task,
        handleModalEditTask,
        deleteTaskModal,
        handleDeleteTaskModal,
        handleModalDeleteTask,
        deleteTask,
        submitCollaborator,
        collaborator,
        addCollaborator,
        deleteCollaboratorModal,
        handleDeleteCollaboratorModal,
        removeCollaborator,
        handleModalDeleteCollaborator,
        completeTask,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  )
}

export { ProjectsProvider }
export default ProjectsContext
