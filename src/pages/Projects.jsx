import { useState, useEffect, createContext } from 'react'
import ProjectPreview from '../components/ProjectPreview'
import useProjects from '../hooks/useProjects'

const Projects = () => {
  const { projects } = useProjects()
  console.log(projects)
  return (
    <>
      <h1 className='text-4xl font-black'>Projects</h1>
      <div className='bg-white shadow mt-10 rounded-lg p-5'>
        {projects.length ? (
          projects.map(project => (
            <>
              <p>{console.log('project:', project)}</p>
              <ProjectPreview
                key={project._id}
                project={project}
              />
            </>
          ))
        ) : (
          <p className='text-center text-gray-600 uppercase'>
            No hay proyectos aun
          </p>
        )}
      </div>
    </>
  )
}

export default Projects
