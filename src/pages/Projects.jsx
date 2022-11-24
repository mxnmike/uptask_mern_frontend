import { useState, useEffect, createContext } from 'react'
import ProjectPreview from '../components/ProjectPreview'
import useProjects from '../hooks/useProjects'

const Projects = () => {
  const { projects } = useProjects()

  return (
    <>
      <h1 className='text-4xl font-black'>Projects</h1>
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
