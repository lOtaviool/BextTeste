<script setup>
import Button from './Button.vue'
import { Plus, Trash, CheckCircle } from 'lucide-vue-next'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['toggle-task', 'delete-task', 'edit-task'])

function onToggleTask(taskId) {
  emit('toggle-task', taskId)
}

function onDeleteTask(taskId) {
  emit('delete-task', taskId)
}

function onEditTask(task) {
  emit('edit-task', task)
}
</script>

<template>
  <article class="task-item">
    <div class="task-main">
      <Button
        class="task-toggle"
        :class="props.task.completed ? 'done' : 'pending'"
        @click="onToggleTask(props.task.id)"
        :aria-label="props.task.completed ? 'Marcar como pendente' : 'Marcar como concluída'"
      />

      <div class="task-body">
        <div class="task-heading">
          <h3 :class="props.task.completed ? 'completed-title' : ''">{{ props.task.title }}</h3>
          <span class="tag">{{ props.task.category }}</span>
          <span class="priority" :class="props.task.priority.toLowerCase()">{{ props.task.priority }}</span>
        </div>

        <p>{{ props.task.description }}</p>
      </div>
    </div>

    <div class="task-meta">
      <Button class="edit-btn" @click="onEditTask(props.task)">Detalhes</Button>
      <Button class="delete-btn" @click="onDeleteTask(props.task.id)">
        <Trash class="icon" />
      </Button>
    </div>
  </article>
</template>

<style scoped>
.task-item {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 18px;
  background: #f8fafc;
}

.task-main {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  flex: 1;
}

.task-toggle {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #cbd5e1;
  background: #fff;
  cursor: pointer;
  margin-top: 6px;
}

.task-toggle.done {
  background: #22c55e;
  border-color: #22c55e;
}

.task-toggle.pending {
  background: #fff;
}

.task-body {
  flex: 1;
}

.task-heading {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.task-body h3 {
  margin: 0;
  color: #0f172a;
  font-size: 1.05rem;
}

.completed-title {
  text-decoration: line-through;
  color: #64748b;
}

.task-body p {
  margin: 0;
  color: #475569;
}

.task-meta {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.tag,
.priority {
  border-radius: 6px;
  padding: 2px 6px;
  font-size: 0.72rem;
  font-weight: 700;
}

.icon{
    width: 18px !important;
    height: 18px !important;
}

.tag {
  background: #e0e7ff;
  color: #4338ca;
}

.priority.alta {
  background: #fee2e2;
  color: #b91c1c;
}

.priority.média {
  background: #fef3c7;
  color: #b45309;
}

.priority.baixa {
  background: #dcfce7;
  color: #166534;
}

.edit-btn,
.delete-btn {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  cursor: pointer;
}

.edit-btn {
  background: #e0e7ff;
  color: #3730a3;
}

.delete-btn {
  background: #fee2e2;
  color: #b91c1c;
}

@media (max-width: 720px) {
  .task-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
