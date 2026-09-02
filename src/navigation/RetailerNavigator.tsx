import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Retailer Screens
import RetailerHome from '../screens/retailer/RetailerHome';
import RetailerOrders from '../screens/retailer/RetailerOrders';
import RetailerInventory from '../screens/retailer/RetailerInventory';
import RetailerAddProduct from '../screens/retailer/RetailerAddProduct';
import RetailerPricing from '../screens/retailer/RetailerPricing';
import RetailerStoreProfile from '../screens/retailer/RetailerStoreProfile';
import RetailerPromotions from '../screens/retailer/RetailerPromotions';
import RetailerDelivery from '../screens/retailer/RetailerDelivery';
import RetailerAnalytics from '../screens/retailer/RetailerAnalytics';
import RetailerMore from '../screens/retailer/RetailerMore';

import InteractiveBottomTabBar from '../components/InteractiveBottomTabBar';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 1. Home Stack
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={RetailerHome} />
      <Stack.Screen name="AddProduct" component={RetailerAddProduct} />
      <Stack.Screen name="Pricing" component={RetailerPricing} />
      <Stack.Screen name="StoreProfile" component={RetailerStoreProfile} />
      <Stack.Screen name="Promotions" component={RetailerPromotions} />
      <Stack.Screen name="Delivery" component={RetailerDelivery} />
    </Stack.Navigator>
  );
}

// 2. Orders Stack
function OrdersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OrdersMain" component={RetailerOrders} />
      <Stack.Screen name="Delivery" component={RetailerDelivery} />
    </Stack.Navigator>
  );
}

// 3. Inventory Stack
function InventoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InventoryMain" component={RetailerInventory} />
      <Stack.Screen name="AddProduct" component={RetailerAddProduct} />
      <Stack.Screen name="Pricing" component={RetailerPricing} />
      <Stack.Screen name="Promotions" component={RetailerPromotions} />
    </Stack.Navigator>
  );
}

// 4. Analytics Stack
function AnalyticsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AnalyticsMain" component={RetailerAnalytics} />
    </Stack.Navigator>
  );
}

// 5. More Stack
function MoreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MoreMain" component={RetailerMore} />
      <Stack.Screen name="StoreProfile" component={RetailerStoreProfile} />
      <Stack.Screen name="Pricing" component={RetailerPricing} />
      <Stack.Screen name="Promotions" component={RetailerPromotions} />
      <Stack.Screen name="Delivery" component={RetailerDelivery} />
      <Stack.Screen name="AddProduct" component={RetailerAddProduct} />
    </Stack.Navigator>
  );
}

export default function RetailerNavigator() {
  return (
    <View style={styles.root}>
      <Tab.Navigator
        tabBar={(props) => <InteractiveBottomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Orders" component={OrdersStack} />
        <Tab.Screen name="Inventory" component={InventoryStack} />
        <Tab.Screen name="Analytics" component={AnalyticsStack} />
        <Tab.Screen name="More" component={MoreStack} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
