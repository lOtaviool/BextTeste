<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/authStore'
import Button from '../components/Button.vue'
import Input from '../components/Input.vue'

const router = useRouter()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const error = ref('')

function handleLogin() {
  error.value = ''

  const success = authStore.login(email.value, password.value)

  if (success) {
    router.push('/dashboard')
    return
  }

  error.value = 'Informe um e-mail e senha válidos.'
}
</script>

<template>
  <div class="page-shell">
    <div class="login-card">
      <div class="brand">
        <span class="badge">BEXT</span>
        <h1>Bem-vindo</h1>
      </div>

      <p class="subtitle">Acesse sua conta para gerenciar tarefas.</p>

      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          <span>E-mail</span>
          <Input v-model="email" type="email" placeholder="seu@email.com" required />
        </label>

        <label>
          <span>Senha</span>
          <Input v-model="password" type="password" placeholder="••••••••" required />
        </label>

        <Button type="submit">Entrar</Button>
      </form>

      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
.page-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%);
  padding: 24px;
}

.login-card {
  width: min(100%, 420px);
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
  padding: 32px 28px;
}

.brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
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

h1 {
  margin: 0;
  font-size: 2rem;
  line-height: 1.1;
  color: #111827;
}

.subtitle {
  margin: 0 0 24px;
  color: #475569;
  font-size: 0.95rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.login-form label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #334155;
  font-weight: 600;
  text-align: left;
}

.login-form input {
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 1rem;
  color: #334155;
  background: #f8fafc;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.login-form input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  outline: none;
}

button {
  margin-top: 8px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
  padding: 13px 18px;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

button:hover {
  transform: translateY(-1px);
  opacity: 0.96;
}

.error-message {
  margin-top: 18px;
  color: #b91c1c;
  font-size: 0.9rem;
  text-align: center;
}
</style>
