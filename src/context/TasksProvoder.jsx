import { useState, useEffect, createContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosAPIClient from '../config/clientAxios'

const TasksContext = createContext()

const TasksProvider = ({ children }) => {
  return <TasksContext.Provider value={{}}>{children}</TasksContext.Provider>
}

export { TasksProvider as ProjectsProvider }
export default TasksContext
