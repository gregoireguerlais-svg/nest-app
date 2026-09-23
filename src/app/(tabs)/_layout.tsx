import { ChartNoAxesColumn, House, ListChecks } from 'lucide-react-native';
import { Tabs } from 'expo-router';

import { colors, fonts } from '@/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.sage,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 12 },
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      }}>
      <Tabs.Screen
        name="index"
        options={{ title: 'Accueil', tabBarIcon: ({ color }) => <House size={24} color={color} strokeWidth={1.75} /> }}
      />
      <Tabs.Screen
        name="tasks"
        options={{ title: 'Tâches', tabBarIcon: ({ color }) => <ListChecks size={24} color={color} strokeWidth={1.75} /> }}
      />
      <Tabs.Screen
        name="stats"
        options={{ title: 'Stats', tabBarIcon: ({ color }) => <ChartNoAxesColumn size={24} color={color} strokeWidth={1.75} /> }}
      />
    </Tabs>
  );
}
