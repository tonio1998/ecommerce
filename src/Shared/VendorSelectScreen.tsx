import { TouchableOpacity, View } from 'react-native';
import { CText } from '../components/common/CText.tsx';
import { useVendor } from '../context/VendorContext.tsx';
import styles from 'react-native-webview/lib/WebView.styles';

const VendorSelectScreen = () => {
	const { setVendorId } = useVendor();

	const selectVendor = (id: number) => {
		setVendorId(id);
	};

	return (
		<View style={styles.container}>
			<CText>Select Store</CText>

			<TouchableOpacity onPress={() => selectVendor(1)}>
				<CText>Store 1</CText>
			</TouchableOpacity>

			<TouchableOpacity onPress={() => selectVendor(2)}>
				<CText>Store 2</CText>
			</TouchableOpacity>
		</View>
	);
};

export default VendorSelectScreen;