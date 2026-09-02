import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Driver Screens
import DriverHome from '../screens/driver/DriverHome';
import DriverOngoingDelivery from '../screens/driver/DriverOngoingDelivery';
import DriverDeliveries from '../screens/driver/DriverDeliveries';
import DriverEarnings from '../screens/driver/DriverEarnings';
import DriverProfile from '../screens/driver/DriverProfile';
import DriverDocumentsScreen from '../screens/driver/DriverDocumentsScreen';
import DriverPerformanceScreen from '../screens/driver/DriverPerformanceScreen';
import DriverSupportScreen from '../screens/driver/DriverSupportScreen';
import DriverVehicleScreen from '../screens/driver/DriverVehicleScreen';

import InteractiveBottomTabBar from '../components/InteractiveBottomTabBar';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 1. Home Stack
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={DriverHome} />
      <Stack.Screen name="OngoingDelivery" component={DriverOngoingDelivery} />
    </Stack.Navigator>
  );
}

// 2. Deliveries Stack
function DeliveriesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DeliveriesMain" component={DriverDeliveries} />
      <Stack.Screen name="OngoingDelivery" component={DriverOngoingDelivery} />
    </Stack.Navigator>
  );
}

// 3. Earnings Stack
function EarningsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EarningsMain" component={DriverEarnings} />
      <Stack.Screen name="Performance" component={DriverPerformanceScreen} />
    </Stack.Navigator>
  );
}

// 4. Profile Stack
function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={DriverProfile} />
      <Stack.Screen name="Earnings" component={DriverEarnings} />
      <Stack.Screen name="Documents" component={DriverDocumentsScreen} />
      <Stack.Screen name="Performance" component={DriverPerformanceScreen} />
      <Stack.Screen name="Support" component={DriverSupportScreen} />
      <Stack.Screen name="Vehicle" component={DriverVehicleScreen} />
    </Stack.Navigator>
  );
}

export default function DeliveryNavigator() {
  return (
    <View style={styles.root}>
      <Tab.Navigator
        tabBar={(props) => <InteractiveBottomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Deliveries" component={DeliveriesStack} />
        <Tab.Screen name="Earnings" component={EarningsStack} />
        <Tab.Screen name="Profile" component={ProfileStack} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
