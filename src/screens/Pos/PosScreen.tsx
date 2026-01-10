import React, { useState } from 'react';
import {
	View,
	StyleSheet,
	SafeAreaView,
	TouchableOpacity,
	FlatList,
	TextInput,
} from 'react-native';
import CustomHomeHeader from '../../components/layout/CustomHomeHeader.tsx';
import { globalStyles } from '../../theme/styles.ts';
import { CText } from '../../components/common/CText.tsx';
import { formatNumber } from '../../utils/format.ts';
import { theme } from '../../theme';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackHeader from '../../components/layout/BackHeader.tsx';

const INITIAL_CART = [
	{ id: '1', name: 'Coca-Cola 1.5L', qty: 2, price: 75 },
	{ id: '2', name: 'Instant Noodles', qty: 5, price: 14 },
	{ id: '3', name: 'Bottled Water 500ml', qty: 3, price: 15 },
	{ id: '4', name: 'Bread Loaf', qty: 1, price: 45 },
	{ id: '5', name: 'Eggs (per piece)', qty: 6, price: 9 },
	{ id: '6', name: 'Canned Sardines', qty: 4, price: 28 },
	{ id: '7', name: 'Laundry Detergent (Sachet)', qty: 5, price: 12 },
	{ id: '8', name: 'Shampoo (Sachet)', qty: 4, price: 7 },
	{ id: '9', name: 'Bath Soap', qty: 2, price: 35 },
	{ id: '10', name: 'Cooking Oil (250ml)', qty: 1, price: 55 },
	{ id: '11', name: 'Sugar (1kg)', qty: 1, price: 68 },
	{ id: '12', name: 'Rice (1kg)', qty: 2, price: 52 },
	{ id: '13', name: 'Chocolate Bar', qty: 3, price: 22 },
	{ id: '14', name: 'Coffee (Sachet)', qty: 6, price: 10 },
	{ id: '15', name: 'Biscuits Pack', qty: 2, price: 30 },
];


const PosScreen = ({navigation}) => {
	const [cart, setCart] = useState(INITIAL_CART);
	const [scanInput, setScanInput] = useState('');
	const insets = useSafeAreaInsets();

	const subtotal = cart.reduce(
		(sum, item) => sum + item.qty * item.price,
		0
	);
	const tax = subtotal * 0.12;
	const total = subtotal + tax;

	const updateQty = (id, value) => {
		const qty = Math.max(1, parseInt(value || '1', 10));

		setCart(prev =>
			prev.map(item =>
				item.id === id ? { ...item, qty } : item
			)
		);
	};

	const stepQty = (id, delta) => {
		setCart(prev =>
			prev.map(item =>
				item.id === id
					? { ...item, qty: Math.max(1, item.qty + delta) }
					: item
			)
		);
	};

	const removeItem = id => {
		setCart(prev => prev.filter(item => item.id !== id));
	};

	return (
		<>
			<BackHeader title={'POSify'} />
			<SafeAreaView style={[globalStyles.safeArea, {paddingTop: insets.top + 50}]}>
				<View style={styles.container}>
					<View style={styles.scannerCard}>
						<View style={styles.scanRow}>
							<Icon name="barcode-outline" size={22} color="#333" style={{marginLeft: 10}} />
							<TextInput
								value={scanInput}
								onChangeText={setScanInput}
								placeholder="Scan barcode or QR"
								style={styles.scanInput}
								placeholderTextColor="#999"
							/>
							<TouchableOpacity style={styles.scanBtn}>
								<Icon name="scan-outline" size={22} color="#fff" />
							</TouchableOpacity>
						</View>
					</View>
					<View style={styles.posActions}>
						<TouchableOpacity
							style={styles.actionBtn}
							onPress={() => navigation.navigate('PriceInquiry')}
						>
							<Icon name="wallet-outline" size={18} />
							<CText>Price Inquiry</CText>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.actionBtn}
							onPress={() => navigation.navigate('ProductSearch')}
						>
							<Icon name="search-outline" size={18} />
							<CText>Search Product</CText>
						</TouchableOpacity>
					</View>

					<View style={styles.cartCard}>
						<View style={styles.cartHeader}>
							<CText style={styles.cartTitle}>Cart</CText>
							<CText style={styles.cartCount}>
								{cart.length} items
							</CText>
						</View>

						<FlatList
							data={cart}
							keyExtractor={item => item.id}
							renderItem={({ item }) => (
								<View style={styles.cartRow}>
									<View style={styles.cartInfo}>
										<CText style={styles.cartName} numberOfLines={2}>
											{item.name}
										</CText>
										<CText style={styles.cartPrice}>
											₱ {formatNumber(item.price)}
										</CText>
									</View>

									<View style={styles.qtyControls}>
										<TouchableOpacity
											style={styles.qtyBtn}
											onPress={() =>
												stepQty(item.id, -1)
											}
										>
											<Icon name="remove" size={18} />
										</TouchableOpacity>

										<TextInput
											value={String(item.qty)}
											onChangeText={val =>
												updateQty(item.id, val)
											}
											keyboardType="numeric"
											style={styles.qtyInput}
										/>

										<TouchableOpacity
											style={styles.qtyBtn}
											onPress={() =>
												stepQty(item.id, 1)
											}
										>
											<Icon name="add" size={18} />
										</TouchableOpacity>
									</View>

									<View style={styles.cartRight}>
										<CText style={styles.rowTotal}>
											₱{' '}
											{formatNumber(
												item.qty * item.price
											)}
										</CText>

										<TouchableOpacity
											onPress={() =>
												removeItem(item.id)
											}
										>
											<Icon
												name="trash-outline"
												size={20}
												color={theme.colors.light.danger}
											/>
										</TouchableOpacity>
									</View>
								</View>
							)}
							ListEmptyComponent={
								<CText style={styles.emptyText}>
									Scan items to start
								</CText>
							}
						/>
					</View>

					<View style={styles.summaryCard}>
						<View style={styles.summaryRow}>
							<CText>Subtotal</CText>
							<CText>₱ {formatNumber(subtotal)}</CText>
						</View>

						<View style={styles.summaryRow}>
							<CText>Tax (12%)</CText>
							<CText>₱ {formatNumber(tax)}</CText>
						</View>

						<View style={styles.divider} />

						<View style={styles.summaryRow}>
							<CText style={styles.totalLabel}>Total</CText>
							<CText style={styles.totalValue}>
								₱ {formatNumber(total)}
							</CText>
						</View>
					</View>

					<View style={styles.actionRow}>
						<TouchableOpacity style={styles.holdBtn}>
							<Icon name="pause-outline" size={20} />
							<CText style={styles.actionText}>Hold</CText>
						</TouchableOpacity>

						<TouchableOpacity style={styles.clearBtn}>
							<Icon name="trash-outline" size={20} />
							<CText style={styles.actionText}>Clear</CText>
						</TouchableOpacity>

						<TouchableOpacity style={styles.payBtn}>
							<Icon name="cash-outline" size={22} color="#fff" />
							<CText style={styles.payText}>
								PAY ₱ {formatNumber(total)}
							</CText>
						</TouchableOpacity>
					</View>
				</View>
			</SafeAreaView>
		</>
	);
};

