<template>
  <div class="todo-item" :class="{ done: todo.completed }">
    <input type="checkbox" :checked="todo.completed" @change="$emit('toggle')" />
    <div v-if="!editing" class="todo-content" @dblclick="startEditing">
      <span class="todo-text">{{ todo.text }}</span>
      <input type="date" :value="todo.dueDate" @change="updateDueDate" />
    </div>
    <input
      v-else
      type="text"
      v-model="editText"
      @blur="finishEditing"
      @keyup.enter="finishEditing"
      @keyup.esc="cancelEditing"
      ref="editInput"
    />
    <button @click="$emit('remove')" class="delete-btn">×</button>
  </div>
</template>

<script>
export default {
  name: 'TodoItem',
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false,
      editText: ''
    }
  },
  methods: {
    startEditing() {
      this.editing = true
      this.editText = this.todo.text
      this.$nextTick(() => {
        this.$refs.editInput.focus()
      })
    },
    finishEditing() {
      if (this.editText.trim()) {
        this.$emit('update:text', this.editText.trim())
      }
      this.editing = false
    },
    cancelEditing() {
      this.editing = false
    },
    updateDueDate(event) {
      this.$emit('update:dueDate', event.target.value)
    }
  }
}
</script>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.todo-content {
  flex: 1;
  display: flex;
  align-items: center;
  margin: 0 10px;
}

.todo-text {
  flex: 1;
  margin-right: 10px;
}

.done .todo-text {
  text-decoration: line-through;
  color: #888;
}

.delete-btn {
  background: none;
  border: none;
  color: #ff4444;
  font-size: 18px;
  cursor: pointer;
}

input[type="text"] {
  flex: 1;
  margin: 0 10px;
  padding: 4px;
}
</style>