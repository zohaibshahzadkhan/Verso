import { describe, it, expect, beforeEach, vi, afterAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia' // Import pinia functions
import ProductList from '@/components/products/ProductList.vue'
import ProductTable from '@/components/products/ProductTable.vue'
import { useProducts } from '@/composables/useProducts'

vi.mock('@/composables/useProducts', () => ({
  useProducts: vi.fn(),
}))

const originalConfirm = window.confirm
window.confirm = vi.fn()

const mockProducts = [
  { id: 1, name: 'Product 1', price: 19.99 },
  { id: 2, name: 'Product 2', price: 29.99 },
  { id: 3, name: 'Product 3', price: 39.99 },
]

describe('ProductList', () => {
  beforeEach(() => {
    // Initialize Pinia
    const pinia = createPinia()
    setActivePinia(pinia)

    vi.clearAllMocks()
    window.confirm = vi.fn()
  })

  afterAll(() => {
    window.confirm = originalConfirm
  })

  it('renders loading state correctly', () => {
    // Arrange
    vi.mocked(useProducts).mockReturnValue({
      products: [],
      isLoading: true,
      isError: false,
      error: null,
      isDeleting: false,
      deleteProduct: {
        mutate: vi.fn(),
      },
    })

    // Act
    const wrapper = mount(ProductList)

    // Assert
    expect(wrapper.text()).toContain('Loading products...')
    expect(wrapper.find('div.text-center').exists()).toBe(true)
    expect(wrapper.findComponent(ProductTable).exists()).toBe(false)
  })

  it('renders error state correctly', () => {
    // Arrange
    vi.mocked(useProducts).mockReturnValue({
      products: [],
      isLoading: false,
      isError: true,
      error: { message: 'Failed to fetch products' },
      isDeleting: false,
      deleteProduct: {
        mutate: vi.fn(),
      },
    })

    // Act
    const wrapper = mount(ProductList)

    // Assert
    expect(wrapper.text()).toContain('Error loading products: Failed to fetch products')
    expect(wrapper.find('div.text-red-500').exists()).toBe(true)
    expect(wrapper.findComponent(ProductTable).exists()).toBe(false)
  })

  it('renders empty state correctly', () => {
    // Arrange
    vi.mocked(useProducts).mockReturnValue({
      products: [],
      isLoading: false,
      isError: false,
      error: null,
      isDeleting: false,
      deleteProduct: {
        mutate: vi.fn(),
      },
    })

    // Act
    const wrapper = mount(ProductList)

    // Assert
    expect(wrapper.text()).toContain('No products found. Create one using the form.')
    expect(wrapper.findComponent(ProductTable).exists()).toBe(false)
  })

  it('renders products table when products are available', () => {
    // Arrange
    vi.mocked(useProducts).mockReturnValue({
      products: mockProducts,
      isLoading: false,
      isError: false,
      error: null,
      isDeleting: false,
      deleteProduct: {
        mutate: vi.fn(),
      },
    })

    // Act
    const wrapper = mount(ProductList, {
      global: {
        stubs: {
          ProductTable: true,
        },
      },
    })

    // Assert
    expect(wrapper.findComponent(ProductTable).exists()).toBe(true)
    expect(wrapper.findComponent(ProductTable).props('products')).toEqual(mockProducts)
  })

  it('shows delete button only when a product is selected', async () => {
    // Arrange
    vi.mocked(useProducts).mockReturnValue({
      products: mockProducts,
      isLoading: false,
      isError: false,
      error: null,
      isDeleting: false,
      deleteProduct: {
        mutate: vi.fn(),
      },
    })

    const wrapper = mount(ProductList, {
      global: {
        stubs: {
          ProductTable: true,
        },
      },
    })

    // Assert
    expect(wrapper.find('button').exists()).toBe(false)

    // Act
    await wrapper.vm.selectProduct(mockProducts[0])

    // Assert after selection
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('button').text()).toBe('Delete Selected')
  })

  it('changes delete button text when deleting', async () => {
    // Arrange
    vi.mocked(useProducts).mockReturnValue({
      products: mockProducts,
      isLoading: false,
      isError: false,
      error: null,
      isDeleting: true,
      deleteProduct: {
        mutate: vi.fn(),
      },
    })

    const wrapper = mount(ProductList, {
      global: {
        stubs: {
          ProductTable: true,
        },
      },
    })

    // Act
    await wrapper.vm.selectProduct(mockProducts[0])

    // Assert
    expect(wrapper.find('button').text()).toBe('Deleting...')
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('emits edit event when editProduct is called', async () => {
    // Arrange
    vi.mocked(useProducts).mockReturnValue({
      products: mockProducts,
      isLoading: false,
      isError: false,
      error: null,
      isDeleting: false,
      deleteProduct: {
        mutate: vi.fn(),
      },
    })

    const wrapper = mount(ProductList)

    // Act
    await wrapper.vm.editProduct(mockProducts[0])

    // Assert
    expect(wrapper.emitted('edit')).toBeTruthy()
    expect(wrapper.emitted('edit')[0][0]).toEqual(mockProducts[0])
  })

  it('calls deleteProduct.mutate when handleDelete is confirmed', async () => {
    // Arrange
    const mockDeleteMutate = vi.fn()

    vi.mocked(useProducts).mockReturnValue({
      products: mockProducts,
      isLoading: false,
      isError: false,
      error: null,
      isDeleting: false,
      deleteProduct: {
        mutate: mockDeleteMutate,
      },
    })

    const wrapper = mount(ProductList)

    await wrapper.vm.selectProduct(mockProducts[0])
    vi.mocked(window.confirm).mockReturnValue(true)

    // Act
    await wrapper.find('button').trigger('click')

    // Assert
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete Product 1?')
    expect(mockDeleteMutate).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        onSuccess: expect.any(Function),
      }),
    )
  })

  it('does not call deleteProduct.mutate when handleDelete is canceled', async () => {
    // Arrange
    const mockDeleteMutate = vi.fn()

    vi.mocked(useProducts).mockReturnValue({
      products: mockProducts,
      isLoading: false,
      isError: false,
      error: null,
      isDeleting: false,
      deleteProduct: {
        mutate: mockDeleteMutate,
      },
    })

    const wrapper = mount(ProductList)

    await wrapper.vm.selectProduct(mockProducts[0])
    vi.mocked(window.confirm).mockReturnValue(false)

    // Act
    await wrapper.find('button').trigger('click')

    // Assert
    expect(window.confirm).toHaveBeenCalled()
    expect(mockDeleteMutate).not.toHaveBeenCalled()
  })

  it('updates selectedProduct when selectProduct is called', async () => {
    // Arrange
    vi.mocked(useProducts).mockReturnValue({
      products: mockProducts,
      isLoading: false,
      isError: false,
      error: null,
      isDeleting: false,
      deleteProduct: {
        mutate: vi.fn(),
      },
    })

    const wrapper = mount(ProductList)

    // Assert
    expect(wrapper.vm.selectedProduct).toBeNull()

    // Act
    await wrapper.vm.selectProduct(mockProducts[1])

    // Assert
    expect(wrapper.vm.selectedProduct).toEqual(mockProducts[1])
  })

  it('passes the selected product to ProductTable', async () => {
    // Arrange
    vi.mocked(useProducts).mockReturnValue({
      products: mockProducts,
      isLoading: false,
      isError: false,
      error: null,
      isDeleting: false,
      deleteProduct: {
        mutate: vi.fn(),
      },
    })

    const wrapper = mount(ProductList)

    // Act
    await wrapper.vm.selectProduct(mockProducts[2])

    // Assert
    expect(wrapper.findComponent(ProductTable).props('selectedProduct')).toEqual(mockProducts[2])
  })
})
