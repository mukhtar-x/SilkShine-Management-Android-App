import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator
} from 'react-native';
import React, { useState } from 'react';
import { heightToDp, widthToDp } from '../Theme/Dimensions';
import { useLang } from '../Context/TranslationContext';
import { Dropdown } from 'react-native-element-dropdown';
import { useApp } from '../Context/AppContext';
import CustomButton from '../Components/CustomButton';

const ProductCalculation = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedBottleId, setSelectedBottleId] = useState(null);
  const [amountKg, setAmountKg] = useState('');
  const [productResult, setProductResult] = useState(null);
  const [bottleResult, setBottleResult] = useState(null);

  const { productsData = [], oilsData = [], bottlesData = [], loading, setLoading } = useApp();
  const { t } = useLang();

  const CalculationsTabs = [
    { title: t('ProductCost') },
    { title: t('BottleProduction') }
  ];

  const productOptions = productsData.map(item => ({
    label: item.title,
    value: item.id
  }));

  const bottleOptions = bottlesData.map(item => ({
    label: item.size,
    value: item.id
  }));

  const isValidNumber = (value) => !isNaN(parseFloat(value)) && parseFloat(value) > 0;

  const calculateProductDetails = (product, kgAmount) => {
    if (!product || !Array.isArray(product.ingredients)) return { breakdown: [], totalQeemat: 0 };

    let totalQeemat = 0;
    const each = parseFloat(kgAmount) / 100;

    const breakdown = product.ingredients.map(item => {
      const portion = each * (item.percent || 0);
      const oil = oilsData.find(o => o.id === item.oilReference) || {};
      const qeemat = (oil.price || 0) * portion;
      totalQeemat += qeemat;
      return {
        name: oil.title || 'Unknown',
        portion,
        percent: item.percent || 0,
        qeemat
      };
    });

    return { breakdown, totalQeemat };
  };

  const handleCalculateProductDetails = () => {
    if (!isValidNumber(amountKg)) {
      Alert.alert('Error', 'Amount must be a positive number');
      return;
    }
    if (!selectedProductId) {
      Alert.alert('Error', 'Please select a product');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const product = productsData.find(p => p.id === selectedProductId);
      const result = calculateProductDetails(product, amountKg);
      setProductResult(result);
      setLoading(false);
    }, 1000);
  };

  const handleCalculateBottles = () => {
    if (!isValidNumber(amountKg)) {
      Alert.alert('Error', 'Amount must be a positive number');
      return;
    }
    if (!selectedProductId || !selectedBottleId) {
      Alert.alert('Error', 'Please select product and bottle');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const product = productsData.find(p => p.id === selectedProductId);
      const bottle = bottlesData.find(b => b.id === selectedBottleId);

      if (!product || !bottle) {
        Alert.alert('Error', 'Invalid selection');
        setLoading(false);
        return;
      }

      const totalKg = parseFloat(amountKg);
      const bottleKg = parseFloat(bottle.size || 0);

      if (bottleKg <= 0) {
        Alert.alert('Error', 'Bottle size invalid');
        setLoading(false);
        return;
      }

      const { totalQeemat } = calculateProductDetails(product, totalKg);
      const numOfBottles = Math.floor(totalKg / bottleKg);
      const costPerKg = totalQeemat / totalKg;
      const oilQeematPerBottle = costPerKg * bottleKg;
      const packagingQeemat =
        Number(bottle.price || 0) +
        Number(bottle.stickerCost || 0) +
        Number(bottle.boxCost || 0) +
        Number(bottle.labourCharges || 0) +
        Number(bottle.extraCharges || 0);

      const finalBottleQeemat = oilQeematPerBottle + packagingQeemat;

      setBottleResult({
        numOfBottles,
        oilQeematPerBottle,
        packagingQeemat,
        finalBottleQeemat
      });

      setLoading(false);
    }, 1000);
  };

  const handleReset = () => {
    if (loading) return; // prevent reset during loading
    setSelectedProductId(null);
    setSelectedBottleId(null);
    setAmountKg('');
    setProductResult(null);
    setBottleResult(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>       
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>{t('Calculations')}</Text>
        <Text>{t('CalculationsDescription')}</Text>
      </View>

      <View style={styles.tabsContainer}>
        {CalculationsTabs.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => {
              if (loading) return; // disable tab change while loading
              handleReset();
              setCurrentTab(index);
            }}
            style={[styles.tab, index === currentTab && styles.activeTab]}
          >
            <Text style={[styles.tabText, index === currentTab && styles.activeTabText]}>
              {item.title}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={{ paddingHorizontal: widthToDp(5), flex: 1 }}>
        <TextInput
          style={styles.input}
          placeholder={t('enter_amount_kg')}
          keyboardType="numeric"
          value={amountKg}
          onChangeText={setAmountKg}
          editable={!loading}
        />

        <Dropdown
          itemContainerStyle={styles.dropdownItem}
          containerStyle={{ borderRadius: 10, minHeight: heightToDp(30) }}
          style={styles.dropdown}
          data={productOptions}
          labelField="label"
          valueField="value"
          placeholder={t('select_product')}
          value={selectedProductId}
          onChange={item => !loading && setSelectedProductId(item.value)}
        />

        {currentTab === 1 && (
          <Dropdown
            itemContainerStyle={styles.dropdownItem}
            containerStyle={{ borderRadius: 10, minHeight: heightToDp(30) }}
            style={styles.dropdown}
            data={bottleOptions}
            labelField="label"
            valueField="value"
            placeholder={t('bottle_size_kg')}
            value={selectedBottleId}
            onChange={item => !loading && setSelectedBottleId(item.value)}
          />
        )}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <CustomButton
            disabled={
              loading ||
              (currentTab === 0
                ? !(selectedProductId && isValidNumber(amountKg))
                : !(selectedProductId && selectedBottleId && isValidNumber(amountKg)))
            }
            title={t('Calculate')}
            onPress={currentTab === 0 ? handleCalculateProductDetails : handleCalculateBottles}
          />
          <CustomButton title={t('Reset')} onPress={handleReset} disabled={loading} />
        </View>



        {currentTab === 0 && productResult && !loading && (
          <View style={styles.resultCard}>
            <Text style={styles.cardTitle}>
              {t('Total')}: Rs {productResult.totalQeemat.toFixed(2)}
            </Text>
            <FlatList
              data={productResult.breakdown}
              keyExtractor={(item, i) => i.toString()}
              renderItem={({ item }) => (
                <View style={styles.breakdownRow}>
                  <Text>
                    {item.name} ({item.percent}%): {item.portion.toFixed(2)} Kg
                  </Text>
                  <Text>Rs {item.qeemat.toFixed(2)}</Text>
                </View>
              )}
            />
          </View>
        )}

        {currentTab === 1 && bottleResult && !loading && (
          <View style={styles.resultCard}>
            <Text style={styles.cardTitle}>{t('Bottle Production Details')}</Text>
            <View style={styles.breakdownRow}>
              <Text>{t('num_bottles')}</Text>
              <Text>{bottleResult.numOfBottles}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text>{t('oil_cost_bottle')}</Text>
              <Text>Rs {bottleResult.oilQeematPerBottle.toFixed(2)}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text>{t('packaging_cost_bottle')}</Text>
              <Text>Rs {bottleResult.packagingQeemat.toFixed(2)}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text>{t('final_cost_bottle')}</Text>
              <Text>Rs {bottleResult.finalBottleQeemat.toFixed(2)}</Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ProductCalculation;

const styles = StyleSheet.create({
  headerCard: {
    marginHorizontal: widthToDp(5),
    borderRadius: 10,
    gap: 10,
    paddingHorizontal: widthToDp(5),
    elevation: 10,
    backgroundColor: 'white',
    paddingVertical: heightToDp(5),
    marginTop: heightToDp(15)
  },
  headerTitle: { color: 'black', fontWeight: 'bold', fontSize: 25 },
  tabsContainer: { flexDirection: 'row', paddingHorizontal: widthToDp(5), justifyContent: 'space-evenly', paddingVertical: heightToDp(5) },
  tab: { justifyContent: 'center', alignItems: 'center', borderRadius: 5, padding: 5, elevation: 5, width: widthToDp(40), height: heightToDp(10), backgroundColor: 'white' },
  activeTab: { backgroundColor: '#3b82f6' },
  tabText: { color: 'black', fontWeight: '600', fontFamily: 'serif' },
  activeTabText: { color: 'white' },
  sectionTitle: { fontWeight: 'bold', fontSize: 20, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: heightToDp(5), marginBottom: 10 },
  dropdown: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: heightToDp(5), marginBottom: 10 },
  dropdownItem: { borderBottomWidth: 0.5, borderBottomColor: 'gray' },
  resultCard: { backgroundColor: 'white', borderRadius: 10, padding: 15, marginTop: 15, elevation: 5 },
  cardTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 10 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },

});
