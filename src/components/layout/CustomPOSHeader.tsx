import React from 'react';
import {
    View,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { CText } from '../common/CText';
import { theme } from '../../theme';
import { formatNumber } from '../../utils/format';

const CustomPosHeader = ({
                       total = 0,
                       itemCount = 0,
                       onPay,
                       onHold,
                   }) => {
    return (
        <>
            <StatusBar
                barStyle="light-content"
                backgroundColor={theme.colors.light.primary}
                translucent={false}
            />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <View>
                        <CText style={styles.totalLabel}>
                            TOTAL
                        </CText>
                        <CText style={styles.totalValue}>
                            ₱ {formatNumber(total)}
                        </CText>
                        <CText style={styles.itemCount}>
                            {itemCount} items
                        </CText>
                    </View>

                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={styles.holdBtn}
                            onPress={onHold}
                        >
                            <Icon
                                name="pause-outline"
                                size={20}
                                color="#333"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.payBtn}
                            onPress={onPay}
                        >
                            <Icon
                                name="cash-outline"
                                size={22}
                                color="#fff"
                            />
                            <CText style={styles.payText}>
                                PAY
                            </CText>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </>
    );
};

export default CustomPosHeader;

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: theme.colors.light.primary,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },

    totalLabel: {
        fontSize: 11,
        color: '#fff',
        opacity: 0.9,
    },

    totalValue: {
        fontSize: 22,
        fontWeight: '800',
        color: '#fff',
    },

    itemCount: {
        fontSize: 11,
        color: '#fff',
        opacity: 0.9,
        marginTop: 2,
    },

    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    holdBtn: {
        width: 44,
        height: 44,
        borderRadius: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },

    payBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
    },

    payText: {
        color: '#fff',
        fontWeight: '700',
        marginLeft: 6,
    },
});
