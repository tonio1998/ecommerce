import React, { useContext, useEffect, useState } from 'react';
import {
	View,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

import { useAuth } from '../../context/AuthContext';
import { useLoading } from '../../context/LoadingContext';
import { NetworkContext } from '../../context/NetworkContext';
import { loginWithBiometric } from '../../hooks/useBiometrics';
import { authLogin, loginWithGoogle } from '../../api/modules/auth';
import { theme } from '../../theme';
import { CText } from '../../components/common/CText';
import BackHeader from '../../components/layout/BackHeader';
import checkBiometricSupport from '../../services/checkBiometricSupport';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_CLIENT_ID } from '../../../env';
import { handleApiError } from '../../utils/errorHandler';
import { isTablet } from '../../utils/responsive';

GoogleSignin.configure({
	webClientId: GOOGLE_CLIENT_ID,
	offlineAccess: true,
});

const SigninForm = ({ navigation }: any) => {
	const { isOnline } = useContext(NetworkContext);
	const { loginAuth } = useAuth();
	const { showLoading, hideLoading } = useLoading();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

	useEffect(() => {
		(async () => {
			const storedEmail = await AsyncStorage.getItem('biometricUserEmail');
			const supported = await checkBiometricSupport();
			const flag = await AsyncStorage.getItem(`biometricEnabled:${storedEmail}`);
			setIsBiometricEnabled(supported.supported && flag === 'true');
			await restoreSession();
		})();
	}, []);

	const restoreSession = async () => {
		try {
			const cached = await Keychain.getGenericPassword();
			if (!cached) return;
			const user = JSON.parse(cached.username);
			const token = await AsyncStorage.getItem('mobile');
			await loginAuth({
				user,
				token,
				roles: user.roles,
				permissions: user.permissions,
			});
		} catch {}
	};

	const handleLogin = async () => {
		if (!email || !password) {
			Alert.alert('Missing Information', 'Please enter email and password.');
			return;
		}
		try {
			showLoading('Signing in...');
			const res = await authLogin({ email, password });
			await loginAuth(res.data);
		} catch (err) {
			handleApiError(err, 'Login');
		} finally {
			hideLoading();
		}
	};

	const handleBiometricLogin = async () => {
		try {
			const session = await loginWithBiometric();
			if (session) await loginAuth(session);
		} catch (err) {
			handleApiError(err, 'Biometric');
		}
	};

	const handleGoogleLogin = async () => {
		try {
			await GoogleSignin.hasPlayServices();
			await GoogleSignin.signOut();
			const info = await GoogleSignin.signIn();
			showLoading('Signing in...');
			const res = await loginWithGoogle({
				token: info.data?.idToken,
				name: info.data?.user?.name,
				email: info.data?.user?.email,
				photo: info.data?.user?.photo,
			});
			await loginAuth(res.data);
		} catch (err) {
			handleApiError(err, 'Google Login');
		} finally {
			hideLoading();
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				style={styles.flex}
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
			>
				<BackHeader />

				<View style={styles.body}>
					<CText fontSize={26} fontStyle="SB">
						Welcome back
					</CText>
					<CText fontSize={13} style={styles.subtitle}>
						Sign in with your email and password
					</CText>

					<View style={styles.form}>
						<TextInput
							placeholder="Email address"
							placeholderTextColor="#9CA3AF"
							value={email}
							onChangeText={setEmail}
							style={styles.input}
							keyboardType="email-address"
							autoCapitalize="none"
						/>

						<TextInput
							placeholder="Password"
							placeholderTextColor="#9CA3AF"
							value={password}
							onChangeText={setPassword}
							secureTextEntry
							style={styles.input}
						/>
					</View>

					<TouchableOpacity style={styles.primaryBtn} onPress={handleLogin}>
						<CText style={styles.primaryText}>Sign in</CText>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.linkBtn}
						onPress={handleGoogleLogin}
					>
						<Icon name="logo-google" size={18} color="#DB4437" />
						<CText style={styles.linkText}>Continue with Google</CText>
					</TouchableOpacity>

					{isBiometricEnabled && (
						<TouchableOpacity
							style={styles.biometric}
							onPress={handleBiometricLogin}
						>
							<Icon
								name="finger-print-outline"
								size={26}
								color={theme.colors.light.primary}
							/>
							<CText style={styles.biometricText}>Use biometrics</CText>
						</TouchableOpacity>
					)}
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	flex: {
		flex: 1,
	},
	container: {
		flex: 1,
		backgroundColor: '#fff',
		paddingHorizontal: 24,
	},
	body: {
		marginTop: 150,
		width: isTablet() ? '60%' : '100%',
		alignSelf: 'center',
	},
	subtitle: {
		marginTop: 6,
		marginBottom: 32,
		color: '#6B7280',
	},
	form: {
		gap: 14,
	},
	input: {
		height: 52,
		borderWidth: 1,
		borderColor: '#E5E7EB',
		borderRadius: 8,
		paddingHorizontal: 14,
		fontSize: 15,
		color: '#111827',
	},
	primaryBtn: {
		marginTop: 24,
		height: 52,
		borderRadius: 8,
		backgroundColor: theme.colors.light.primary,
		justifyContent: 'center',
		alignItems: 'center',
	},
	primaryText: {
		color: '#fff',
		fontSize: 15,
		fontWeight: '600',
	},
	linkBtn: {
		marginTop: 18,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
	},
	linkText: {
		fontSize: 14,
		color: '#111827',
		fontWeight: '500',
	},
	biometric: {
		marginTop: 30,
		alignItems: 'center',
	},
	biometricText: {
		marginTop: 6,
		fontSize: 13,
		color: '#4B5563',
	},
});

export default SigninForm;
