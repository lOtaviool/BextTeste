<script setup>
import CardTask from './CardTask.vue'

const props = defineProps({
  tasks: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['complete-task', 'delete-task', 'edit-task'])

function onCompleteTask(taskId) {
  emit('complete-task', taskId)
}

function onDeleteTask(taskId) {
  emit('delete-task', taskId)
}

function onEditTask(task) {
  emit('edit-task', task)
}
</script>

<template>
  <section class="panel">
    <div class="panel-header">
      <h2>Lista de tarefas</h2>
    </div>

    <div v-if="props.tasks.length" class="task-list">
      <CardTask
        v-for="task in props.tasks"
        :key="task.id"
        :task="task"
        @complete-task="onCompleteTask"
        @delete-task="onDeleteTask"
        @edit-task="onEditTask"
      />
    </div>

    <p v-else class="empty-state">Nenhuma tarefa cadastrada.</p>
  </section>
</template>

<style scoped>
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

.task-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.empty-state {
  margin: 0;
  color: #64748b;
  text-align: center;
  padding: 16px;
}
</style>
