import os

screens = {
    "customer": ["CustomerHome", "CustomerSearch", "CustomerCart", "CustomerOrders"],
    "retailer": ["RetailerDashboard", "RetailerInventory", "RetailerOrders"],
    "delivery": ["DeliveryTrips", "DeliveryHistory"],
    "admin": ["AdminDashboard", "AdminRetailers"]
}

for folder, files in screens.items():
    for f in files:
        filepath = f"src/screens/{folder}/{f}.tsx"
        content = f"""import React from 'react';
import {{ View, Text, StyleSheet }} from 'react-native';
import {{ colors }} from '../../theme/colors';

export default function {f}() {{
  return (
    <View style={{styles.container}}>
      <Text style={{styles.title}}>{f}</Text>
    </View>
  );
}}

const styles = StyleSheet.create({{
  container: {{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  }},
  title: {{
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  }}
}});
"""
        with open(filepath, 'w') as fh:
            fh.write(content)

print("Screens generated.")
