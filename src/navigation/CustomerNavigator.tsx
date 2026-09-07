import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 15 Screens
import OnboardingScreen from '../screens/customer/OnboardingScreen';
import LocationSelection from '../screens/customer/LocationSelection';
import CustomerHome from '../screens/customer/CustomerHome';
import CustomerCategories from '../screens/customer/CustomerCategories';
import CategoryProducts from '../screens/customer/CategoryProducts';
import StoreCompareScreen from '../screens/customer/StoreCompareScreen';
import ProductDetailScreen from '../screens/customer/ProductDetailScreen';
import CustomerCart from '../screens/customer/CustomerCart';
import AddressDeliveryScreen from '../screens/customer/AddressDeliveryScreen';
import PaymentScreen from '../screens/customer/PaymentScreen';
import OrderTrackingScreen from '../screens/customer/OrderTrackingScreen';
import CustomerOrders from '../screens/customer/CustomerOrders';
import OffersScreen from '../screens/customer/OffersScreen';
import CustomerSearch from '../screens/customer/CustomerSearch';
import AccountScreen from '../screens/customer/AccountScreen';
import HardwareStoreDetail from '../screens/customer/HardwareStoreDetail';
import CustomerStores from '../screens/customer/CustomerStores';
import LoginScreen from '../screens/customer/LoginScreen';

import InteractiveBottomTabBar from '../components/InteractiveBottomTabBar';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 1. Home Stack
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="HomeScreen">
      <Stack.Screen name="HomeScreen" component={CustomerHome} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="LocationSelect" component={LocationSelection} />
      <Stack.Screen name="CategoryProducts" component={CategoryProducts} />
      <Stack.Screen name="StoreCompare" component={StoreCompareScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="StoreDetail" component={HardwareStoreDetail} />
      <Stack.Screen name="Stores" component={CustomerStores} />
      <Stack.Screen name="Offers" component={OffersScreen} />
      <Stack.Screen name="SearchTab" component={CustomerSearch} />
      <Stack.Screen name="AddressDelivery" component={AddressDeliveryScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
    </Stack.Navigator>
  );
}

// 2. Categories Stack
function CategoriesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CategoriesMain" component={CustomerCategories} />
      <Stack.Screen name="CategoryProducts" component={CategoryProducts} />
      <Stack.Screen name="StoreCompare" component={StoreCompareScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="StoreDetail" component={HardwareStoreDetail} />
      <Stack.Screen name="SearchTab" component={CustomerSearch} />
    </Stack.Navigator>
  );
}

// 3. Cart Stack
function CartStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CartMain" component={CustomerCart} />
      <Stack.Screen name="AddressDelivery" component={AddressDeliveryScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
      <Stack.Screen name="LocationSelect" component={LocationSelection} />
    </Stack.Navigator>
  );
}

// 4. Orders Stack
function OrdersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OrdersMain" component={CustomerOrders} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
      <Stack.Screen name="StoreCompare" component={StoreCompareScreen} />
      <Stack.Screen name="SearchTab" component={CustomerSearch} />
    </Stack.Navigator>
  );
}

// 5. Account Stack
function AccountStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AccountMain" component={AccountScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="LocationSelect" component={LocationSelection} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Offers" component={OffersScreen} />
    </Stack.Navigator>
  );
}

export default function CustomerNavigator() {
  return (
    <View style={styles.root}>
      <Tab.Navigator
        tabBar={(props) => <InteractiveBottomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Categories" component={CategoriesStack} />
        <Tab.Screen name="Cart" component={CartStack} />
        <Tab.Screen name="Orders" component={OrdersStack} />
        <Tab.Screen name="Account" component={AccountStack} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
