import React from 'react';
import { FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { CText } from '../../components/common/CText.tsx';
import { globalStyles } from '../../theme/styles.ts';
import { formatNumber } from '../../utils/format.ts';

const PRODUCTS = [
	{ id: 'p1', name: 'Coca-Cola 1.5L', price: 75 },
	{ id: 'p2', name: 'Instant Noodles', price: 14 },
	{ id: 'p3', name: 'Bread Loaf', price: 45 },
];

const ProductSearchScreen = ({ navigation }) => {
	return (
		<SafeAreaView style={globalStyles.safeArea}>
			<FlatList
				data={PRODUCTS}
				keyExtractor={i => i.id}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={{ padding: 16 }}
						onPress={() =>
							navigation.navigate('POS', {
								selectedProduct: item,
							})
						}
					>
						<CText>{item.name}</CText>
						<CText>₱ {formatNumber(item.price)}</CText>
					</TouchableOpacity>
				)}
			/>
		</SafeAreaView>
	);
};

export default ProductSearchScreen;
