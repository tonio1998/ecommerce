import React, { useMemo } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
    StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { FILE_BASE_URL } from '../../../env';
import { navigate } from '../../utils/navigation';
import { isTablet } from '../../utils/responsive';

const CustomHomeHeader = ({ rightContent = null }) => {
    const navigation = useNavigation();
    const { user } = useAuth();

    const avatarSource = useMemo(() => {
        if (user?.profile_pic) {
            return { uri: `${FILE_BASE_URL}/${user.profile_pic}` };
        }
        if (user?.avatar) {
            return { uri: user.avatar };
        }
        return {
            uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.name || 'User'
            )}&background=ffffff&color=000000`,
        };
    }, [user]);

    return (
        <>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#ffffff"
                translucent={false}
            />

            <SafeAreaView edges={['bottom']} style={[styles.safeArea]}>
                <View style={styles.header}>
                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => navigate('Home')}
                    >
                        <Image
                            source={require('../../../assets/img/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={styles.avatarWrapper}
                            onPress={() => navigation.navigate('Profile')}
                        >
                            <Image source={avatarSource} style={styles.avatar} />
                        </TouchableOpacity>

                        {rightContent}
                    </View>
                </View>
            </SafeAreaView>
        </>
    );
};

export default CustomHomeHeader;
const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: theme.colors.light.card,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 14,
        paddingVertical: 0,
    },

    logo: {
        width: isTablet() ? 180 : 140,
        height: 50
    },

    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    avatarWrapper: {
        width: 36,
        height: 36,
        borderRadius: 18,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: theme.colors.light.primary,
        marginLeft: 6,
    },

    avatar: {
        width: '100%',
        height: '100%',
    },
});
