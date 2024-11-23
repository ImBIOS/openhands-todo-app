import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import TodoList from '../TodoList.vue'

describe('TodoList', () => {
  let wrapper
  let mockLocalStorage

  beforeEach(() => {
    mockLocalStorage = {
      getItem: vi.fn(),
      setItem: vi.fn()
    }
    global.localStorage = mockLocalStorage
    wrapper = mount(TodoList)
  })

  it('adds a new todo', async () => {
    const input = wrapper.find('.add-todo input')
    await input.setValue('New todo item')
    await input.trigger('keyup.enter')

    const todos = wrapper.findAll('.todo-item')
    expect(todos).toHaveLength(1)
    expect(todos[0].find('.todo-text').text()).toBe('New todo item')
    expect(mockLocalStorage.setItem).toHaveBeenCalled()
  })

  it('toggles todo completion', async () => {
    await wrapper.find('.add-todo input').setValue('Test todo')
    await wrapper.find('.add-todo input').trigger('keyup.enter')

    const checkbox = wrapper.find('input[type="checkbox"]')
    await checkbox.trigger('change')

    expect(mockLocalStorage.setItem).toHaveBeenCalled()
    const savedData = JSON.parse(mockLocalStorage.setItem.mock.calls[1][1])
    expect(savedData[0].completed).toBe(true)
  })

  it('removes a todo', async () => {
    await wrapper.find('.add-todo input').setValue('Test todo')
    await wrapper.find('.add-todo input').trigger('keyup.enter')

    expect(wrapper.findAll('.todo-item')).toHaveLength(1)

    await wrapper.find('.delete-btn').trigger('click')

    expect(wrapper.findAll('.todo-item')).toHaveLength(0)
    expect(mockLocalStorage.setItem).toHaveBeenCalled()
  })

  it('updates todo text', async () => {
    await wrapper.find('.add-todo input').setValue('Test todo')
    await wrapper.find('.add-todo input').trigger('keyup.enter')

    const todoContent = wrapper.find('.todo-content')
    await todoContent.trigger('dblclick')

    const input = wrapper.find('.todo-item input[type="text"]')
    await input.setValue('Updated todo')
    await input.trigger('keyup.enter')

    expect(wrapper.find('.todo-text').text()).toBe('Updated todo')
    expect(mockLocalStorage.setItem).toHaveBeenCalled()
  })

  it('updates todo due date', async () => {
    await wrapper.find('.add-todo input').setValue('Test todo')
    await wrapper.find('.add-todo input').trigger('keyup.enter')

    const dateInput = wrapper.find('input[type="date"]')
    await dateInput.setValue('2024-12-31')

    expect(mockLocalStorage.setItem).toHaveBeenCalled()
    const savedData = JSON.parse(mockLocalStorage.setItem.mock.calls[1][1])
    expect(savedData[0].dueDate).toBe('2024-12-31')
  })

  it('loads todos from localStorage', () => {
    const savedTodos = [
      { id: 1, text: 'Saved todo', completed: false, dueDate: '' }
    ]
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedTodos))

    wrapper = mount(TodoList)

    expect(wrapper.findAll('.todo-item')).toHaveLength(1)
    expect(wrapper.find('.todo-text').text()).toBe('Saved todo')
  })
})