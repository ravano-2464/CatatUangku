import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AddTransactionScreen } from '../screens/AddTransactionScreen';
import { BudgetScreen } from '../screens/BudgetScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { ManualInputScreen } from '../screens/ManualInputScreen';
import { ReportsScreen } from '../screens/ReportsScreen';
import { ScanReceiptScreen } from '../screens/ScanReceiptScreen';
import { ScanReviewScreen } from '../screens/ScanReviewScreen';
import { MainTabParamList, RootStackParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const getTabBarIcon = (
  routeName: keyof MainTabParamList,
  focused: boolean
): keyof typeof Ionicons.glyphMap => {
  if (routeName === 'Dashboard') {
    return focused ? 'home' : 'home-outline';
  }

  if (routeName === 'AddTransaction') {
    return focused ? 'add-circle' : 'add-circle-outline';
  }

  if (routeName === 'Reports') {
    return focused ? 'bar-chart' : 'bar-chart-outline';
  }

  return focused ? 'wallet' : 'wallet-outline';
};

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: '#0f766e',
      tabBarInactiveTintColor: '#64748b',
      tabBarStyle: {
        position: 'absolute',
        left: 14,
        right: 14,
        bottom: 12,
        height: 68,
        borderRadius: 24,
        paddingTop: 8,
        paddingBottom: 8,
        borderTopColor: '#e2e8f0',
        borderTopWidth: 1,
        backgroundColor: '#ffffff',
        elevation: 5,
        shadowColor: '#0f172a',
        shadowOpacity: 0.08,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 4 },
      },
      tabBarIcon: ({ focused, color, size }) => (
        <Ionicons name={getTabBarIcon(route.name, focused)} color={color} size={size} />
      ),
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '700',
      },
      sceneStyle: {
        backgroundColor: '#f8fafc',
      },
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Beranda' }} />
    <Tab.Screen
      name="AddTransaction"
      component={AddTransactionScreen}
      options={{ title: 'Tambah' }}
    />
    <Tab.Screen name="Reports" component={ReportsScreen} options={{ title: 'Laporan' }} />
    <Tab.Screen name="Budget" component={BudgetScreen} options={{ title: 'Budget' }} />
  </Tab.Navigator>
);

export const AppNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: '#f8fafc',
      },
      headerTitleStyle: {
        color: '#0f172a',
        fontWeight: '700',
      },
      headerTintColor: '#0f172a',
      contentStyle: {
        backgroundColor: '#f8fafc',
      },
    }}
  >
    <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
    <Stack.Screen
      name="ManualInput"
      component={ManualInputScreen}
      options={{
        title: 'Input Manual',
      }}
    />
    <Stack.Screen
      name="ScanReceipt"
      component={ScanReceiptScreen}
      options={{
        title: 'Scan Struk',
      }}
    />
    <Stack.Screen
      name="ScanReview"
      component={ScanReviewScreen}
      options={{
        title: 'Review Hasil Scan',
      }}
    />
  </Stack.Navigator>
);
