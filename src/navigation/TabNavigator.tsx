import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Map, AlertCircle, Settings, History } from 'lucide-react-native';
import { HomeScreen, MapScreen, SettingsScreen, HistoryScreen } from '../screens';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginTop: 4,
    letterSpacing: 0.3,
  },
  activeLabel: {
    color: '#0284c7',
  },
  inactiveLabel: {
    color: '#cbd5e1',
  },
});

type TabName = 'home' | 'map' | 'settings' | 'history';

interface TabItem {
  name: TabName;
  label: string;
  icon: (color: string) => React.ReactNode;
  component: React.FC;
}

const tabs: TabItem[] = [
  {
    name: 'map',
    label: 'Mapa',
    icon: (color) => <Map width={24} height={24} color={color} strokeWidth={2} />,
    component: MapScreen,
  },
  {
    name: 'home',
    label: 'Emergência',
    icon: (color) => <AlertCircle width={24} height={24} color={color} strokeWidth={2} />,
    component: HomeScreen,
  },
  {
    name: 'settings',
    label: 'Ajustes',
    icon: (color) => <Settings width={24} height={24} color={color} strokeWidth={2} />,
    component: SettingsScreen,
  },
  {
    name: 'history',
    label: 'Logs',
    icon: (color) => <History width={24} height={24} color={color} strokeWidth={2} />,
    component: HistoryScreen,
  },
];

export const TabNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<TabName>('home');

  const CurrentComponent = tabs.find((tab) => tab.name === activeTab)?.component || HomeScreen;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <CurrentComponent />
      </View>

      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab.name} style={styles.tab} onPress={() => setActiveTab(tab.name)}>
            {tab.icon(activeTab === tab.name ? '#0284c7' : '#cbd5e1')}
            <Text style={[styles.tabLabel, activeTab === tab.name ? styles.activeLabel : styles.inactiveLabel]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
