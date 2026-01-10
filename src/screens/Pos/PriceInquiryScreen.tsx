import React, { useState } from 'react';
import {
	View,
	SafeAreaView,
	TouchableOpacity,
	TextInput,
	FlatList,
	StyleSheet,
	Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { CText } from '../../components/common/CText';
import { globalStyles } from '../../theme/styles';
import { formatNumber } from '../../utils/format';
import { theme } from '../../theme';
import BackHeader from '../../components/layout/BackHeader.tsx';

const PRODUCTS = [
	{
		id: 'p1',
		name: 'Coca-Cola 1.5L',
		price: 75,
		barcode: '4803925123456',
		image: null,
	},
	{
		id: 'p2',
		name: 'Instant Noodles',
		price: 14,
		barcode: '4800012345678',
		image: null,
	},
	{
		id: 'p3',
		name: 'Bread Loaf',
		price: 45,
		barcode: '4809988776655',
		image: null,
	},
	{
		id: 'p4',
		name: 'Bottled Water 500ml',
		price: 15,
		barcode: '4801234567890',
		image: null,
	},
];

const PriceInquiryScreen = ({ navigation }) => {
	const [query, setQuery] = useState('');

	const filtered = PRODUCTS.filter(p =>
		p.name.toLowerCase().includes(query.toLowerCase()) ||
		p.barcode.includes(query)
	);

	return (
		<>
			<BackHeader title={'Price Inquiry'} />
			<SafeAreaView style={[globalStyles.safeArea, {paddingTop: 90}]}>
				<View style={styles.container}>

					<View style={styles.searchBox}>
						<Icon name="barcode-outline" size={18} color="#555" />
						<TextInput
							value={query}
							onChangeText={setQuery}
							placeholder="Scan or enter barcode / product name"
							style={styles.searchInput}
							placeholderTextColor="#999"
						/>
						<TouchableOpacity style={styles.scanBtn}>
							<Icon name="scan-outline" size={22} color="#fff" />
						</TouchableOpacity>
					</View>

					<FlatList
						data={filtered}
						keyExtractor={item => item.id}
						renderItem={({ item }) => (
							<View style={styles.card}>
								<View style={styles.imageBox}>
									{item.image ? (
										<Image
											source={{ uri: item.image }}
											style={styles.image}
										/>
									) : (
										<Icon
											name="image-outline"
											size={40}
											color="#aaa"
										/>
									)}
								</View>

								<View style={styles.info}>
									<CText style={styles.name}>
										{item.name}
									</CText>

									<CText style={styles.barcode}>
										Barcode: {item.barcode}
									</CText>

									<CText style={styles.price}>
										₱ {formatNumber(item.price)}
									</CText>
								</View>
							</View>
						)}
						ListEmptyComponent={
							<CText style={styles.emptyText}>
								No product found
							</CText>
						}
					/>
				</View>
			</SafeAreaView>
		</>
	);
};

export default PriceInquiryScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},

	backBtn: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
	},

	backText: {
		marginLeft: 6,
		fontSize: 13,
	},

	title: {
		fontSize: 18,
		fontWeight: '700',
		marginBottom: 12,
	},

	searchBox: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff',
		borderRadius: theme.radius.md,
		paddingHorizontal: 10,
		paddingVertical: 6,
		elevation: 2,
		marginBottom: 12,
	},

	searchInput: {
		flex: 1,
		marginHorizontal: 8,
		fontSize: 14,
		color: '#000',
	},

	scanBtn: {
		backgroundColor: theme.colors.light.primary,
		padding: 8,
		borderRadius: 6,
	},

	card: {
		flexDirection: 'row',
		backgroundColor: '#fff',
		borderRadius: theme.radius.md,
		padding: 12,
		marginBottom: 10,
		elevation: 2,
	},

	imageBox: {
		width: 70,
		height: 70,
		borderRadius: 8,
		backgroundColor: '#f1f1f1',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
	},

	image: {
		width: '100%',
		height: '100%',
		borderRadius: 8,
	},

	info: {
		flex: 1,
		justifyContent: 'center',
	},

	name: {
		fontSize: 14,
		fontWeight: '700',
		marginBottom: 2,
	},

	barcode: {
		fontSize: 11,
		color: '#777',
		marginBottom: 4,
	},

	price: {
		fontSize: 16,
		fontWeight: '800',
		color: theme.colors.light.primary,
	},

	emptyText: {
		textAlign: 'center',
		marginTop: 20,
		color: '#777',
	},
});
