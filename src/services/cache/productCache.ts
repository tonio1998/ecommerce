import AsyncStorage from '@react-native-async-storage/async-storage';

export const getProductsFromCache = async (vendorId: number) => {
	const key = `products_cache_vendor_${vendorId}`;
	const data = await AsyncStorage.getItem(key);
	return data ? JSON.parse(data) : [];
};

export const saveProductsToCache = async (
	vendorId: number,
	products: any[]
) => {
	const key = `products_cache_vendor_${vendorId}`;
	await AsyncStorage.setItem(key, JSON.stringify(products));
};
