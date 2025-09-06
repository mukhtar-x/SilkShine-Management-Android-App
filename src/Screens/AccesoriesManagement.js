import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { heightToDp, widthToDp } from '../Theme/Dimensions';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLang } from '../Context/TranslationContext';
import { ManagementTabs } from '../Constants/Contants';

const AccesoriesManagement = ({ navigation }) => {
  const { t, lang, setLang } = useLang();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc", paddingBottom: heightToDp(3) }}>
      {/* Header Section */}
      <View style={{
        marginHorizontal: widthToDp(5),
        borderRadius: 10,
        gap: 10,
        paddingHorizontal: widthToDp(5),
        elevation: 10,
        backgroundColor: "white",
        paddingVertical: heightToDp(5),
        marginTop: heightToDp(15)
      }}>
        <Text style={{ color: "black", fontWeight: "bold", fontSize: 25 }}>
          {t("management")}
        </Text>
        <Text>{t("management_description")}</Text>
      </View>

      {/* Management Tabs */}
      <View style={{ paddingHorizontal: widthToDp(5), paddingVertical: heightToDp(5), gap: heightToDp(2) }}>
        {ManagementTabs?.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => navigation.navigate(item.route)}
            style={{
              flexDirection: "row",
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: 5,
              padding: heightToDp(4),
              elevation: 5,
              backgroundColor: "white"
            }}
          >
            <Text style={{ color: "black", fontWeight: "800", fontFamily: "serif" }}>
              {t(item.key)}
            </Text>
            <MaterialIcons name="arrow-forward-ios" size={20} color="black" />
          </Pressable>
        ))}
      </View>

      {/* Language Toggle */}
      <View style={styles.toggleContainer}>
        <Pressable
          onPress={() => setLang("en")}
          style={[
            styles.toggleBtn,
            lang === "en" && styles.activeBtn
          ]}
        >
          <Text style={[styles.toggleText, lang === "en" && styles.activeText]}>English</Text>
        </Pressable>

        <Pressable
          onPress={() => setLang("ur")}
          style={[
            styles.toggleBtn,
            lang === "ur" && styles.activeBtn
          ]}
        >
          <Text style={[styles.toggleText, lang === "ur" && styles.activeText]}>اردو</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

export default AccesoriesManagement;

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto", // push to bottom
    marginBottom: heightToDp(3),
    marginHorizontal: widthToDp(5),
    borderRadius: 30,
    backgroundColor: "#e2e8f0",
    overflow: "hidden",
  },
  toggleBtn: {
    flex: 1,
    height : heightToDp(12),
    justifyContent : 'center',
    // paddingVertical: heightToDp(3),
    alignItems: "center",
  },
  activeBtn: {
    backgroundColor: "#1e293b",
  },
  toggleText: {
    fontSize: 16,
    color: "#475569",
    fontWeight: "600",
  },
  activeText: {
    color: "white",
    fontWeight: "700",
  }
});
