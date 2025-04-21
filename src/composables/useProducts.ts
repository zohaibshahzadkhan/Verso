import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { api } from '@/services/api'
import type { Product } from '@/types'

export function useProducts() {
  const queryClient = useQueryClient()

  const productsQuery = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => api.get('/products').then((r) => r.data),
  })

  const getProduct = (id: number) => {
    return useQuery<Product>({
      queryKey: ['products', id],
      queryFn: () => api.get(`/products/${id}`).then((r) => r.data),
      enabled: !!id,
    })
  }

  const createProduct = useMutation({
    mutationFn: (productData: Omit<Product, 'id'>) =>
      api.post('/products', productData).then((r) => r.data),
    onSuccess: (newProduct) => {
      queryClient.setQueryData<Product[]>(['products'], (old) => {
        return old ? [newProduct, ...old] : [newProduct]
      })
    },
  })

  const updateProduct = useMutation({
    mutationFn: (productData: Product) =>
      api.put(`/products/${productData.id}`, productData).then((r) => r.data),
    onSuccess: (updatedProduct) => {
      queryClient.setQueryData<Product[]>(['products'], (old) => {
        if (!old) return []
        return [updatedProduct, ...old.filter((p) => p.id !== updatedProduct.id)]
      })
    },
  })

  const deleteProduct = useMutation({
    mutationFn: (id: number) => api.delete(`/products/${id}`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  return {
    productsQuery,
    products: productsQuery.data,
    isLoading: productsQuery.isLoading,
    isError: productsQuery.isError,
    error: productsQuery.error,
    createProduct,
    updateProduct,
    deleteProduct,
    isCreating: createProduct.isPending,
    isUpdating: updateProduct.isPending,
    isDeleting: deleteProduct.isPending,
    getProduct,
  }
}
