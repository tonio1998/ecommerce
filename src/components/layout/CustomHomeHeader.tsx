import React, { useMemo } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
    StatusBar,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import { theme } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { FILE_BASE_URL } from '../../../env';
import { navigate } from '../../utils/navigation';
import { CText } from '../common/CText';
import { isTablet } from '../../utils/responsive';

const CustomHomeHeader = ({
                              cartCount = 0,
                              rightContent = null,
                          }) => {
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
            )}&background=random`,
        };
    }, [user]);

    return (
        <>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent
            />

            <View style={styles.headerWrapper}>
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        activeOpacity={0.8}
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
                            style={styles.iconBtn}
                            onPress={() => navigation.navigate('ProductSearch')}
                        >
                            <Icon
                                name="search-outline"
                                size={22}
                                color={theme.colors.light.text}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.iconBtn}
                            onPress={() => navigation.navigate('Cart')}
                        >
                            <Icon
                                name="cart-outline"
                                size={22}
                                color={theme.colors.light.text}
                            />
                            {cartCount > 0 && (
                                <View style={styles.badge}>
                                    <CText size={10} color="#fff">
                                        {cartCount}
                                    </CText>
                                </View>
                            )}
                        </TouchableOpacity>

                        {rightContent}
                    </View>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    headerWrapper: {
        position: 'absolute',
        top:
            Platform.OS === 'android'
                ? (StatusBar.currentHeight || 24) + 6
                : 44,
        left: 0,
        right: 0,
        paddingHorizontal: 10,
        zIndex: 10,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logo: {
        width: isTablet() ? 180 : 140,
        height: 42,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBtn: {
        marginHorizontal: 6,
        padding: 6,
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: theme.colors.light.primary,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 3,
    },
    avatarWrapper: {
        width: 38,
        height: 38,
        borderRadius: 19,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: theme.colors.light.primary,
        marginLeft: 6,
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
});

export default CustomHomeHeader;
