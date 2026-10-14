<script setup>
import { computed, ref, watch } from 'vue'
import Button from './Button.vue'
import Input from './Input.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  task: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'save'])

const form = ref({
  id: null,
  title: '',
  description: '',
  priority: 'Média',
  category: 'Estudo',
  completed: false
})

const isEditing = computed(() => !!props.task)

watch(
  () => props.task,
  (task) => {
    if (task) {
      form.value = {
        ...task,
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'Média',
        category: task.category || 'Estudo',
        completed: Boolean(task.completed)
      }
      return
    }

    form.value = {
      id: null,
      title: '',
      description: '',
      priority: 'Média',
      category: 'Estudo',
      completed: false
    }
  },
  { immediate: true }
)

function closeModal() {
  emit('update:modelValue', false)
}

function submitForm() {
  if (!form.value.title.trim()) return

  emit('save', {
    ...form.value,
    title: form.value.title.trim(),
    description: form.value.description.trim()
  })

  closeModal()
}
</script>

<template>
  <teleport to="body">
    <div v-if="modelValue" class="modal-overlay" @click.self="closeModal">
      <div class="modal-card" role="dialog" aria-modal="true">
        <div class="modal-header">
          <div>
            <p class="eyebrow">{{ isEditing ? 'Editar tarefa' : 'Nova tarefa' }}</p>
            <h2>{{ isEditing ? 'Detalhes da tarefa' : 'Adicionar nova tarefa' }}</h2>
          </div>

          <Button class="close-btn" @click="closeModal">×</Button>
        </div>

        <form class="task-form" @submit.prevent="submitForm">
          <label>
            <span>Título</span>
            <Input v-model="form.title" type="text" placeholder="Título da tarefa" />
          </label>

          <label>
            <span>Descrição</span>
            <Input v-model="form.description" type="text" placeholder="Descrição" />
          </label>

          <div class="form-row">
            <label>
              <span>Categoria</span>
              <Input v-model="form.category" as="select">
                <option value="Estudo">Estudo</option>
                <option value="Cliente">Cliente</option>
                <option value="Produtividade">Produtividade</option>
              </Input>
            </label>

            <label>
              <span>Prioridade</span>
              <Input v-model="form.priority" as="select">
                <option value="Alta">Alta</option>
                <option value="Média">Média</option>
                <option value="Baixa">Baixa</option>
              </Input>
            </label>
          </div>

          <div class="modal-actions">
            <Button class="secondary-btn" @click="closeModal">Cancelar</Button>
            <Button type="submit" class="primary-btn">{{ isEditing ? 'Salvar alterações' : 'Criar tarefa' }}</Button>
          </div>
        </form>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  display: grid;
  place-items: center;
  z-index: 50;
  padding: 24px;
}

.modal-card {
  width: min(100%, 560px);
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18);
  padding: 24px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.eyebrow {
  margin: 0 0 4px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.7rem;
  font-weight: 700;
  color: #6366f1;
}

h2 {
  margin: 0;
  color: #111827;
  font-size: 1.5rem;
}

.close-btn {
  border: none;
  background: transparent;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  color: #475569;
}

.task-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.task-form label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #334155;
  font-weight: 600;
  text-align: left;
}

.task-form input,
.task-form select {
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  color: #334155;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 0.95rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.primary-btn,
.secondary-btn {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
}

.primary-btn {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: #fff;
}

.secondary-btn {
  background: #e2e8f0;
  color: #0f172a;
}
</style>
