const ProjectList = project => {
  const { name, _id, client } = project
  return <div>{project.name}</div>
}

export default ProjectPreview
