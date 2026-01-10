import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';

import BackHeader from '../../components/layout/BackHeader';
import { globalStyles } from '../../theme/styles';
import { CText } from '../../components/common/CText';
import { theme } from '../../theme';
import { handleApiError } from '../../utils/errorHandler';
import { useVendor } from '../../context/VendorContext';
import CButton2 from '../../components/buttons/CButton2';
import { createProductApi } from '../../api/modules/productsApi';
import IosBottomSheet from '../../components/modals/IosBottomSheet';

const NewProduct = ({ navigation }) => {
  const { vendorScope } = useVendor();
  const devices = useCameraDevices();
  const device = devices.back;

  const cameraRef = useRef<Camera>(null);
  const scanLock = useRef(false);

  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [cost, setCost] = useState('');
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState('');

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [frameProcessor, barcodes] = useScanBarcodes(
    [BarcodeFormat.ALL_FORMATS],
    { checkInverted: true }
  );

  useEffect(() => {
    if (!sku) {
      setSku(`SKU-${Date.now().toString().slice(-6)}`);
    }
  }, []);

  useEffect(() => {
    if (!scannerOpen) return;
    if (barcodes.length && !scanLock.current) {
      scanLock.current = true;
      setBarcode(barcodes[0].displayValue || '');
      setScannerOpen(false);
    }
  }, [barcodes, scannerOpen]);

  if (vendorScope === null || vendorScope === 'ALL') {
    return (
      <View style={globalStyles.safeArea}>
        <View style={styles.emptyWrap}>
          <CText>Please select a vendor to use POS.</CText>
          <CButton2
            style={{ padding: 8, borderRadius: 8 }}
            title="Select Store"
            type="info"
            icon="add"
            onPress={() => navigation.navigate('Store')}
          />
        </View>
      </View>
    );
  }

  const sanitizeNumber = (v: string) => v.replace(/[^0-9.]/g, '');

  const validate = () => {
    if (!name.trim()) return 'Product name is required';
    if (!price) return 'Price is required';
    if (!cost) return 'Cost is required';
    if (!barcode) return 'Barcode is required';
    return null;
  };

  const submit = async () => {
    const error = validate();
    if (error) {
      Alert.alert('Invalid Input', error);
      return;
    }

    try {
      setSaving(true);
      await createProductApi({
        vendor_id: vendorScope,
        sku,
        barcode,
        name,
        description,
        price: Number(price),
        cost: Number(cost),
        stock: Number(stock || 0),
        unit: Number(unit || 0),
        image: imageUri,
      });
      navigation.goBack();
    } catch (e) {
      handleApiError(e);
    } finally {
      setSaving(false);
    }
  };

  const capturePhoto = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePhoto();
    setImageUri(`file://${photo.path}`);
    setCameraOpen(false);
  };

  return (
    <View style={globalStyles.safeArea}>
      <BackHeader />

      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.formCard}>
          <CText style={styles.sectionTitle}>Product Information</CText>

          <View style={styles.imageWrap}>
            <TouchableOpacity onPress={() => setCameraOpen(true)}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.image} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Icon name="camera-outline" size={28} color="#777" />
                  <CText>Add Photo</CText>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <TextInput style={styles.input} value={sku} onChangeText={setSku} placeholder="SKU" placeholderTextColor="#ccc" />

          <View style={styles.barcodeRow}>
            <TextInput
              style={[styles.input, styles.barcodeInput]}
              value={barcode}
              onChangeText={setBarcode}
              placeholder="Barcode"
              placeholderTextColor="#ccc"
            />
            <TouchableOpacity
              style={styles.scanBtn}
              onPress={() => {
                scanLock.current = false;
                setScannerOpen(true);
              }}
            >
              <Icon name="barcode-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Product Name" placeholderTextColor="#ccc" />

          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Description"
            placeholderTextColor="#ccc"
            multiline
          />

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.half]}
              value={price}
              onChangeText={v => setPrice(sanitizeNumber(v))}
              placeholder="Price"
              keyboardType="decimal-pad"
              placeholderTextColor="#ccc"
            />
            <TextInput
              style={[styles.input, styles.half]}
              value={cost}
              onChangeText={v => setCost(sanitizeNumber(v))}
              placeholder="Cost"
              keyboardType="decimal-pad"
              placeholderTextColor="#ccc"
            />
          </View>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.half]}
              value={stock}
              onChangeText={v => setStock(v.replace(/[^0-9]/g, ''))}
              placeholder="Stock"
              keyboardType="number-pad"
              placeholderTextColor="#ccc"
            />
            <TextInput
              style={[styles.input, styles.half]}
              value={unit}
              onChangeText={v => setUnit(v.replace(/[^0-9]/g, ''))}
              placeholder="Unit"
              keyboardType="number-pad"
              placeholderTextColor="#ccc"
            />
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={submit} disabled={saving}>
            {saving ? <ActivityIndicator color="#fff" /> : (
              <>
                <Icon name="save-outline" size={20} color="#fff" />
                <CText style={styles.submitText}>Save Product</CText>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <IosBottomSheet visible={scannerOpen} onClose={() => setScannerOpen(false)} title="Barcode Scanner">
        {device && (
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={scannerOpen}
            frameProcessor={frameProcessor}
            frameProcessorFps={5}
          />
        )}
      </IosBottomSheet>

      <IosBottomSheet visible={cameraOpen} onClose={() => setCameraOpen(false)} title="Capture Product">
        {device && (
          <>
            <Camera
              ref={cameraRef}
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={cameraOpen}
              photo
            />
            <TouchableOpacity style={styles.captureBtn} onPress={capturePhoto}>
              <Icon name="camera" size={28} color="#fff" />
            </TouchableOpacity>
          </>
        )}
      </IosBottomSheet>
    </View>
  );
};

export default NewProduct;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 14 },
  formCard: { backgroundColor: '#fff', borderRadius: theme.radius.md, padding: 14 },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 12 },
  input: { backgroundColor: '#f7f7f7', borderRadius: theme.radius.sm, paddingHorizontal: 12, height: 46, marginBottom: 10, fontSize: 14 },
  textArea: { height: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  half: { width: '48%' },
  submitBtn: { marginTop: 14, height: 50, borderRadius: theme.radius.md, backgroundColor: theme.colors.light.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  submitText: { color: '#fff', fontSize: 15, fontWeight: '700', marginLeft: 8 },
  imageWrap: { alignItems: 'center', marginBottom: 12 },
  image: { width: 120, height: 120, borderRadius: 8 },
  imagePlaceholder: { width: 120, height: 120, borderRadius: 8, backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center' },
  barcodeRow: { flexDirection: 'row', alignItems: 'center' },
  barcodeInput: { flex: 1 },
  scanBtn: { width: 46, height: 46, backgroundColor: theme.colors.light.primary, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  captureBtn: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