export default PosScreen;

const styles = StyleSheet.create({
	posActions: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginVertical: 10,
	},

	actionBtn: {
		width: '48%',
		backgroundColor: '#fff',
		padding: 5,
		borderRadius: 8,
		alignItems: 'center',
	},
	container: {
		flex: 1,
		padding: 14,
	},

	scannerCard: {
		backgroundColor: '#fff',
		borderRadius: theme.radius.md,
		padding: 10,
		elevation: 2,
		marginBottom: 2,
	},

	scanRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},

	scanInput: {
		flex: 1,
		marginHorizontal: 10,
		fontSize: 14,
		color: '#000',
	},

	scanBtn: {
		backgroundColor: theme.colors.light.primary,
		padding: 10,
		borderRadius: 8,
	},

	cartCard: {
		backgroundColor: '#fff',
		borderRadius: theme.radius.md,
		elevation: 2,
		flex: 1,
	},

	cartHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 12,
		borderBottomWidth: 0.5,
		borderBottomColor: '#eee',
	},

	cartTitle: {
		fontSize: 15,
		fontWeight: '700',
	},

	cartCount: {
		fontSize: 12,
		color: '#777',
	},

	cartRow: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 12,
		borderBottomWidth: 0.5,
		borderBottomColor: '#eee',
	},

	cartInfo: {
		flex: 2,
	},

	cartName: {
		fontSize: 13,
		fontWeight: '600',
	},

	cartPrice: {
		fontSize: 12,
		color: '#777',
		marginTop: 2,
	},

	qtyControls: {
		flexDirection: 'row',
		alignItems: 'center',
	},

	qtyBtn: {
		width: 28,
		height: 28,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: '#ccc',
		alignItems: 'center',
		justifyContent: 'center',
	},

	qtyInput: {
		width: 36,
		height: 28,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 6,
		textAlign: 'center',
		marginHorizontal: 4,
		fontSize: 14,
		color: '#000',
		paddingVertical: 0,
	},

	cartRight: {
		flex: 1,
		alignItems: 'flex-end',
	},

	rowTotal: {
		fontSize: 13,
		fontWeight: '700',
		marginBottom: 6,
	},

	emptyText: {
		padding: 20,
		textAlign: 'center',
		color: '#777',
	},

	summaryCard: {
		backgroundColor: '#fff',
		borderRadius: theme.radius.md,
		padding: 12,
		elevation: 2,
		marginTop: 10,
	},

	summaryRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 6,
	},

	divider: {
		height: 1,
		backgroundColor: '#eee',
		marginVertical: 8,
	},

	totalLabel: {
		fontSize: 15,
		fontWeight: '700',
	},

	totalValue: {
		fontSize: 16,
		fontWeight: '800',
		color: theme.colors.light.primary,
	},

	actionRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 12,
	},

	holdBtn: {
		width: '22%',
		backgroundColor: '#f1f1f1',
		borderRadius: theme.radius.md,
		paddingVertical: 12,
		alignItems: 'center',
	},

	clearBtn: {
		width: '22%',
		backgroundColor: '#f1f1f1',
		borderRadius: theme.radius.md,
		paddingVertical: 12,
		alignItems: 'center',
	},

	actionText: {
		fontSize: 11,
		marginTop: 4,
	},

	payBtn: {
		width: '52%',
		backgroundColor: theme.colors.light.primary,
		borderRadius: theme.radius.md,
		paddingVertical: 12,
		alignItems: 'center',
	},

	payText: {
		color: '#fff',
		fontWeight: '700',
		marginTop: 4,
	},
});
