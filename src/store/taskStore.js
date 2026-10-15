import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../service/api'

function getLocalDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

export const useTaskStore = defineStore('task', () => {
  const tasks = ref([])
  const filterCategory = ref('')
  const filterPriority = ref('')

  const filteredTasks = computed(() => {
    return tasks.value.filter((task) => {
      const matchCategory = filterCategory.value
        ? task.category === filterCategory.value
        : true
      const matchPriority = filterPriority.value
        ? task.priority === filterPriority.value
        : true
      return matchCategory && matchPriority
    })
  })

  async function fetchTasks() {
    try {
      const response = await api.get('/tasks')
      tasks.value = response.data
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error)
    }
  }

  async function addTask(taskData) {
    try {
      const payload = {
        ...taskData,
        completed: Boolean(taskData.completed),
        completionDate: taskData.completionDate || null
      }

      await api.post('/tasks', payload)
      await fetchTasks()
      return true
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error)
      return false
    }
  }

  async function updateTask(taskData) {
    try {
      await api.put(`/tasks/${taskData.id}`, taskData)
      await fetchTasks()
      return true
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error)
      return false
    }
  }

  async function deleteTask(id) {
    try {
      await api.delete(`/tasks/${id}`)
      tasks.value = tasks.value.filter((task) => task.id !== id)
      await fetchTasks()
      return true
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error)
      return false
    }
  }

  async function completeTask(id) {
    try {
      const taskToUpdate = tasks.value.find((task) => task.id === id)
      if (!taskToUpdate) return false

      const completed = !taskToUpdate.completed
      const completionDate = completed ? getLocalDate() : null

      if (completed && !isValidDate(completionDate)) {
        console.error('Data de conclusão inválida:', completionDate)
        return false
      }

      const updatedTask = {
        ...taskToUpdate,
        completed,
        completionDate
      }

      await api.put(`/tasks/${id}`, updatedTask)
      await fetchTasks()
      return true
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error)
      return false
    }
  }

  function setFilters(category = '', priority = '') {
    filterCategory.value = category
    filterPriority.value = priority
  }

  return {
    tasks,
    filterCategory,
    filterPriority,
    filteredTasks,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    setFilters
  }
})
