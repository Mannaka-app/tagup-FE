import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/useAuthStore';
import LiveRoom from '../components/home/LiveRoom';
import Cheer from '../components/home/Cheer';
import Schedule from '../components/home/Schedule';

type TabType = '직관방' | '응원' | '경기일정';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('직관방');
  const { user } = useAuthStore();

  const renderContent = () => {
    switch (activeTab) {
      case '직관방':
        return <LiveRoom />;
      case '응원':
        return <Cheer />;
      case '경기일정':
        return <Schedule />;
    }
  };

  return (
    <SafeAreaView
      className='flex-1'
      edges={['top']}
      style={{ backgroundColor: `${user?.teams?.color}` }}
    >
      <View className='flex-1 bg-white'>
        {/* 헤더 */}
        <View
          className='px-5 py-3 flex-row items-center border-b border-gray-200'
          style={{ backgroundColor: `${user?.teams?.color}` }}
        >
          <View className='flex-row items-center'>
            <Text className='text-xl font-regular text-white'>
              {user?.teams?.emoji} {user?.teams?.name}
            </Text>
          </View>
        </View>

        {/* 세그먼트 탭 */}
        <View className='flex-row border-b border-gray-200'>
          {(['직관방', '응원', '경기일정'] as TabType[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className='flex-1 py-3'
              style={{
                borderBottomWidth: 2,
                borderBottomColor:
                  activeTab === tab ? user?.teams?.color : '#e5e7eb',
              }}
            >
              <Text
                className={`text-center ${
                  activeTab === tab ? 'font-medium' : 'text-gray-500'
                }`}
                style={
                  activeTab === tab ? { color: user?.teams?.color } : undefined
                }
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 컨텐츠 영역 */}
        <View className='flex-1'>{renderContent()}</View>
      </View>
    </SafeAreaView>
  );
}
