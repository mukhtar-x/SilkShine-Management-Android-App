import { Pressable, StyleSheet, Text, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { heightToDp, widthToDp } from '../Theme/Dimensions';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLang } from '../Context/TranslationContext';
import { ManagementTabs } from '../Constants/Contants';
import { useApp } from '../Context/AppContext';

const AccesoriesManagement = ({ navigation }) => {
  const { t, lang, setLang } = useLang();
  const { currentUnit, ToggleUnit, ClearAllData } = useApp();

  const handleToggleUnit = (unit) => {
    ToggleUnit(unit === 'g');
  };

  const handleClearAll = () => {
    Alert.alert(
      t("confirm_delete") || "Are you sure?",
      t("delete_all_message") || "This will remove all Oils, Products, and Bottles data permanently.",
      [
        { text: t("cancel") || "Cancel", style: "cancel" },
        { text: t("yes_delete") || "Yes, Delete", style: "destructive", onPress: () => ClearAllData() }
      ]
    );
  };

  return (
     <View style={{ flex: 1, backgroundColor: "#f8fafc", paddingBottom: heightToDp(30) }}>
      {/* Header Section */}
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>{t("management")}</Text>
        <Text>{t("management_description")}</Text>
      </View>

      {/* Management Tabs */}
      <View style={{ paddingHorizontal: widthToDp(5), paddingVertical: heightToDp(5), gap: heightToDp(2) }}>
        {ManagementTabs?.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => navigation.navigate(item.route)}
            style={styles.tabCard}
          >
            <Text style={styles.tabText}>{t(item.key)}</Text>
            <MaterialIcons name="arrow-forward-ios" size={20} color="black" />
          </Pressable>
        ))}
         {/* Clear All Button */}
        <Pressable onPress={handleClearAll} style={styles.clearAllBtn}>
          <Text style={styles.clearAllText}>{t("clear_all") || "Clear All Data"}</Text>
        </Pressable>
      </View>

      {/* Unit Toggle Section */}
      <View style={{ paddingHorizontal: widthToDp(5), alignItems: 'center', justifyContent: "space-between", gap: heightToDp(5), flexDirection: 'row' }}>
        <Text style={styles.sectionHeading}>{t("CurrentUnit")}</Text>
        <View style={{ flex: 1, flexDirection: "row", backgroundColor: "#e2e8f0", alignItems: 'center', overflow: 'hidden', borderRadius: 20, maxWidth: widthToDp(50) }}>
          <Pressable
            onPress={() => handleToggleUnit('g')}
            style={[styles.toggleBtn, { maxWidth: widthToDp(25), minWidth: widthToDp(25) }, currentUnit === 'g' && styles.activeUnitBtn]}
          >
            <Text style={[styles.toggleText, currentUnit === 'g' && styles.activeUnitText]}>{t("gram")}</Text>
          </Pressable>
          <Pressable
            onPress={() => handleToggleUnit('kg')}
            style={[styles.toggleBtn, { maxWidth: widthToDp(25), minWidth: widthToDp(25) }, currentUnit === 'kg' && styles.activeUnitBtn]}
          >
            <Text style={[styles.toggleText, currentUnit === 'kg' && styles.activeUnitText]}>{t("kilogram")}</Text>
          </Pressable>
        </View>
      </View>

      {/* Footer Section */}
      <View style={{ flex: 1, justifyContent: 'flex-end', gap: heightToDp(5), paddingHorizontal: widthToDp(5) }}>
        
        {/* Language Toggle Section */}
        <View style={styles.toggleContainer}>
          <Pressable
            onPress={() => setLang("en")}
            style={[styles.toggleBtn, lang === "en" && styles.activeLangBtn]}
          >
            <Text style={[styles.toggleText, lang === "en" && styles.activeLangText]}>English</Text>
          </Pressable>

          <Pressable
            onPress={() => setLang("ur")}
            style={[styles.toggleBtn, lang === "ur" && styles.activeLangBtn]}
          >
            <Text style={[styles.toggleText, lang === "ur" && styles.activeLangText]}>اردو</Text>
          </Pressable>
        </View>

      </View>
     </View>
  )
}

export default AccesoriesManagement;

const styles = StyleSheet.create({
  headerCard: {
    marginHorizontal: widthToDp(5),
    borderRadius: 10,
    gap: 10,
    paddingHorizontal: widthToDp(5),
    elevation: 10,
    backgroundColor: "white",
    paddingVertical: heightToDp(5),
    marginTop: heightToDp(15)
  },
  headerTitle: { color: "black", fontWeight: "bold", fontSize: 25 },
  tabCard: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    padding: heightToDp(4),
    elevation: 5,
    backgroundColor: "white"
  },
  tabText: { color: "black", fontWeight: "800", fontFamily: "serif" },

  /* Section Heading */
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: heightToDp(1),
    color: '#1e293b'
  },

  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "#e2e8f0",
    overflow: "hidden",
    marginBottom: heightToDp(3),
  },
  toggleBtn: {
    flex: 1,
    height: heightToDp(12),
    minWidth: widthToDp(40),
    justifyContent: 'center',
    alignItems: "center",
  },

  /* Unit Toggle Styles */
  activeUnitBtn: {
    backgroundColor: "#2563eb",
  },
  activeUnitText: {
    color: "white",
    fontWeight: "700",
  },

  /* Language Toggle Styles */
  activeLangBtn: {
    backgroundColor: "#1e293b",
  },
  activeLangText: {
    color: "white",
    fontWeight: "700",
  },

  toggleText: {
    fontSize: 16,
    color: "#475569",
    fontWeight: "600",
  },

  /* Clear All */
  clearAllBtn: {
    marginTop : heightToDp(2),
    backgroundColor: "#dc2626",
    borderRadius: 10,
    paddingVertical: heightToDp(4),
    alignItems: "center",
    justifyContent: "center",
  },
  clearAllText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700"
  }
});
