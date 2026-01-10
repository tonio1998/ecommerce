import React, { useEffect, useState } from 'react';
import {
	View,
	FlatList,
	TouchableOpacity,
	StyleSheet,
	Modal,
	TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CText } from '../components/common/CText';
import { useVendor } from '../context/VendorContext';
import {
	getVendors,
	toggleVendor,
	createVendor,
} from '../api/modules/vendorsApi';
import { theme } from '../theme';
import { globalStyles } from '../theme/styles';
import CustomHomeHeader from '../components/layout/CustomHomeHeader';
import { handleApiError } from '../utils/errorHandler';
import IosBottomSheet from '../components/modals/IosBottomSheet.tsx';

const ManageVendorsScreen = () => {
	const { vendorScope, setVendorScope } = useVendor();

	const [vendors, setVendors] = useState<any[]>([]);
	const [refreshing, setRefreshing] = useState(false);

	const [showCreate, setShowCreate] = useState(false);
	const [shopName, setShopName] = useState('');
	const [address, setAddress] = useState('');
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		loadVendors();
	}, []);

	const loadVendors = async () => {
		try {
			setRefreshing(true);
			const data = await getVendors();
			setVendors(data || []);
		} catch (error) {
			handleApiError(error, 'Failed to load vendors');
		} finally {
			setRefreshing(false);
		}
	};

	const setSessionVendor = (id: number) => {
		setVendorScope(id);
	};

	const setAllVendors = () => {
		setVendorScope('ALL');
	};

	const toggleStatus = async (id: number) => {
		try {
			await toggleVendor(id);
			loadVendors();
		} catch (error) {
			handleApiError(error);
		}
	};

	const submitCreateVendor = async () => {
		if (!shopName.trim()) return;

		try {
			setSaving(true);
			await createVendor({
				shop_name: shopName,
				address,
			});
			setShopName('');
			setAddress('');
			setShowCreate(false);
			loadVendors();
		} catch (error) {
			handleApiError(error, 'Failed to create store');
		} finally {
			setSaving(false);
		}
	};

	const renderItem = ({ item }: any) => {
		const isSessioned = vendorScope === item.id;
		const isActiveStore = item.is_active;

		return (
			<View style={[styles.card, isSessioned && styles.sessionCard]}>
				<View style={styles.info}>
					<CText style={styles.name}>{item.shop_name}</CText>
					<CText fontSize={14}>{item.address}</CText>

					<View style={styles.badgeRow}>
						<CText style={styles.storeStatus}>
							Store:{' '}
							<CText
								style={[
									styles.statusText,
									isActiveStore
										? styles.active
										: styles.inactive,
								]}
							>
								{isActiveStore ? 'Active' : 'Inactive'}
							</CText>
						</CText>

						{isSessioned && (
							<View style={styles.sessionBadge}>
								<CText style={styles.sessionText}>
									CURRENT SESSION
								</CText>
							</View>
						)}
					</View>
				</View>

				<View style={styles.actions}>
					<TouchableOpacity
						disabled={!isActiveStore}
						style={[
							styles.sessionBtn,
							isSessioned && styles.sessionBtnActive,
							!isActiveStore && styles.disabledBtn,
						]}
						onPress={() => setSessionVendor(item.id)}
					>
						<CText
							style={[
								styles.sessionBtnText,
								isSessioned && styles.sessionBtnTextActive,
							]}
						>
							{isSessioned ? 'Active Session' : 'Set as Session'}
						</CText>
					</TouchableOpacity>

					<TouchableOpacity
						style={[
							styles.toggleBtn,
							isActiveStore
								? styles.disableBtn
								: styles.enableBtn,
						]}
						onPress={() => toggleStatus(item.id)}
					>
						<CText style={styles.toggleText}>
							{isActiveStore ? 'Disable' : 'Enable'}
						</CText>
					</TouchableOpacity>
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
				<View style={styles.topRow}>
					<TouchableOpacity
						onPress={setAllVendors}
						style={[
							styles.allBtn,
							vendorScope === 'ALL' && styles.sessionCard,
						]}
					>
						<CText style={styles.allText}>
							All Vendors (Reports)
						</CText>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => setShowCreate(true)}
						style={styles.createBtn}
					>
						<CText style={styles.createText}>+ New Store</CText>
					</TouchableOpacity>
				</View>

				<FlatList
					data={vendors}
					keyExtractor={item => String(item.id)}
					renderItem={renderItem}
					refreshing={refreshing}
					onRefresh={loadVendors}
					contentContainerStyle={{ paddingBottom: 20 }}
					ListEmptyComponent={
						!refreshing && (
							<CText style={styles.emptyText}>
								No vendors found
							</CText>
						)
					}
				/>
			</View>

			<IosBottomSheet
				visible={showCreate}
				onClose={() => setShowCreate(false)}
				title="Create New Store"
			>
				<TextInput
					value={shopName}
					onChangeText={setShopName}
					placeholder="Store name"
					style={globalStyles.input}
					placeholderTextColor="#999"
				/>

				<TextInput
					value={address}
					onChangeText={setAddress}
					placeholder="Address"
					style={globalStyles.input}
					placeholderTextColor="#999"
				/>

				<View style={styles.modalActions}>
					<TouchableOpacity
						onPress={() => setShowCreate(false)}
						style={styles.cancelBtn}
					>
						<CText>Cancel</CText>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={submitCreateVendor}
						style={styles.saveBtn}
						disabled={saving}
					>
						<CText style={{ color: '#fff' }}>
							Save
						</CText>
					</TouchableOpacity>
				</View>
			</IosBottomSheet>
		</View>
	);
};

