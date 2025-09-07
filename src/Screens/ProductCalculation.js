import React, { useState, useMemo, useEffect } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { heightToDp, widthToDp } from '../Theme/Dimensions';
import { useLang } from '../Context/TranslationContext';
import { Dropdown } from 'react-native-element-dropdown';
import { useApp } from '../Context/AppContext';
import CustomButton from '../Components/CustomButton';

const ProductCalculation = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedBottleId, setSelectedBottleId] = useState(null);
  const [amount, setAmount] = useState('');
  const [productResult, setProductResult] = useState(null);
  const [bottleResult, setBottleResult] = useState(null);

  const {
    productsData = [],
    oilsData = [],
    bottlesData = [],
    loading,
    setLoading,
    currentUnit, // "g" or "kg"
    GetOilsData,
    GetProductsData,
    GetBottlesData
  } = useApp();

  useEffect(() => {
    GetOilsData();
    GetProductsData();
    GetBottlesData();
  }, []);

  // Ensure selectedBottleId is always valid
  useEffect(() => {
    if (selectedBottleId && !bottlesData.some(b => b.id === selectedBottleId)) {
      setSelectedBottleId(null);
    }
  }, [bottlesData, selectedBottleId]);

  // Ensure selectedProductId is always valid
  useEffect(() => {
    if (selectedProductId && !productsData.some(p => p.id === selectedProductId)) {
      setSelectedProductId(null);
    }
  }, [productsData, selectedProductId]);


  const { t } = useLang();

  // --- Tabs ---
  const CalculationsTabs = useMemo(
    () => [{ title: t('ProductCost') }, { title: t('BottleProduction') }],
    [t]
  );

  // --- Dropdown options ---
  const productOptions = useMemo(
    () =>
      (Array.isArray(productsData) && productsData.length > 0
        ? productsData
        : [{ label: 'No Products', value: null }]
      ).map(item => ({
        label: item.title || item.label,
        value: item.id || item.value,
      })),
    [productsData]
  );

  const bottleOptions = useMemo(
    () =>
      (Array.isArray(bottlesData) && bottlesData.length > 0
        ? bottlesData
        : [{ label: 'No Bottles', value: null }]
      ).map(item => ({
        label: item.size
          ? `${item.size} ${item.unit || 'kg'}`
          : item.label,
        value: item.id || item.value,
      })),
    [bottlesData]
  );

  // --- Helpers ---
  const isValidNumber = value =>
    !isNaN(parseFloat(value)) && parseFloat(value) > 0;

  // normalize input amount to kg internally
  const normalizeAmount = () => {
    const num = parseFloat(amount) || 0;
    return currentUnit === 'g' ? num / 1000 : num;
  };

  // normalize bottle size to kg internally
  const normalizeBottleSize = bottle => {
    const size = parseFloat(bottle.size || 0);
    const unit = bottle.unit || 'kg'; // default kg if missing
    return unit === 'g' ? size / 1000 : size;
  };

  // --- Calculation functions ---
  const calculateProductDetails = product => {
    if (!product?.ingredients?.length)
      return { breakdown: [], totalQeemat: 0 };

    const normalizedAmountKg = normalizeAmount();
    let totalQeemat = 0;
    const each = normalizedAmountKg / 100;

    const breakdown = product.ingredients.map(item => {
      const portionKg = each * (item.percent || 0);
      const oil =
        oilsData.find(o => o.id === item.oilReference) || {};
      const qeemat = (oil.price || 0) * portionKg;
      totalQeemat += qeemat;

      // for display → convert portion back to current unit
      const displayPortion =
        currentUnit === 'g' ? portionKg * 1000 : portionKg;

      return {
        name: oil.title || 'Unknown',
        portion: displayPortion,
        percent: item.percent || 0,
        qeemat,
      };
    });

    return { breakdown, totalQeemat };
  };

  const handleCalculateProductDetails = () => {
    if (!isValidNumber(amount))
      return Alert.alert('Error', 'Amount must be a positive number');
    if (!selectedProductId)
      return Alert.alert('Error', 'Please select a product');

    setLoading(true);
    setTimeout(() => {
      const product = productsData.find(
        p => p.id === selectedProductId
      );
      setProductResult(calculateProductDetails(product));
      setLoading(false);
    }, 500);
  };

  const handleCalculateBottles = () => {
    if (!isValidNumber(amount))
      return Alert.alert('Error', 'Amount must be a positive number');
    if (!selectedProductId || !selectedBottleId)
      return Alert.alert(
        'Error',
        'Please select product and bottle'
      );

    setLoading(true);
    setTimeout(() => {
      const product = productsData.find(
        p => p.id === selectedProductId
      );
      const bottle = bottlesData.find(
        b => b.id === selectedBottleId
      );
      if (!product || !bottle) return setLoading(false);

      const normalizedAmountKg = normalizeAmount();
      const bottleSizeKg = normalizeBottleSize(bottle);
      if (bottleSizeKg <= 0) return setLoading(false);

      const { totalQeemat } = calculateProductDetails(product);
      const numOfBottles = Math.floor(
        normalizedAmountKg / bottleSizeKg
      );
      const costPerKg = totalQeemat / normalizedAmountKg;
      const oilQeematPerBottle = costPerKg * bottleSizeKg;

      const packagingQeemat =
        Number(bottle.price || 0) +
        Number(bottle.stickerCost || 0) +
        Number(bottle.boxCost || 0) +
        Number(bottle.labourCharges || 0) +
        Number(bottle.extraCharges || 0);

      setBottleResult({
        numOfBottles,
        oilQeematPerBottle,
        packagingQeemat,
        finalBottleQeemat:
          oilQeematPerBottle + packagingQeemat,
      });

      setLoading(false);
    }, 500);
  };

  const handleReset = () => {
    if (loading) return;
    setSelectedProductId(null);
    setSelectedBottleId(null);
    setAmount('');
    setProductResult(null);
    setBottleResult(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>{t('Calculations')}</Text>
        <Text>{t('CalculationsDescription')}</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {CalculationsTabs.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => {
              if (loading) return;
              handleReset();
              setCurrentTab(index);
            }}
            style={[
              styles.tab,
              index === currentTab && styles.activeTab,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                index === currentTab && styles.activeTabText,
              ]}
            >
              {item.title}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={{ paddingHorizontal: widthToDp(5), flex: 1 }}>
        {/* Amount Input */}
        <TextInput
          style={styles.input}
          placeholder={`${t('enter_amount')} (${currentUnit})`}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          editable={!loading}
        />

        {/* Product Dropdown */}
        <Dropdown
          itemContainerStyle={styles.dropdownItem}
          containerStyle={{
            borderRadius: 10,
            minHeight: heightToDp(30),
          }}
          style={styles.dropdown}
          data={productOptions}
          labelField="label"
          valueField="value"
          placeholder={t('select_product')}
          value={selectedProductId}
          onChange={item =>
            item.value && !loading && setSelectedProductId(item.value)
          }
          disable={productOptions[0].value === null}
        />

        {/* Bottle Dropdown */}
        {currentTab === 1 && (
          <Dropdown
            itemContainerStyle={styles.dropdownItem}
            containerStyle={{
              borderRadius: 10,
              minHeight: heightToDp(30),
            }}
            style={styles.dropdown}
            data={bottleOptions}
            labelField="label"
            valueField="value"
            placeholder={t('bottle_size_kg')}
            value={selectedBottleId}
            onChange={item =>
              item.value &&
              !loading &&
              setSelectedBottleId(item.value)
            }
            disable={bottleOptions[0].value === null}
          />
        )}

        {/* Buttons */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}
        >
          <CustomButton
            disabled={
              loading ||
              (currentTab === 0
                ? !(selectedProductId && isValidNumber(amount))
                : !(
                  selectedProductId &&
                  selectedBottleId &&
                  isValidNumber(amount)
                ))
            }
            title={t('Calculate')}
            onPress={
              currentTab === 0
                ? handleCalculateProductDetails
                : handleCalculateBottles
            }
          />
          <CustomButton
            title={t('Reset')}
            onPress={handleReset}
            disabled={loading}
          />
        </View>

        {/* Product Results */}
        {currentTab === 0 &&
          productResult &&
          !loading && (
            <View style={styles.resultCard}>
              <Text style={styles.cardTitle}>
                {t('Total')}: Rs{' '}
                {productResult.totalQeemat.toFixed(2)}
              </Text>
              <FlatList
                data={productResult.breakdown}
                keyExtractor={(item, i) => i.toString()}
                renderItem={({ item }) => (
                  <View style={styles.breakdownRow}>
                    <Text>
                      {item.name} ({item.percent}%):{' '}
                      {item.portion.toFixed(2)} {currentUnit}
                    </Text>
                    <Text>Rs {item.qeemat.toFixed(2)}</Text>
                  </View>
                )}
              />
            </View>
          )}

        {/* Bottle Results */}
        {currentTab === 1 &&
          bottleResult &&
          !loading && (
            <View style={styles.resultCard}>
              <Text style={styles.cardTitle}>
                {t('Bottle Production Details')}
              </Text>
              <View style={styles.breakdownRow}>
                <Text>{t('num_bottles')}</Text>
                <Text>{bottleResult.numOfBottles}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text>{t('oil_cost_bottle')}</Text>
                <Text>
                  Rs {bottleResult.oilQeematPerBottle.toFixed(2)}
                </Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text>{t('packaging_cost_bottle')}</Text>
                <Text>
                  Rs {bottleResult.packagingQeemat.toFixed(2)}
                </Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text>{t('final_cost_bottle')}</Text>
                <Text>
                  Rs {bottleResult.finalBottleQeemat.toFixed(2)}
                </Text>
              </View>
            </View>
          )}
      </View>
    </SafeAreaView>
  );
};

export default ProductCalculation;

// --- Styles ---
const styles = StyleSheet.create({
  headerCard: {
    marginHorizontal: widthToDp(5),
    borderRadius: 10,
    gap: 10,
    paddingHorizontal: widthToDp(5),
    elevation: 10,
    backgroundColor: 'white',
    paddingVertical: heightToDp(5),
    marginTop: heightToDp(15),
  },
  headerTitle: { color: 'black', fontWeight: 'bold', fontSize: 25 },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: widthToDp(5),
    justifyContent: 'space-evenly',
    paddingVertical: heightToDp(5),
  },
  tab: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    padding: 5,
    elevation: 5,
    width: widthToDp(40),
    height: heightToDp(10),
    backgroundColor: 'white',
  },
  activeTab: { backgroundColor: '#3b82f6' },
  tabText: { color: 'black', fontWeight: '600', fontFamily: 'serif' },
  activeTabText: { color: 'white' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: heightToDp(5),
    marginBottom: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: heightToDp(5),
    marginBottom: 10,
  },
  dropdownItem: { borderBottomWidth: 0.5, borderBottomColor: 'gray' },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
    elevation: 5,
  },
  cardTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 10 },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
});
