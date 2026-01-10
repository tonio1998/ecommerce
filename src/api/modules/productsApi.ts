import api from '../api.ts';

export const fetchProductsPage = async (
	vendorId: number,
	page = 1
) => {
	const res = await api.get('/products', {
		params: {
			vendor_id: vendorId,
			page,
			per_page: 50,
		},
	});
	return res.data;
};

export const syncProductsApi = async (
	vendorId: number,
	afterId: number
) => {
	const res = await api.get('/products/sync', {
		params: {
			vendor_id: vendorId,
			after_id: afterId,
		},
	});
	return res.data;
};
