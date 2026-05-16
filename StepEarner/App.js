import 'react-native-gesture-handler';
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { AppProvider } from './src/context/AppContext';
import HomeScreen from './src/screens/HomeScreen';
import WalletScreen from './src/screens/WalletScreen';
import MarketplaceScreen from './src/screens/MarketplaceScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { Colors, Typography } from './src/theme';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Home: '🏠', Wallet: '💎', Marketplace: '🛍️',
  Leaderboard: '🏆', Profile: '👤',
};
const TAB_LABELS = {
  Home: 'Home', Wallet: 'Wallet', Marketplace: 'Rewards',
  Leaderboard: 'Ranks', Profile: 'Profile',
};

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom || 12 }]}>
      <LinearGradient colors={['rgba(17,24,39,0.98)','rgba(10,14,26,0.99)']} style={StyleSheet.absoluteFill}/>
      <View style={styles.tabInner}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          return (
            <View key={route.key} style={styles.tabItem}>
              <LinearGradient
                colors={isFocused ? ['rgba(0,245,160,0.18)','rgba(0,245,160,0.06)'] : ['transparent','transparent']}
                style={styles.tabGrad}>
                <Text style={[styles.tabIcon, {opacity: isFocused ? 1 : 0.45}]}
                  onPress={() => navigation.navigate(route.name)}>
                  {TAB_ICONS[route.name]}
                </Text>
                <Text style={[styles.tabLabel, {color: isFocused ? Colors.neonGreen : Colors.textMuted}]}
                  onPress={() => navigation.navigate(route.name)}>
                  {TAB_LABELS[route.name]}
                </Text>
              </LinearGradient>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="light" />
        <NavigationContainer>
          <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Wallet" component={WalletScreen} />
            <Tab.Screen name="Marketplace" component={MarketplaceScreen} />
            <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  tabInner: { flexDirection: 'row', paddingTop: 8, paddingHorizontal: 8 },
  tabItem: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  tabGrad: { alignItems: 'center', paddingVertical: 8, borderRadius: 12 },
  tabIcon: { fontSize: 22, marginBottom: 3 },
  tabLabel: { fontSize: 10, fontWeight: '600' },
});
