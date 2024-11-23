<template>
  <div class="todo-list">
    <div class="add-todo">
      <input
        type="text"
        v-model="newTodoText"
        @keyup.enter="addTodo"
        placeholder="Add a new todo..."
      />
      <button @click="addTodo">Add</button>
    </div>
    <div class="todos">
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        @toggle="toggleTodo(todo)"
        @remove="removeTodo(todo)"
        @update:text="updateTodoText(todo, $event)"
        @update:dueDate="updateTodoDueDate(todo, $event)"
      />
    </div>
  </div>
</template>

<script>
import TodoItem from './TodoItem.vue'

const STORAGE_KEY = 'todo-list'

export default {
  name: 'TodoList',
  components: {
    TodoItem
  },
  data() {
    return {
      todos: [],
      newTodoText: ''
    }
  },
  created() {
    this.loadTodos()
  },
  methods: {
    loadTodos() {
      const savedTodos = localStorage.getItem(STORAGE_KEY)
      if (savedTodos) {
        this.todos = JSON.parse(savedTodos)
      }
    },
    saveTodos() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos))
    },
    addTodo() {
      const text = this.newTodoText.trim()
      if (!text) return

      const todo = {
        id: Date.now(),
        text,
        completed: false,
        dueDate: ''
      }

      this.todos.push(todo)
      this.newTodoText = ''
      this.saveTodos()
    },
    toggleTodo(todo) {
      todo.completed = !todo.completed
      this.saveTodos()
    },
    removeTodo(todo) {
      const index = this.todos.indexOf(todo)
      if (index > -1) {
        this.todos.splice(index, 1)
        this.saveTodos()
      }
    },
    updateTodoText(todo, newText) {
      todo.text = newText
      this.saveTodos()
    },
    updateTodoDueDate(todo, newDate) {
      todo.dueDate = newDate
      this.saveTodos()
    }
  }
}
</script>

<style scoped>
.todo-list {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.add-todo {
  display: flex;
  margin-bottom: 20px;
}

.add-todo input {
  flex: 1;
  padding: 8px;
  margin-right: 10px;
}

.add-todo button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.todos {
  border-top: 1px solid #eee;
}
</style>