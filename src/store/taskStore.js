import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../service/api'

export const useTaskStore = defineStore('task', () => {
  const tasks = ref([])
  const filterCategory = ref('')
  const filterPriority = ref('')

  const filteredTasks = computed(() => {
    return tasks.value.filter(task => {
      const matchCategory = filterCategory.value ? task.category === filterCategory.value : true
      const matchPriority = filterPriority.value ? task.priority === filterPriority.value : true
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
        completed: Boolean(taskData.completed)
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
      tasks.value = tasks.value.filter(task => task.id !== id)
      await fetchTasks()
      return true
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error)
      return false
    }
  }

  async function toggleTask(id) {
    try {
      const taskToUpdate = tasks.value.find(task => task.id === id)
      if (!taskToUpdate) return false

      const updatedTask = {
        ...taskToUpdate,
        completed: !taskToUpdate.completed
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
    toggleTask,
    setFilters
  }
})