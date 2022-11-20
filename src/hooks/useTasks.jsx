import { useContext } from 'react'
import TasksContext from '../context/TasksProvider'

const useTasks = () => {
  return useContext(TasksContext)
}

export default useTasks
