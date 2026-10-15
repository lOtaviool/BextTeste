<script setup>
const props = defineProps({
  as: {
    type: String,
    default: 'input',
    validator: (value) => ['input', 'select'].includes(value)
  },
  modelValue: {
    type: [String, Number, Array],
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

function updateValue(event) {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <component
    :is="props.as"
    :value="props.modelValue"
    @input="props.as === 'input' && updateValue($event)"
    @change="props.as === 'select' && updateValue($event)"
  >
    <slot />
  </component>
</template>
