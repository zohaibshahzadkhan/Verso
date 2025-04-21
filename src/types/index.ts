export interface Company {
  id: number
  name: string
}

export interface Product {
  id: number
  name: string
  price: number
}

export interface Order {
  id: number
  customerId: number
  supplierId: number
  products: number[]
}
