import api from './axios'

export const createOrder = (amount) =>
    api.post('/payments/create-order', { amount })