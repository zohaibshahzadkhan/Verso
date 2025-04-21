import { useQuery } from '@tanstack/vue-query'
import { api } from '@/services/api'
import type { Company } from '@/types'

export function useCompanies() {
  const companiesQuery = useQuery<Company[]>({
    queryKey: ['companies'],
    queryFn: () => api.get('/companies').then((r) => r.data),
  })

  return {
    companiesQuery,
    companies: companiesQuery.data,
    isCompaniesLoading: companiesQuery.isLoading,
    isCompaniesError: companiesQuery.isError,
    companiesError: companiesQuery.error,
  }
}
