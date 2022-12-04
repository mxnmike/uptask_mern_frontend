import { useState, useEffect, createContext } from 'react'
import axiosAPIClient from '../config/clientAxios'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { io } from 'socket.io-client'

let socket

const ProjectsContext = createContext()

const ProjectsProvider = ({ children }) => {
  const [project, setProject] = useState({})
  const [projects, setProjects] = useState([])
  const [alert, setAlert] = useState({})
  const [loading, setLoading] = useState(false)
  const [formTaskModal, setFormTaskModal] = useState(false)
  const [deleteTaskModal, setDeleteTaskModal] = useState(false)
  const [task, setTask] = useState({})
  const [collaborator, setCollaborator] = useState({})
  const [deleteCollaboratorModal, setDeleteCollaboratorModal] = useState(false)
  const [search, setSearch] = useState(false)

  const navigate = useNavigate()
  const { auth } = useAuth()

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
        setAlert(error.response?.data)
      }
    }
    return () => getProjects()
  }, [auth])

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL)
    return () => {}
  }, [])

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
        //SOCKET IO
        socket.emit('edit task', data.task)
        setAlert(data)
      } else {
        const { data } = await axiosAPIClient.post('/tasks', task, config)

        setAlert({ error: false, message: `Task Created Successfully` })
        //SOCKET IO
        socket.emit('new task', data.task)
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

      //SOCKET IO
      socket.emit('delete task', task)
    } catch (error) {
      setAlert(error.response?.data)
    } finally {
      setLoading(false)
      setTask({})
      setDeleteTaskModal(false)
      setTimeout(() => {
        setAlert({})
      }, 3000)
    }
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

      //SOCKET.io
      socket.emit('complete task', data.task)
      setAlert({})
    } catch (error) {
      setAlert(error.response.data)
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

  const handleSearch = () => {
    setSearch(!search)
  }

  //SECTION:- SOCKET.IO
  const submitTaskProject = task => {
    const updatedProject = { ...project }
    updatedProject.tasks = [...updatedProject.tasks, task]
    setProject(updatedProject)
  }

  const deleteTaskProject = task => {
    const updatedProject = { ...project }
    updatedProject.tasks = updatedProject.tasks.filter(
      taskState => taskState._id !== task._id
    )
    setProject(updatedProject)
  }

  const editTaskProject = task => {
    const updatedProject = { ...project }
    updatedProject.tasks = updatedProject.tasks.map(taskState =>
      taskState._id === task._id ? task : taskState
    )
    setProject(updatedProject)
  }

  const completeTaskProject = task => {
    const updatedProject = { ...project }
    updatedProject.tasks = updatedProject.tasks.map(taskState =>
      taskState._id === task._id ? task : taskState
    )
    setProject(updatedProject)
  }

  const signOut = () => {
    setProjects([])
    setProject({})
    setAlert({})
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
        search,
        handleSearch,
        submitTaskProject,
        deleteTaskProject,
        editTaskProject,
        completeTaskProject,
        signOut,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  )
}

export { ProjectsProvider }
export default ProjectsContext
