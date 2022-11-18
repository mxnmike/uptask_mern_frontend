const ProjectPreview = ({ project }) => {
  const { name, _id, client } = project
  return <div>{name}</div>
}

export default ProjectPreview
