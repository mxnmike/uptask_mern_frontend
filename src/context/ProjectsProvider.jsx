import { useState, useEffect, createContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosAPIClient from '../config/clientAxios'

const ProjectsContext = createContext()

const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([])
  const [alert, setAlert] = useState({})

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
  }, [])
  const showAlert = alert => {
    setAlert(alert)
    setTimeout(() => {
      setAlert({})
    }, 5000)
  }

  const submitProject = async project => {
    console.log('project:', project)
    try {
      const token = localStorage.getItem('token')
      if (!token) return
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
      const { data } = await axiosAPIClient.post('/projects', project, config)

      console.log(data)
      setAlert({ error: false, message: `Project Created Successfully` })
      setTimeout(() => {
        setAlert({})
        navigate('/projects')
      }, 3000)
    } catch (error) {
      console.log(error.response.data)
    }
  }

  const getProjects = async => {}

  return (
    <ProjectsContext.Provider
      value={{ projects, alert, showAlert, submitProject }}
    >
      {children}
    </ProjectsContext.Provider>
  )
}

export { ProjectsProvider }
export default ProjectsContext
