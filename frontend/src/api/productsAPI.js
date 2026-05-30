import api from './axios'

export const getProducts = (params) =>
    api.get('/products', { params })

export const getFeaturedProducts = () =>
    api.get('/products/featured')

export const getSingleProduct = (id) =>
    api.get(`/products/${id}`)

export const createProduct = (formData) =>
    api.post('/products/', formData)

export const updateProduct = (id, formData) =>
    api.put(`/products/${id}`, formData)

export const deleteProduct = (id) =>
    api.delete(`/products/${id}`)