import { defineStore } from 'pinia'

interface UIState {
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'info'
    message: string
  }>
}

export const useUIStore = defineStore('ui', {
  state: (): UIState => ({
    notifications: [],
  }),

  actions: {
    notify({ type, message }: { type: 'success' | 'error' | 'info'; message: string }) {
      const id = Date.now().toString()
      this.notifications.push({ id, type, message })

      setTimeout(() => {
        this.removeNotification(id)
      }, 5000)

      return id
    },

    removeNotification(id: string) {
      const index = this.notifications.findIndex((n) => n.id === id)
      if (index !== -1) {
        this.notifications.splice(index, 1)
      }
    },
  },
})
