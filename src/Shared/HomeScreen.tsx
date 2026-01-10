import React from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { globalStyles } from '../theme/styles';
import { CText } from '../components/common/CText';
import { theme } from '../theme';
import CustomHomeHeader from '../components/layout/CustomHomeHeader';
import { formatNumber } from '../utils/format';

const QUICK_LINKS = [
	{ id: 'sale', label: 'New Sale', icon: 'cart-outline', Screen: 'POS' },
	{ id: 'inventory', label: 'Inventory', icon: 'archive-outline', Screen: 'Inventory' },
	{ id: 'products', label: 'Products', icon: 'cube-outline', Screen: 'Products' },
	{ id: 'reports', label: 'Reports', icon: 'bar-chart-outline' },
];

const RECENT_TRANSACTIONS = [
	{ id: 'TRX-10021', time: '10:32 AM', total: 245 },
	{ id: 'TRX-10020', time: '10:18 AM', total: 1280 },
	{ id: 'TRX-10019', time: '09:54 AM', total: 560 },
	{ id: 'TRX-10018', time: '09:20 AM', total: 95 },
];

const HomeScreen = ({ navigation }) => {
	return (
		<View style={globalStyles.safeArea}>
			<SafeAreaView edges={['top']} style={{ backgroundColor: '#fff' }}>
				<CustomHomeHeader />
			</SafeAreaView>
			<View style={{ flex: 1 }}>
				<ScrollView contentContainerStyle={styles.scrollContent}>
					<View style={styles.container}>
						<View style={styles.kpiRow}>
							<View style={styles.kpiCard}>
								<Icon name="cash-outline" size={24} color={theme.colors.light.primary} />
								<CText style={styles.kpiLabel}>Total Sales (Today)</CText>
								<CText style={styles.kpiValue}>₱ {formatNumber(18450)}</CText>
							</View>

							<View style={styles.kpiCard}>
								<Icon name="receipt-outline" size={24} color={theme.colors.light.primary} />
								<CText style={styles.kpiLabel}>Transactions</CText>
								<CText style={styles.kpiValue}>42</CText>
							</View>
						</View>

						{/* KPI ROW 2 */}
						<View style={styles.kpiRow}>
							<View style={styles.kpiCard}>
								<Icon name="cube-outline" size={24} color={theme.colors.light.primary} />
								<CText style={styles.kpiLabel}>Products</CText>
								<CText style={styles.kpiValue}>1,236</CText>
							</View>

							<View style={styles.kpiCardDanger}>
								<Icon name="alert-circle-outline" size={24} color="#fff" />
								<CText style={styles.kpiLabelDanger}>Low Stock</CText>
								<CText style={styles.kpiValueDanger}>14</CText>
							</View>
						</View>

						{/* QUICK LINKS */}
						<View style={styles.section}>
							<CText style={styles.sectionTitle}>Quick Links</CText>
							<View style={styles.quickLinksRow}>
								{QUICK_LINKS.map(item => (
									<TouchableOpacity
										key={item.id}
										style={styles.quickLinkCard}
										activeOpacity={0.8}
										onPress={() => item.Screen && navigation.navigate(item.Screen)}
									>
										<Icon name={item.icon} size={26} color={theme.colors.light.primary} />
										<CText style={styles.quickLinkText}>{item.label}</CText>
									</TouchableOpacity>
								))}
							</View>
						</View>

						{/* RECENT TRANSACTIONS */}
						<View style={styles.section}>
							<CText style={styles.sectionTitle}>Recent Transactions</CText>
							<View style={styles.tableCard}>
								<FlatList
									data={RECENT_TRANSACTIONS}
									keyExtractor={item => item.id}
									scrollEnabled={false}
									renderItem={({ item }) => (
										<View style={styles.transactionRow}>
											<View>
												<CText style={styles.txId}>{item.id}</CText>
												<CText style={styles.txTime}>{item.time}</CText>
											</View>
											<CText style={styles.txAmount}>
												₱ {formatNumber(item.total)}
											</CText>
										</View>
									)}
								/>
							</View>
						</View>
					</View>
				</ScrollView>
			</View>
		</View>
	);
};

export default HomeScreen;
const styles = StyleSheet.create({
	scrollContent: {
	},

	container: {
		paddingHorizontal: 16,
		paddingTop: 12,
	},

	kpiRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 14,
	},

	kpiCard: {
		width: '48%',
		backgroundColor: '#fff',
		borderRadius: theme.radius.md,
		padding: 16,
		elevation: 2,
	},

	kpiCardDanger: {
		width: '48%',
		backgroundColor: theme.colors.light.danger,
		borderRadius: theme.radius.md,
		padding: 16,
		elevation: 2,
	},

	kpiLabel: {
		marginTop: 6,
		fontSize: 12,
		color: '#555',
	},

	kpiValue: {
		marginTop: 4,
		fontSize: 18,
		fontWeight: '700',
		color: '#222',
	},

	kpiLabelDanger: {
		marginTop: 6,
		fontSize: 12,
		color: '#fff',
	},

	kpiValueDanger: {
		marginTop: 4,
		fontSize: 18,
		fontWeight: '700',
		color: '#fff',
	},

	section: {
		marginTop: 22,
	},

	sectionTitle: {
		fontSize: 16,
		fontWeight: '700',
		marginBottom: 12,
		color: '#222',
	},

	quickLinksRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		flexWrap: 'wrap',
	},

	quickLinkCard: {
		width: '48%',
		backgroundColor: '#fff',
		borderRadius: theme.radius.md,
		paddingVertical: 18,
		alignItems: 'center',
		marginBottom: 12,
		elevation: 2,
	},

	quickLinkText: {
		marginTop: 6,
		fontSize: 13,
		color: '#333',
	},

	tableCard: {
		backgroundColor: '#fff',
		borderRadius: theme.radius.md,
		elevation: 2,
	},

	transactionRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 14,
		borderBottomWidth: 0.5,
		borderBottomColor: '#eee',
	},

	txId: {
		fontSize: 13,
		fontWeight: '600',
		color: '#222',
	},

	txTime: {
		fontSize: 11,
		color: '#777',
		marginTop: 2,
	},

	txAmount: {
		fontSize: 14,
		fontWeight: '700',
		color: theme.colors.light.primary,
	},
});
