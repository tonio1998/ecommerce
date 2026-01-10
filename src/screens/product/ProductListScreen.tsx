import React, { useEffect, useMemo, useState } from 'react';
import {
	View,
	StyleSheet,
	FlatList,
	TextInput,
	TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import CustomHomeHeader from '../../components/layout/CustomHomeHeader.tsx';
import { globalStyles } from '../../theme/styles.ts';
import { CText } from '../../components/common/CText.tsx';
import { formatNumber } from '../../utils/format.ts';
import { theme } from '../../theme';
import { handleApiError } from '../../utils/errorHandler.ts';
import { useVendor } from '../../context/VendorContext.tsx';

import {
	fetchProductsPage,
	syncProductsApi,
} from '../../api/modules/productsApi.ts';
import {
	getProductsFromCache,
	saveProductsToCache,
} from '../../services/cache/productCache.ts';
import CButton2 from '../../components/buttons/CButton2.tsx';

const PAGE_SIZE = 50;
const LOW_STOCK_THRESHOLD = 10;

const FILTERS = [
	{ key: 'all', label: 'All' },
	{ key: 'low', label: 'Low Stock' },
	{ key: 'in', label: 'In Stock' },
	{ key: 'out', label: 'Out of Stock' },
];

const ProductListScreen = ({ navigation }) => {

	const { vendorScope } = useVendor();

	if (vendorScope === null || vendorScope === 'ALL') {
		return (
			<View style={globalStyles.safeArea}>
				<SafeAreaView edges={['top']} style={{ backgroundColor: '#fff' }}>
					<CustomHomeHeader />
				</SafeAreaView>

				<View style={styles.emptyWrap}>
					<CText>Please select a vendor to use POS.</CText>
					<CButton2 style={{ padding: 8, borderRadius: 8}} title="Select Store" type={'info'} icon={'add'} onPress={() => navigation.navigate('Store')} />
				</View>
			</View>
		);
	}

	const vendorId = vendorScope;

	const [search, setSearch] = useState('');
	const [activeFilter, setActiveFilter] =
		useState<'all' | 'low' | 'in' | 'out'>('all');

	const [allLocalProducts, setAllLocalProducts] = useState<any[]>([]);
	const [visibleProducts, setVisibleProducts] = useState<any[]>([]);
	const [refreshing, setRefreshing] = useState(false);

	useEffect(() => {
		loadFromCache();
		fetchInitialFromServer();
	}, [vendorId]);

	const loadFromCache = async () => {
		const cached = await getProductsFromCache(vendorId);
		setAllLocalProducts(cached);
		setVisibleProducts(cached.slice(0, PAGE_SIZE));
	};

	const fetchInitialFromServer = async () => {
		try {
			setRefreshing(true);
			const res = await fetchProductsPage(vendorId, 1);
			const products = res.data || [];
			await saveProductsToCache(vendorId, products);
			setAllLocalProducts(products);
			setVisibleProducts(products.slice(0, PAGE_SIZE));
		} catch (e) {
			handleApiError(e);
		} finally {
			setRefreshing(false);
		}
	};

	const loadMoreLocal = () => {
		if (visibleProducts.length >= allLocalProducts.length) return;
		setVisibleProducts(prev => [
			...prev,
			...allLocalProducts.slice(prev.length, prev.length + PAGE_SIZE),
		]);
	};

	const syncProducts = async () => {
		try {
			const cached = await getProductsFromCache(vendorId);
			const lastId = cached.at(-1)?.id || 0;
			const fresh = await syncProductsApi(vendorId, lastId);
			if (!fresh.length) return;
			const merged = [...cached, ...fresh];
			await saveProductsToCache(vendorId, merged);
			setAllLocalProducts(merged);
			setVisibleProducts(merged.slice(0, visibleProducts.length));
		} catch (e) {
			handleApiError(e);
		}
	};

	const filteredProducts = useMemo(() => {
		return visibleProducts.filter(p => {
			const match =
				p.name?.toLowerCase().includes(search.toLowerCase()) ||
				p.barcode?.includes(search);
			if (!match) return false;
			if (activeFilter === 'low')
				return p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD;
			if (activeFilter === 'in')
				return p.stock > LOW_STOCK_THRESHOLD;
			if (activeFilter === 'out') return p.stock === 0;
			return true;
		});
	}, [visibleProducts, search, activeFilter]);

	const renderItem = ({ item }: any) => {
		const isLow = item.stock > 0 && item.stock <= LOW_STOCK_THRESHOLD;

		return (
			<View style={styles.rowCard}>
				<View style={styles.imageHolder}>
					<Icon name="image-outline" size={26} color="#aaa" />
				</View>

				<View style={styles.infoCol}>
					<CText style={styles.barcode}>{item.barcode}</CText>

					<View style={styles.namePriceRow}>
						<CText style={styles.name} numberOfLines={1}>
							{item.name}
						</CText>
						<CText style={styles.price}>
							₱ {formatNumber(item.price)}
						</CText>
					</View>

					<View style={styles.metaRow}>
						{isLow && (
							<View style={styles.lowStockBadge}>
								<CText style={styles.lowStockText}>LOW STOCK</CText>
							</View>
						)}
						{item.stock === 0 && (
							<View style={styles.outStockBadge}>
								<CText style={styles.outStockText}>OUT</CText>
							</View>
						)}
						<CText style={styles.stockText}>
							Stock: {item.stock}
						</CText>
					</View>
				</View>
			</View>
		);
	};

	return (
		<View style={globalStyles.safeArea}>
			<SafeAreaView edges={['top']} style={{ backgroundColor: '#fff' }}>
				<CustomHomeHeader />
			</SafeAreaView>

			<View style={styles.container}>
				<View style={styles.toolbar}>
					<View style={styles.searchCard}>
						<Icon name="search-outline" size={20} color="#777" />
						<TextInput
							value={search}
							onChangeText={setSearch}
							placeholder="Search name or barcode"
							placeholderTextColor="#999"
							style={styles.searchInput}
						/>
					</View>

					<TouchableOpacity
						onPress={syncProducts}
						style={styles.syncBtn}
					>
						<Icon name="sync" size={22} color="#fff" />
					</TouchableOpacity>
				</View>

				<View style={styles.filterRow}>
					{FILTERS.map(f => (
						<TouchableOpacity
							key={f.key}
							onPress={() => setActiveFilter(f.key as any)}
							style={[
								styles.filterChip,
								activeFilter === f.key && styles.filterChipActive,
							]}
						>
							<CText
								style={[
									styles.filterText,
									activeFilter === f.key &&
									styles.filterTextActive,
								]}
							>
								{f.label}
							</CText>
						</TouchableOpacity>
					))}
				</View>

				<FlatList
					data={filteredProducts}
					keyExtractor={item => String(item.id)}
					renderItem={renderItem}
					onEndReached={loadMoreLocal}
					onEndReachedThreshold={0.6}
					refreshing={refreshing}
					onRefresh={fetchInitialFromServer}
				/>

				<TouchableOpacity style={globalStyles.fab} activeOpacity={0.85} onPress={() => navigation.navigate('NewProduct')}>
					<Icon name="add" size={22} color="#fff" />
				</TouchableOpacity>

			</View>
		</View>
	);
};

export default ProductListScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 14,
	},

	emptyWrap: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},

	toolbar: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 10,
	},

	searchCard: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff',
		borderRadius: theme.radius.md,
		paddingHorizontal: 12,
		height: 50,
		elevation: 2,
	},

	searchInput: {
		flex: 1,
		marginLeft: 8,
		fontSize: 15,
		color: '#000',
	},

	syncBtn: {
		width: 50,
		height: 50,
		marginLeft: 10,
		borderRadius: theme.radius.md,
		backgroundColor: theme.colors.light.primary,
		alignItems: 'center',
		justifyContent: 'center',
		elevation: 2,
	},

	filterRow: {
		flexDirection: 'row',
		marginBottom: 10,
	},

	filterChip: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
		backgroundColor: '#eee',
		marginRight: 8,
	},

	filterChipActive: {
		backgroundColor: theme.colors.light.primary,
	},

	filterText: {
		fontSize: 12,
		color: '#555',
	},

	filterTextActive: {
		color: '#fff',
		fontWeight: '600',
	},

	rowCard: {
		flexDirection: 'row',
		backgroundColor: '#fff',
		borderRadius: theme.radius.md,
		padding: 10,
		marginBottom: 10,
		elevation: 2,
	},

	imageHolder: {
		width: 54,
		height: 54,
		borderRadius: 6,
		backgroundColor: '#f1f1f1',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 10,
	},

	infoCol: {
		flex: 1,
	},

	barcode: {
		fontSize: 10,
		color: '#777',
		marginBottom: 2,
	},

	namePriceRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},

	name: {
		flex: 1,
		fontSize: 14,
		fontWeight: '600',
		marginRight: 8,
	},

	price: {
		fontSize: 14,
		fontWeight: '700',
		color: theme.colors.light.primary,
	},

	metaRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 4,
	},

	lowStockBadge: {
		backgroundColor: '#ffe5e5',
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 4,
	},

	lowStockText: {
		fontSize: 9,
		fontWeight: '700',
		color: '#c62828',
	},

	outStockBadge: {
		backgroundColor: '#eee',
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 4,
	},

	outStockText: {
		fontSize: 9,
		fontWeight: '700',
		color: '#555',
	},

	stockText: {
		fontSize: 11,
		color: '#777',
		marginLeft: 8,
	},
});
