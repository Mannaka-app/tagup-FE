import { Tabs } from 'expo-router';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 85,
          paddingTop: 5,
          paddingBottom: 30,
          backgroundColor: 'white',
          borderTopWidth: 0.5,
          borderTopColor: '#E5E5EA',
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='home-outline' size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='feed'
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='newspaper-outline' size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='chat'
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='chatbubble-outline' size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='mypage'
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='person-outline' size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    marginRight: 15,
  },
  logoutText: {
    color: '#007AFF',
  },
});
