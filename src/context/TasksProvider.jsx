import { useState, useEffect, createContext } from 'react'

const TasksContext = createContext()

const TasksProvider = ({ children }) => {
  const [task, setTask] = useState({})

  const resetTasksProvider = () => {
    const token = localStorage.getItem('token')
    if (token) return
    setTask({})
    setTasks([])
  }

  return (
    <TasksContext.Provider value={{ resetTasksProvider }}>
      {children}
    </TasksContext.Provider>
  )
}

export { TasksProvider }
export default TasksContext
