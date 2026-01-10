import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type VendorScope = number | 'ALL' | null;

type VendorContextType = {
	vendorScope: VendorScope;
	setVendorScope: (scope: VendorScope) => void;
	loading: boolean;
};

const STORAGE_KEY = 'active_vendor_scope';

const VendorContext = createContext<VendorContextType>({
	vendorScope: null,
	setVendorScope: () => {},
	loading: true,
});

export const VendorProvider = ({ children }: any) => {
	const [vendorScope, setVendorScopeState] = useState<VendorScope>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		restoreVendorScope();
	}, []);

	const restoreVendorScope = async () => {
		try {
			const stored = await AsyncStorage.getItem(STORAGE_KEY);

			if (stored === 'ALL') {
				setVendorScopeState('ALL');
			} else if (stored) {
				setVendorScopeState(Number(stored));
			} else {
				setVendorScopeState(null);
			}
		} finally {
			setLoading(false);
		}
	};

	const setVendorScope = async (scope: VendorScope) => {
		if (scope === null) {
			await AsyncStorage.removeItem(STORAGE_KEY);
		} else {
			await AsyncStorage.setItem(STORAGE_KEY, String(scope));
		}

		setVendorScopeState(scope);
	};

	return (
		<VendorContext.Provider
			value={{
				vendorScope,
				setVendorScope,
				loading,
			}}
		>
			{children}
		</VendorContext.Provider>
	);
};

export const useVendor = () => useContext(VendorContext);
