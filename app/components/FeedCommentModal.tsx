import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FeedComment } from '@/apis/feed';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/useAuthStore';

interface FeedCommentModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (content: string) => void;
  onDelete: (commentId: number) => void;
  comments: FeedComment[];
}

const FeedCommentModal = ({
  visible,
  onClose,
  onSubmit,
  onDelete,
  comments,
}: FeedCommentModalProps) => {
  const [content, setContent] = useState('');
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit(content.trim());
    setContent('');
  };

  const handleDelete = (commentId: number) => {
    Alert.alert(
      '댓글 삭제',
      '정말로 이 댓글을 삭제하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => onDelete(commentId),
        },
      ],
      { cancelable: true }
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <Modal
      visible={visible}
      animationType='slide'
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View className='flex-1 bg-black/50'>
          <View
            className='h-2/3 bg-white rounded-t-3xl mt-auto'
            style={{ paddingBottom: insets.bottom }}
          >
            {/* 헤더 */}
            <View className='flex-row items-center justify-between p-4 border-b border-gray-200'>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name='close' size={24} />
              </TouchableOpacity>
              <Text className='text-lg font-semibold'>댓글</Text>
              <View style={{ width: 24 }} />
            </View>

            {/* 댓글 목록 */}
            <ScrollView className='flex-1 px-4'>
              {comments.map((comment) => (
                <View
                  key={comment.id}
                  className='flex-row items-start space-x-2 py-3'
                >
                  <Image
                    source={{ uri: comment.profileUrl }}
                    className='h-8 w-8 rounded-full'
                  />
                  <View className='flex-1'>
                    <View className='flex-row items-center justify-between'>
                      <View className='flex-row items-center space-x-2'>
                        <Text className='font-semibold'>
                          {comment.nickName}
                        </Text>
                        <Text className='text-xs text-gray-500'>
                          {formatDate(comment.createdAt)}
                        </Text>
                      </View>
                      {user?.id === comment.userId && (
                        <TouchableOpacity
                          onPress={() => handleDelete(comment.id)}
                          className='p-1'
                        >
                          <Ionicons
                            name='trash-outline'
                            size={16}
                            color='#ef4444'
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                    <Text className='mt-1'>{comment.content}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* 댓글 입력 */}
            <View className='p-4 border-t border-gray-200 flex-row items-center space-x-2'>
              <TextInput
                className='flex-1 bg-gray-100 rounded-full px-4 py-2'
                placeholder='댓글을 입력하세요'
                value={content}
                onChangeText={setContent}
                multiline
                maxLength={200}
              />
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!content.trim()}
                className={`p-2 rounded-full ${
                  content.trim() ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <Ionicons
                  name='send'
                  size={20}
                  color='white'
                  style={{ transform: [{ rotate: '45deg' }] }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default FeedCommentModal;
