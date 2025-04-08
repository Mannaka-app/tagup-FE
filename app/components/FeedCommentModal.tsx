import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Animated,
  Easing,
  PanResponder,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/useAuthStore';
import { usePostFeedComment, useFeedComments } from '@/hooks/useFeed';
import { FeedComment } from '@/apis/feed';

interface FeedCommentModalProps {
  visible: boolean;
  onClose: () => void;
  feedId: number;
}

export default function FeedCommentModal({
  visible,
  onClose,
  feedId,
}: FeedCommentModalProps) {
  const { user } = useAuthStore();
  const [comment, setComment] = useState('');
  const { data: commentsData } = useFeedComments(feedId, {
    enabled: visible,
  });
  const { mutate: postComment } = usePostFeedComment();
  const slideAnim = useRef(new Animated.Value(1000)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 0; // 아래로 스와이프할 때만 반응
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          // 아래로만 움직일 수 있음
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 200) {
          // 200 이상 내리면 닫기
          Animated.timing(slideAnim, {
            toValue: 1000,
            duration: 300,
            useNativeDriver: true,
          }).start(onClose);
        } else {
          // 아니면 원래 위치로
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            damping: 15,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(1000);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 1000,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    try {
      await postComment({
        content: comment,
        feedId,
      });
      setComment('');
      // TODO: 댓글 목록 새로고침
    } catch (error) {
      console.error('댓글 작성 실패:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType='none'
      presentationStyle='overFullScreen'
      transparent={true}
      onRequestClose={onClose}
    >
      <View className='flex-1 bg-black/50'>
        <Pressable className='flex-1' onPress={onClose} />
        <Animated.View
          className='h-[90%] bg-white rounded-t-3xl overflow-hidden'
          style={{
            transform: [{ translateY: slideAnim }],
          }}
          {...panResponder.panHandlers}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className='flex-1'
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          >
            <SafeAreaView edges={['top', 'bottom']} className='flex-1'>
              {/* 헤더 */}
              <View className='items-center pt-2 pb-3 border-b border-gray-200'>
                <View className='w-10 h-1 bg-gray-300 rounded-full mb-3' />
                <Text className='text-lg font-medium'>댓글</Text>
              </View>

              {/* 댓글 목록 */}
              <ScrollView className='flex-1 gap-[10px] px-5'>
                {commentsData?.comment.map((comment: FeedComment) => (
                  <View key={comment.id} className='py-3 '>
                    <View className='flex-row items-center justify-between'>
                      <View className='flex-row items-center'>
                        <Image
                          source={{ uri: comment.profileUrl }}
                          className='w-8 h-8 rounded-full mr-2'
                        />
                        <View>
                          <Text className='font-medium'>
                            {comment.nickName}
                          </Text>
                          <Text className='text-xs text-gray-500'>
                            Lv.{comment.userLevel}
                          </Text>
                        </View>
                      </View>
                      <Text className='text-xs text-gray-500'>
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <Text className='mt-2'>{comment.content}</Text>
                  </View>
                ))}
              </ScrollView>

              {/* 댓글 입력 */}
              <View className='border-t border-gray-200'>
                <View className='flex-row items-center px-5 py-4'>
                  {user && (
                    <Image
                      source={{ uri: user.profileUrl as string }}
                      className='w-8 h-8 rounded-full mr-2 border-[0.1px] border-gray-300'
                    />
                  )}
                  <View className='flex-1 flex-row items-center bg-gray-100 rounded-full h-10'>
                    <TextInput
                      className='flex-1 px-4'
                      placeholder='댓글을 입력해주세요'
                      value={comment}
                      onChangeText={setComment}
                      onSubmitEditing={handleSubmit}
                    />
                    <View className='w-11 h-full items-center justify-center'>
                      {comment.trim().length > 0 && (
                        <TouchableOpacity
                          onPress={handleSubmit}
                          className='bg-[#0095F6] rounded-full w-7 h-7 items-center justify-center'
                        >
                          <Ionicons name='arrow-up' size={18} color='white' />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </SafeAreaView>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
}
