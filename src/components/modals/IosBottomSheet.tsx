import React, { useEffect, useRef } from 'react';
import {
    Modal,
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Platform,
    StatusBar, Dimensions, Animated,
} from 'react-native';
import { CText } from "../common/CText";
const { height } = Dimensions.get("window");
const SHEET_HEIGHT = height * 0.8;
export default function IosBottomSheet({
                                           visible,
                                           title,
                                           onClose,
                                           children,
                                       }) {
    const translateY = useRef(new Animated.Value(-SHEET_HEIGHT)).current;

    useEffect(() => {
        Animated.timing(translateY, {
            toValue: visible ? 0 : -SHEET_HEIGHT,
            duration: visible ? 280 : 220,
            useNativeDriver: true,
        }).start();
    }, [visible]);
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            statusBarTranslucent
        >
            <StatusBar
                translucent
                backgroundColor="rgba(0,0,0,0.35)"
                barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
            />

            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={[
                                styles.sheet,
                                {
                                    height: SHEET_HEIGHT,
                                    transform: [{ translateY }],
                                },
                            ]}
                        >
                            <View style={styles.handle} />

                            {title && (
                                <CText fontStyle="SB" style={styles.title}>
                                    {title}
                                </CText>
                            )}

                            {children}
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.35)",
        justifyContent: "flex-end",
    },
    sheet: {
        backgroundColor: "#fff",
        paddingTop: 10,
        paddingHorizontal: 20,
        paddingBottom: 24,
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
    },
    handle: {
        width: 42,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#ccc",
        alignSelf: "center",
        marginBottom: 14,
    },
    title: {
        fontSize: 17,
        textAlign: "center",
        marginBottom: 20,
    },
});
