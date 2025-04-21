import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUIStore } from '@/stores/ui.ts'

describe('UI Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should have an empty notifications array initially', () => {
    // Arrange
    const store = useUIStore()

    // Assert
    expect(store.notifications).toEqual([])
  })

  it('should add a notification with the notify action', () => {
    // Arrange
    const store = useUIStore()

    // Act
    const notificationId = store.notify({ type: 'success', message: 'Test notification' })

    // Assert
    expect(store.notifications.length).toBe(1)
    expect(store.notifications[0]).toEqual({
      id: notificationId,
      type: 'success',
      message: 'Test notification',
    })
  })

  it('should return the notification ID from notify action', () => {
    // Arrange
    const store = useUIStore()
    const dateSpy = vi.spyOn(Date, 'now').mockReturnValue(123456789)

    // Act
    const notificationId = store.notify({ type: 'error', message: 'Error notification' })

    // Assert
    expect(notificationId).toBe('123456789')

    // Cleanup
    dateSpy.mockRestore()
  })

  it('should remove a notification with the removeNotification action', () => {
    // Arrange
    const store = useUIStore()
    const notificationId = store.notify({ type: 'info', message: 'Will be removed' })

    // Act
    store.removeNotification(notificationId)

    // Assert
    expect(store.notifications.length).toBe(0)
  })

  it('should do nothing when removing a non-existent notification', () => {
    // Arrange
    const store = useUIStore()
    store.notify({ type: 'success', message: 'Test notification' })

    // Act
    store.removeNotification('non-existent-id')

    // Assert
    expect(store.notifications.length).toBe(1)
  })

  it('should automatically remove notifications after 5 seconds', () => {
    // Arrange
    const store = useUIStore()
    store.notify({ type: 'success', message: 'Auto-remove test' })

    // Act
    vi.advanceTimersByTime(5000)

    // Assert
    expect(store.notifications.length).toBe(0)
  })

  it('should keep separate timeouts for each notification', () => {
    // Arrange
    const store = useUIStore()

    // Act
    store.notify({ type: 'success', message: 'First notification' })
    vi.advanceTimersByTime(3000)

    store.notify({ type: 'error', message: 'Second notification' })
    vi.advanceTimersByTime(3000)

    // Assert
    expect(store.notifications.length).toBe(1)
    expect(store.notifications[0].type).toBe('error')

    // Act
    vi.advanceTimersByTime(2000)

    // Assert
    expect(store.notifications.length).toBe(0)
  })
})
