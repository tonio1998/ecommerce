import api from '../api.ts';

/**
 * GET: Home dashboard summary
 * Used by HomeScreen hero + recent orders + cart count
 */
export const getHomeDashboard = async () => {
	const res = await api.get('/dashboard');

	return {
		totalSales: res.data.total_sales ?? 0,
		orders: res.data.orders ?? 0,
		pending: res.data.pending ?? 0,
		shipped: res.data.shipped ?? 0,
		cancelled: res.data.cancelled ?? 0,

		cartCount: res.data.cart_count ?? 0,

		recentOrders: res.data.recent_orders ?? [],
	};
};

/**
 * GET: Product search
 * @param query string
 */
export const searchProducts = async (query: string) => {
	return api.get('/products/search', {
		params: {
			q: query,
		},
	});
};
