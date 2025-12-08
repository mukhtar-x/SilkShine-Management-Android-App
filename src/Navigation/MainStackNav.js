import { ActivityIndicator, StyleSheet, View } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProductCalculation from '../Screens/ProductCalculation';
import AccesoriesManagement from '../Screens/AccesoriesManagement';
import ManageOils from '../Screens/ManageOils';
import ManageProducts from '../Screens/ManageProducts';
import ManageBottle from '../Screens/ManageBottle';
import { useLang } from '../Context/TranslationContext';
import { useApp } from '../Context/AppContext';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { heightToDp, widthToDp } from '../Theme/Dimensions';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainStackNav = () => {
  const { loading } = useApp();

  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <Stack.Navigator
          screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#f8fafc" } }}
        >
          <Stack.Screen name='Home' component={BottomTabs} />
          <Stack.Screen name='ManageOils' component={ManageOils} />
          <Stack.Screen name='ManageProducts' component={ManageProducts} />
          <Stack.Screen name='ManageBottle' component={ManageBottle} />
        </Stack.Navigator>

        {loading && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        )}
      </View>
    </NavigationContainer>
  );
};

export default MainStackNav;

const styles = StyleSheet.create({
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999
  }
});

const BottomTabs = () => {
  const { t } = useLang();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { paddingVertical: heightToDp(1) },
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: heightToDp(18),
          paddingTop: heightToDp(2),
          marginBottom: heightToDp(10),
          position : 'absolute',
          borderRadius: 50,
          marginHorizontal: widthToDp(5),
        }
      }}
    >
      <Tab.Screen
        name='Calculation'
        component={ProductCalculation}
        options={{
          tabBarIcon: ({ color }) => (<Entypo name="calculator" size={25} color={color} />)
        }}
        listeners={({ navigation }) => ({
          tabPress: () => navigation.setOptions({ title: t("Calculation") })
        })}
      />
      <Tab.Screen
        name='Management'
        component={AccesoriesManagement}
        options={{
          tabBarIcon: ({ color }) => (<MaterialIcons name="manage-search" size={25} color={color} />)
        }}
        listeners={({ navigation }) => ({
          tabPress: () => navigation.setOptions({ title: t("Management") })
        })}
      />
    </Tab.Navigator>
  )
}
