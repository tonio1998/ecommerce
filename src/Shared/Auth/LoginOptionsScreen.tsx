import React, { useCallback, useEffect, useState } from 'react';
import {
	View,
	StyleSheet,
	Image,
	TouchableOpacity,
	StatusBar,
	Dimensions,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { theme } from '../../theme';
import { CText } from '../../components/common/CText';
import { useAuth } from '../../context/AuthContext';
import { useLoading } from '../../context/LoadingContext';
import { useAlert } from '../../components/CAlert';
import checkBiometricSupport from '../../services/checkBiometricSupport';
import { loginWithBiometric } from '../../hooks/useBiometrics';
import { loginWithGoogle } from '../../api/modules/auth';
import { APP_NAME, TAGLINE, GOOGLE_CLIENT_ID } from '../../../env';
import { isTablet } from '../../utils/responsive';
import { SafeAreaView } from 'react-native-safe-area-context';
import { handleApiError } from '../../utils/errorHandler.ts';
import auth from '@react-native-firebase/auth';

const { width } = Dimensions.get('window');

GoogleSignin.configure({
	webClientId: GOOGLE_CLIENT_ID,
	offlineAccess: true,
	scopes: ['profile', 'email'],
});

export default function LoginOptionsScreen() {
	const navigation = useNavigation();
	const { loginAuth } = useAuth();
	const { showLoading, hideLoading } = useLoading();
	const { showAlert } = useAlert();

	const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

	useFocusEffect(
		useCallback(() => {
			StatusBar.setBarStyle('dark-content');
			StatusBar.setBackgroundColor('#ffffff');
		}, [])
	);

	useEffect(() => {
		(async () => {
			const email = await AsyncStorage.getItem('biometricUserEmail');
			const flag = await AsyncStorage.getItem(`biometricEnabled:${email}`);
			const support = await checkBiometricSupport();
			setIsBiometricEnabled(support.supported && flag === 'true');
		})();
	}, []);

	const handleBiometricLogin = async () => {
		try {
			showLoading('Signing in...');
			const session = await loginWithBiometric();
			if (session) {
				await loginAuth(session);
				await AsyncStorage.setItem('isLoggedIn', 'true');
			}
		} catch {
			showAlert('error', 'Login Failed', 'Biometric authentication failed.');
		} finally {
			hideLoading();
		}
	};

	const handleGoogleLogin = async () => {
		try {
			await GoogleSignin.hasPlayServices();
			await GoogleSignin.signOut();

			const userInfo = await GoogleSignin.signIn();
			const userData = userInfo?.data;

			const idToken = userData?.idToken;
			if (!idToken) {
				throw new Error('No Google ID token returned');
			}

			showLoading('Logging in...');

			const googleCredential =
				auth.GoogleAuthProvider.credential(idToken);

			await auth().signInWithCredential(googleCredential);


			const response = await loginWithGoogle({
				token: idToken,
				email: userData?.user?.email,
			});

			await loginAuth(response.data);
		} catch (error) {
			console.error(
				'Google login failed:',
				error.response?.data || error.message
			);

			handleApiError(error, 'Google Login');

			showAlert(
				'error',
				'Error',
				error?.response?.data?.message ||
				error?.message ||
				'Google login failed'
			);
		} finally {
			hideLoading();
		}
	};


	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="dark-content" />

			<View style={styles.header}>
				<Image
					source={require('../../../assets/img/ic_launcher.png')}
					style={styles.logo}
				/>
				<CText fontSize={28} fontStyle="SB">
					{APP_NAME}
				</CText>
				<CText fontSize={13} style={styles.tagline}>
					{TAGLINE}
				</CText>
			</View>

			<View style={styles.body}>
				<TouchableOpacity style={styles.primaryBtn} onPress={handleGoogleLogin}>
					<Icon name="logo-google" size={20} color="#DB4437" />
					<CText style={styles.primaryText}>Continue with Google</CText>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.secondaryBtn}
					onPress={() => navigation.navigate('Login')}
				>
					<CText style={styles.secondaryText}>Login with Email & Password</CText>
				</TouchableOpacity>

				{isBiometricEnabled && (
					<TouchableOpacity
						style={styles.biometric}
						onPress={handleBiometricLogin}
					>
						<Icon
							name="finger-print-outline"
							size={28}
							color={theme.colors.light.primary}
						/>
						<CText style={styles.biometricText}>Use biometrics</CText>
					</TouchableOpacity>
				)}
			</View>

			<View style={styles.footer}>
				<CText fontSize={11} style={styles.footerText}>
					© 2026 All rights reserved
				</CText>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		paddingHorizontal: 24,
	},
	header: {
		alignItems: 'center',
		marginTop: 50,
	},
	logo: {
		width: 72,
		height: 72,
		marginBottom: 12,
	},
	tagline: {
		marginTop: 4,
		color: '#666',
	},
	body: {
		marginTop: 50,
		width: isTablet() ? '60%' : '100%',
		alignSelf: 'center',
	},
	primaryBtn: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 8,
		paddingVertical: 14,
	},
	primaryText: {
		marginLeft: 10,
		fontSize: 15,
		fontWeight: '600',
		color: '#222',
	},
	secondaryBtn: {
		marginTop: 16,
		alignItems: 'center',
	},
	secondaryText: {
		fontSize: 14,
		color: theme.colors.light.primary,
		fontWeight: '500',
	},
	biometric: {
		marginTop: 30,
		alignItems: 'center',
	},
	biometricText: {
		marginTop: 6,
		fontSize: 13,
		color: '#444',
	},
	footer: {
		alignItems: 'center',
		marginTop: 'auto',
		paddingVertical: 20,
	},
	footerText: {
		color: '#999',
	},
});
