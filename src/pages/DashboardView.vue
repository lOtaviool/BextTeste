<script setup>
    import { computed, onMounted, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { useAuthStore } from '../store/authStore'
    import { useTaskStore } from '../store/taskStore'
    import Button from '../components/Button.vue'
    import Input from '../components/Input.vue'
    import ListTasks from '../components/ListTasks.vue'
    import ModalDetails from '../components/ModalDetails.vue'
    import { Plus, LogOut} from 'lucide-vue-next'

    const router = useRouter()
    const authStore = useAuthStore()
    const taskStore = useTaskStore()

    const isModalOpen = ref(false)
    const selectedTask = ref(null)

    const tasks = computed(() => taskStore.filteredTasks)
    const totalTasks = computed(() => taskStore.tasks.length)
    const completedTasks = computed(() => taskStore.tasks.filter(task => task.completed).length)
    const pendingTasks = computed(() => totalTasks.value - completedTasks.value)

    onMounted(() => {
        taskStore.fetchTasks()
    })

    function openCreateModal() {
        selectedTask.value = null
        isModalOpen.value = true
    }

    function openEditModal(task) {
        selectedTask.value = { ...task }
        isModalOpen.value = true
    }

    function closeModal() {
        selectedTask.value = null
        isModalOpen.value = false
    }

    async function handleSaveTask(taskPayload) {
        if (taskPayload.id) {
            await taskStore.updateTask(taskPayload)
        } else {
            await taskStore.addTask(taskPayload)
        }

    await taskStore.fetchTasks()
        closeModal()
    }

    function handleLogout() {
        authStore.logout()
        router.push('/')
    }

    async function handleToggleTask(taskId) {
        await taskStore.toggleTask(taskId)
    }

    async function handleDeleteTask(taskId) {
        await taskStore.deleteTask(taskId)
    }

    function setFilter(category = '', priority = '') {
        taskStore.setFilters(category, priority)
    }
</script>

<template>
    <div class="dashboard-shell">
        <header class="topbar">
            <div style="display: flex; align-items: center; gap: 12px;">
                <span class="badge">BEXT</span>
                <p class="eyebrow">Dashboard</p>
            </div>

            <Button class="logout-btn" @click="handleLogout">
                <LogOut class="icon" />
                Sair
            </Button>
        </header>

        <section class="stats-grid">
            <article class="stat-card">
                <span>Total</span>
                <strong>{{ totalTasks }}</strong>
            </article>

            <article class="stat-card accent">
                <span>Concluídas</span>
                <strong>{{ completedTasks }}</strong>
            </article>

            <article class="stat-card warning">
                <span>Pendentes</span>
                <strong>{{ pendingTasks }}</strong>
            </article>
        </section>

        <section class="panel">
            <div class="panel-header">
                <h2>Filtrar Tarefas</h2>
            </div>

            <div class="filters">
                <Input as="select" :model-value="taskStore.filterCategory" @update:model-value="value => setFilter(value, taskStore.filterPriority)">
                <option value="">Todas as categorias</option>
                <option value="Estudo">Estudo</option>
                <option value="Cliente">Cliente</option>
                <option value="Produtividade">Produtividade</option>
                </Input>

                <Input as="select" :model-value="taskStore.filterPriority" @update:model-value="value => setFilter(taskStore.filterCategory, value)">
                <option value="">Todas as prioridades</option>
                <option value="Alta">Alta</option>
                <option value="Média">Média</option>
                <option value="Baixa">Baixa</option>
                </Input>

                <Button class="primary-btn" @click="openCreateModal">
                    <Plus class="icon" />
                    Nova Tarefa
                </Button>
            </div>
        </section>

        <ListTasks
            :tasks="tasks"
            @toggle-task="handleToggleTask"
            @delete-task="handleDeleteTask"
            @edit-task="openEditModal"
        />

        <ModalDetails 
            v-model="isModalOpen" 
            :task="selectedTask" 
            @save="handleSaveTask" 
        />
    </div>
</template>

<style scoped>
.dashboard-shell {
  min-height: 100vh;
  background: #f8fafc;
  padding: 32px 24px 48px;
}

.topbar {
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #4f46e5;
  color: #fff;
  font-weight: 700;
  width: 52px;
  height: 52px;
  border-radius: 14px;
}

.eyebrow {
  margin: 0 0 6px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.75rem;
  font-weight: 700;
  color: #6366f1;
}

.logout-btn,
.primary-btn {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.logout-btn {
  background: #f8fafc;
  color: #4f46e5;
  border: 1px solid #e2e8f0;
}

.primary-btn {
  background: #4f46e5;
  color: #fff;
}

.icon {
  width: 18px;
  height: 18px;
}

.stats-grid {
  margin: 0 auto 24px;
  display: grid;
  grid-template-columns: repeat(3, minmax(180px, 1fr));
  gap: 16px;
}

.stat-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.04);
}

.stat-card span {
  display: block;
  color: #64748b;
  font-size: 0.82rem;
  margin-bottom: 10px;
}

.stat-card strong {
  color: #0f172a;
  font-size: 2rem;
}

.stat-card.accent {
  background: linear-gradient(135deg, #eef2ff 0%, #ffffff 100%);
}

.stat-card.warning {
  background: linear-gradient(135deg, #fff7ed 0%, #ffffff 100%);
}

.panel {
  margin: 0 auto 20px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.04);
}

.panel-header {
  margin-bottom: 16px;
}

.panel-header h2 {
  margin: 0;
  color: #111827;
  font-size: 1.3rem;
}

.filters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filters > * {
  flex: 1;
}

.filters select {
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  color: #334155;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 0.95rem;
}

@media (max-width: 720px) {
  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
