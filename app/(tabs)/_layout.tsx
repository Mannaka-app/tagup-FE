import { Tabs } from 'expo-router';
import { TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/useAuthStore';
export default function TabLayout() {
  const { user } = useAuthStore();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 70,
          paddingTop: 5,
          paddingBottom: 30,
          backgroundColor: 'white',
          borderTopWidth: 0.5,
          borderTopColor: '#E5E5EA',
        },
        tabBarActiveTintColor: '#black',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name='home-variant'
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='feed'
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='baseball-outline' size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='offline'
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='chatbox-outline' size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='chat'
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='paper-plane-outline' size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='mypage'
        options={{
          tabBarIcon: ({ color, size }) =>
            user?.profileUrl ? (
              <Image
                source={{ uri: user.profileUrl }}
                className='w-7 h-7 border-[0.11px] border-gray-500 rounded-full'
              />
            ) : (
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
