import api from './axios'

export const getCollections = () =>
    api.get('/collections')

export const getSingleCollection = (id) =>
    api.get(`/collections/${id}`)

export const getCollectionProducts = (id) =>
    api.get(`/collections/${id}/products`)

export const createCollection = (formData) =>
    api.post('/collections/', formData)

export const updateCollection = (id, formData) =>
    api.put(`/collections/${id}`, formData)

export const deleteCollection = (id) =>
    api.delete(`/collections/${id}`)