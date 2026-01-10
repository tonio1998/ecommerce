import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Dimensions, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { theme } from '../theme';
import { CText } from '../components/common/CText';

import HomeScreen from '../Shared/HomeScreen';
import ProductListScreen from '../screens/Pos/ProductListScreen.tsx';
import { useAccess } from '../hooks/useAccess.ts';
import ProfileScreen from '../Shared/User/UserProfileScreen.tsx';
import ManageVendorsScreen from '../Shared/ManageVendorsScreen.tsx';
import { useVendor } from '../context/VendorContext.tsx';

const Tab = createBottomTabNavigator();
const colors = theme.colors.light;

function useOrientation() {
	const [isLandscape, setIsLandscape] = useState(
		Dimensions.get('window').width > Dimensions.get('window').height
	);

	useEffect(() => {
		const sub = Dimensions.addEventListener('change', ({ window }) => {
			setIsLandscape(window.width > window.height);
		});
		return () => sub?.remove?.();
	}, []);

	return isLandscape;
}

export default function BottomTabNav() {
	const isLandscape = useOrientation();
	const { hasRole, hasAnyRole } = useAccess();
	const { vendorScope, setVendorScope } = useVendor();

	const TAB_HEIGHT = isLandscape ? 52 : 70;

	const getIcon = (route: string, focused: boolean) => {
		switch (route) {
			case 'Home':
				return focused ? 'home' : 'home-outline';
			case 'Products':
				return focused ? 'cube' : 'cube-outline';
			case 'Me':
				return focused ? 'person' : 'person-outline';
				case 'Profile':
				return focused ? 'person' : 'person-outline';
			case 'Store':
				return focused ? 'storefront' : 'storefront-outline';
			case 'POS':
				return focused ? 'barcode' : 'barcode-outline';

			default:
				return 'ellipse-outline';
		}
	};

	return (
		<Tab.Navigator
			initialRouteName="Home"
			screenOptions={({ route }) => ({
				headerShown: false,

				tabBarIcon: ({ focused }) => (
					<Icon
						name={getIcon(route.name, focused)}
						size={22}
						color={focused ? colors.primary : '#A0A0A0'}
					/>
				),

				tabBarLabel: ({ focused }) => (
					<CText
						style={{
							fontSize: 10,
							marginTop: 2,
							color: focused ? colors.primary : '#A0A0A0',
						}}
					>
						{route.name}
					</CText>
				),

				tabBarStyle: {
					height: TAB_HEIGHT,
					paddingTop: 6,
					paddingBottom: 6,
					backgroundColor: colors.card,
					borderTopWidth: 0.5,
					borderTopColor: '#E5E5E5',
					elevation: 6,
				},
			})}
		>
			<Tab.Screen name="Home" component={HomeScreen} />
			<Tab.Screen name="Products" component={ProductListScreen} />
			{vendorScope !== null && vendorScope !== 'ALL' && (
				<Tab.Screen name="POS" component={ManageVendorsScreen} />
			)}
			<Tab.Screen name="Store" component={ManageVendorsScreen} />
		</Tab.Navigator>
	);
}
