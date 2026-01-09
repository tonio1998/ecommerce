import React, { useState } from 'react';
import {
	View,
	StyleSheet,
	SafeAreaView,
	TouchableOpacity,
	TextInput,
	FlatList,
	ScrollView, Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { globalStyles } from '../theme/styles';
import { CText } from '../components/common/CText';
import { theme } from '../theme';
import CustomHomeHeader from '../components/layout/CustomHomeHeader';
import { formatNumber } from '../utils/format';


const CATEGORIES = [
	'All',
	'Electronics',
	'Fashion',
	'Home',
	'Food',
	'Beauty',
];

const PRODUCTS = [
	{
		id: 1,
		name: 'Portland Cement (40kg)',
		price: 275,
		category: 'Construction Materials',
		stock: 120,
		image: 'https://gratisongkir-storage.com/products/900x900/uKdcDZ0jJJQB.jpg',
	},
	{
		id: 2,
		name: 'Deformed Steel Bar (10mm)',
		price: 420,
		category: 'Steel & Metal',
		stock: 80,
		image: 'https://image.made-in-china.com/2f0j00fUhkFHSKnWqP/Latest-HRB400-Grade-Dia-10mm-Steel-Rebar-Deformed-Steel-Bar-Iron-Rods-with-Rib-Fe-500-Steel-Rebar.jpg',
	},
	{
		id: 3,
		name: 'Concrete Hollow Blocks (CHB)',
		price: 18,
		category: 'Construction Materials',
		stock: 1500,
		image: 'https://th.bing.com/th/id/R.78ad31b9cb6be0ee9602c354a7505917?rik=kFi2viGTE3h5tQ&riu=http%3a%2f%2fbhcldavaoconstruction.weebly.com%2fuploads%2f3%2f9%2f5%2f5%2f39551939%2fs716957615216130486_p2_i7_w640.jpeg&ehk=jwaFVv4drfgdE5wR4H%2fuOR5ic47YmmPqAhGMM1ZzLbA%3d&risl=&pid=ImgRaw&r=0',
	},
	{
		id: 4,
		name: 'Angle Grinder (4")',
		price: 2499,
		category: 'Power Tools',
		stock: 15,
		image: 'https://c.shld.net/rpx/i/s/i/spin/image/spin_prod_248872001??hei=64&wid=64&qlt=50',
	},
	{
		id: 5,
		name: 'Electric Drill Machine',
		price: 3199,
		category: 'Power Tools',
		stock: 12,
		image: 'https://m.media-amazon.com/images/I/81KCtYjRKdS._SL1500_.jpg',
	},
	{
		id: 6,
		name: 'PVC Pipe (2-inch, 3m)',
		price: 180,
		category: 'Plumbing',
		stock: 200,
		image: 'https://5.imimg.com/data5/SELLER/Default/2024/12/475799473/ZZ/GF/LL/58169238/casing-pipes-1000x1000.webp',
	},
	{
		id: 7,
		name: 'Construction Safety Helmet',
		price: 350,
		category: 'Safety Gear',
		stock: 45,
		image: 'https://agrarzone.com/media/36/7d/e6/1700636370/schutzhelm-gelb-main-jpg_689e268d2984c9c2.jpg',
	},
	{
		id: 8,
		name: 'Paint Roller Set',
		price: 299,
		category: 'Finishing',
		stock: 60,
		image: 'https://m.media-amazon.com/images/I/61FpKnqcuWL._AC_SL1500_.jpg',
	},
];



/* ===================== SCREEN ===================== */

const HomeScreen = () => {
	const [query, setQuery] = useState<string>('');        // SAFE string
	const [activeCategory, setActiveCategory] = useState<string>('All');

	// normalize search text (prevents toLowerCase crash)
	const safeQuery = (query ?? '').toString().toLowerCase();

	const filteredProducts = PRODUCTS.filter(item => {
		const matchCategory =
			activeCategory === 'All' || item.category === activeCategory;

		const matchQuery =
			(item.name ?? '').toLowerCase().includes(safeQuery);

		return matchCategory && matchQuery;
	});

	return (
		<>
			<CustomHomeHeader />

			<SafeAreaView style={globalStyles.safeArea}>
				<View style={globalStyles.p_2}>
					<View style={styles.searchBox}>
						<Icon name="search-outline" size={18} color="#999" />
						<TextInput
							placeholder="Search products…"
							value={query}
							onChangeText={text => setQuery(text ?? '')}
							style={styles.searchInput}
							placeholderTextColor={'#999'}
						/>
						{query.length > 0 && (
							<TouchableOpacity onPress={() => setQuery('')}>
								<Icon
									name="close-circle"
									size={18}
									color="#bbb"
								/>
							</TouchableOpacity>
						)}
					</View>
				</View>
				<View style={styles.categoryWrap}>
					<FlatList
						data={CATEGORIES}
						keyExtractor={item => item}
						horizontal
						showsHorizontalScrollIndicator={false}
						renderItem={({ item }) => (
							<TouchableOpacity
								style={[
									styles.categoryChip,
									activeCategory === item &&
									styles.categoryActive,
								]}
								onPress={() => setActiveCategory(item)}
							>
								<CText
									style={[
										styles.categoryText,
										activeCategory === item &&
										styles.categoryTextActive,
									]}
								>
									{item}
								</CText>
							</TouchableOpacity>
						)}
					/>
				</View>
				<ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
					<View style={styles.section}>
						<FlatList
							data={filteredProducts}
							keyExtractor={item => item.id.toString()}
							numColumns={2}
							scrollEnabled={false}
							columnWrapperStyle={{
								justifyContent: 'space-between',
								marginBottom: 14,
							}}
							renderItem={({ item }) => (
								<TouchableOpacity
									style={styles.productCard}
									activeOpacity={0.85}
								>
									<View style={styles.productImageWrap}>
										<Image
											source={{ uri: item.image }}
											style={{ width: '100%', height: '100%' }}
											resizeMode="cover"
										/>
									</View>

									<CText
										numberOfLines={2}
										style={styles.productName}
									>
										{item.name}
									</CText>

									<CText style={styles.productPrice}>
										₱ {formatNumber(item.price)}
									</CText>

									{item.stock <= 5 && (
										<View style={styles.stockBadge}>
											<CText style={styles.stockText}>
												Low stock
											</CText>
										</View>
									)}
								</TouchableOpacity>
							)}
							ListEmptyComponent={
								<CText style={styles.emptyText}>
									No products found
								</CText>
							}
						/>
					</View>
				</ScrollView>
			</SafeAreaView>
		</>
	);
};

export default HomeScreen;

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
	searchBox: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff',
		borderRadius: theme.radius.md,
		paddingHorizontal: 12,
		paddingVertical: 3,
		elevation: 1,
	},
	searchInput: {
		flex: 1,
		marginHorizontal: 10,
		fontSize: 14,
		color: '#000',
	},

	categoryWrap: {
		paddingHorizontal: 16,
		marginBottom: 10,
	},
	categoryChip: {
		paddingHorizontal: 14,
		paddingVertical: 8,
		borderRadius: theme.radius.md,
		backgroundColor: '#F1F1F1',
		marginRight: 10,
	},
	categoryActive: {
		backgroundColor: theme.colors.light.primary,
	},
	categoryText: {
		fontSize: 13,
		color: '#333',
	},
	categoryTextActive: {
		color: '#fff',
		fontWeight: '600',
	},

	section: {
		paddingHorizontal: 16,
	},

	productCard: {
		width: '48%',
		backgroundColor: '#fff',
		borderRadius: theme.radius.sm,
		overflow: 'hidden',
		elevation: 2,
	},
	productImageWrap: {
		height: 150,
		backgroundColor: '#F5F5F5',
		alignItems: 'center',
		justifyContent: 'center',
	},
	productName: {
		fontSize: 13,
		paddingHorizontal: 8,
		marginTop: 8,
		color: '#222',
	},
	productPrice: {
		fontSize: 15,
		fontWeight: '700',
		color: theme.colors.light.primary,
		paddingHorizontal: 8,
		marginTop: 6,
		marginBottom: 8,
	},

	stockBadge: {
		position: 'absolute',
		top: 8,
		left: 8,
		backgroundColor: theme.colors.light.danger,
		borderRadius: 6,
		paddingHorizontal: 6,
		paddingVertical: 2,
	},
	stockText: {
		fontSize: 10,
		color: '#fff',
	},

	emptyText: {
		paddingVertical: 20,
		color: '#777',
		textAlign: 'center',
	},
});
