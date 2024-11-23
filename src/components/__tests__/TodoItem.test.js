import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import TodoItem from '../TodoItem.vue'

describe('TodoItem', () => {
  const createWrapper = (props = {}) => {
    return mount(TodoItem, {
      props: {
        todo: {
          id: 1,
          text: 'Test todo',
          completed: false,
          dueDate: '',
          ...props
        }
      }
    })
  }

  it('renders todo text', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.todo-text').text()).toBe('Test todo')
  })

  it('toggles todo completion', async () => {
    const wrapper = createWrapper()
    await wrapper.find('input[type="checkbox"]').trigger('change')
    expect(wrapper.emitted('toggle')).toBeTruthy()
  })

  it('removes todo', async () => {
    const wrapper = createWrapper()
    await wrapper.find('.delete-btn').trigger('click')
    expect(wrapper.emitted('remove')).toBeTruthy()
  })

  it('edits todo text', async () => {
    const wrapper = createWrapper()
    await wrapper.find('.todo-content').trigger('dblclick')
    
    const input = wrapper.find('input[type="text"]')
    expect(input.exists()).toBe(true)
    
    await input.setValue('Updated todo')
    await input.trigger('keyup.enter')
    
    expect(wrapper.emitted('update:text')[0]).toEqual(['Updated todo'])
  })

  it('updates due date', async () => {
    const wrapper = createWrapper()
    const dateInput = wrapper.find('input[type="date"]')
    await dateInput.setValue('2024-12-31')
    
    expect(wrapper.emitted('update:dueDate')[0]).toEqual(['2024-12-31'])
  })

  it('shows completed style when todo is done', () => {
    const wrapper = createWrapper({ completed: true })
    expect(wrapper.classes()).toContain('done')
  })
})