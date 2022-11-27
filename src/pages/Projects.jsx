import { useEffect } from 'react'
import ProjectPreview from '../components/ProjectPreview'
import Alert from '../components/Alert'
import useProjects from '../hooks/useProjects'

const Projects = () => {
  const { projects, alert } = useProjects()

  const { message } = alert
  return (
    <>
      <h1 className='text-4xl font-black'>Projects</h1>
      {message && <Alert alert={alert} />}
      <div className='bg-white shadow mt-10 rounded-lg'>
        {projects.length ? (
          projects.map(project => (
            <ProjectPreview
              key={project._id}
              project={project}
            />
          ))
        ) : (
          <p className='text-center text-gray-600 uppercase p-5'>
            No hay proyectos aun
          </p>
        )}
      </div>
    </>
  )
}

export default Projects