export default ManageVendorsScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: '#f6f6f6',
	},

	topRow: {
		flexDirection: 'row',
		marginBottom: 16,
	},

	allBtn: {
		flex: 1,
		backgroundColor: theme.colors.light.primary,
		paddingVertical: 12,
		borderRadius: 8,
		alignItems: 'center',
		marginRight: 8,
	},

	createBtn: {
		backgroundColor: '#fff',
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 8,
		elevation: 2,
	},

	createText: {
		fontWeight: '700',
		color: theme.colors.light.primary,
	},

	allText: {
		color: '#fff',
		fontWeight: '700',
		fontSize: 14,
	},

	card: {
		backgroundColor: '#fff',
		borderRadius: 10,
		padding: 14,
		marginBottom: 12,
		elevation: 2,
	},

	sessionCard: {
		borderWidth: 2,
		borderColor: theme.colors.light.primary,
	},

	info: {
		marginBottom: 10,
	},

	name: {
		fontSize: 16,
		fontWeight: '700',
		marginBottom: 6,
	},

	badgeRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},

	storeStatus: {
		fontSize: 12,
		color: '#666',
	},

	statusText: {
		fontWeight: '700',
	},

	active: {
		color: '#2e7d32',
	},

	inactive: {
		color: '#c62828',
	},

	sessionBadge: {
		backgroundColor: theme.colors.light.primary,
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 12,
	},

	sessionText: {
		color: '#fff',
		fontSize: 10,
		fontWeight: '700',
	},

	actions: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 10,
	},

	sessionBtn: {
		flex: 1,
		backgroundColor: '#e3f2fd',
		paddingVertical: 8,
		borderRadius: 6,
		alignItems: 'center',
		marginRight: 8,
	},

	sessionBtnActive: {
		backgroundColor: theme.colors.light.primary,
	},

	sessionBtnText: {
		color: '#1565c0',
		fontWeight: '600',
		fontSize: 13,
	},

	sessionBtnTextActive: {
		color: '#fff',
	},

	toggleBtn: {
		flex: 1,
		paddingVertical: 8,
		borderRadius: 6,
		alignItems: 'center',
	},

	enableBtn: {
		backgroundColor: '#e8f5e9',
	},

	disableBtn: {
		backgroundColor: '#ffebee',
	},

	toggleText: {
		fontWeight: '600',
		fontSize: 13,
	},

	disabledBtn: {
		opacity: 0.5,
	},

	emptyText: {
		textAlign: 'center',
		marginTop: 40,
		color: '#777',
	},

	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.4)',
		justifyContent: 'center',
		alignItems: 'center',
	},

	modalCard: {
		width: '85%',
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 16,
	},

	modalTitle: {
		fontSize: 16,
		fontWeight: '700',
		marginBottom: 12,
	},

	input: {
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 6,
		paddingHorizontal: 10,
		paddingVertical: 8,
		marginBottom: 10,
	},

	modalActions: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		marginTop: 10,
	},

	cancelBtn: {
		paddingVertical: 10,
		paddingHorizontal: 16,
		marginRight: 10,
	},

	saveBtn: {
		backgroundColor: theme.colors.light.primary,
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 6,
	},
});
