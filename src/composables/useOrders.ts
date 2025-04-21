import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { api } from '@/services/api'
import type { Order } from '@/types'

export function useOrders() {
  const queryClient = useQueryClient()

  const ordersQuery = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: () => api.get('/orders').then((r) => r.data),
  })

  const getOrder = (id: number) => {
    return useQuery<Order>({
      queryKey: ['orders', id],
      queryFn: () => api.get(`/orders/${id}`).then((r) => r.data),
      enabled: !!id,
    })
  }

  const createOrder = useMutation({
    mutationFn: (orderData: Omit<Order, 'id'>) =>
      api.post('/orders', orderData).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })

  const updateOrder = useMutation({
    mutationFn: (orderData: Order) =>
      api.put(`/orders/${orderData.id}`, orderData).then((r) => r.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders', data.id] })
    },
  })

  const deleteOrder = useMutation({
    mutationFn: (id: number) => api.delete(`/orders/${id}`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })

  return {
    ordersQuery,
    orders: ordersQuery.data,
    isOrdersLoading: ordersQuery.isLoading,
    isOrdersError: ordersQuery.isError,
    ordersError: ordersQuery.error,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder,
  }
}
