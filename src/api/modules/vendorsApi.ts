import api from '../api';

export const getVendors = async () => {
	const res = await api.get('/vendors');
	return res.data;
};

export const createVendor = async (payload: any) => {
	return api.post('/vendors', payload);
};

export const updateVendor = async (id: number, payload: any) => {
	return api.put(`/vendors/${id}`, payload);
};

export const toggleVendor = async (id: number) => {
	return api.patch(`/vendors/${id}/toggle`);
};
