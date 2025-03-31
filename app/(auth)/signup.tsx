import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  TextInputProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { signup } from '@/apis/auth';
import { SignupBody } from '../../types/auth.type';

interface FormField {
  placeholder: string;
  key: keyof SignupBody;
  props?: Partial<TextInputProps>;
}

const FORM_FIELDS: FormField[] = [
  {
    placeholder: '이메일',
    key: 'email',
    props: {
      autoCapitalize: 'none',
      keyboardType: 'email-address',
    },
  },
  {
    placeholder: '이름',
    key: 'name',
  },
  {
    placeholder: '비밀번호',
    key: 'password',
    props: {
      secureTextEntry: true,
    },
  },
];

interface FormInput extends TextInputProps {
  label: string;
}

const FormInput = ({ label, ...props }: FormInput) => (
  <TextInput
    placeholder={label}
    className='border border-gray-300 rounded-lg p-4'
    {...props}
  />
);

export default function SignUpScreen() {
  const [formData, setFormData] = useState<SignupBody>({
    email: '',
    name: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (key: keyof SignupBody) => (text: string) => {
    setFormData((prev) => ({ ...prev, [key]: text }));
  };

  const validateForm = () => {
    const emptyFields = Object.entries(formData).filter(([_, value]) => !value);
    if (emptyFields.length > 0) {
      Alert.alert('알림', '모든 필드를 입력해주세요.');
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await signup(formData);
      Alert.alert('성공', '회원가입이 완료되었습니다.', [
        {
          text: '확인',
          onPress: () => router.replace('/login'),
        },
      ]);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message?.message ||
        '회원가입 중 오류가 발생했습니다.';
      Alert.alert('오류', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='flex-1 justify-center px-6'>
        <Text className='text-2xl font-bold mb-8 text-center'>회원가입</Text>

        <View className='space-y-4 gap-4'>
          {FORM_FIELDS.map((field) => (
            <FormInput
              key={field.key}
              label={field.placeholder}
              value={formData[field.key]}
              onChangeText={handleInputChange(field.key)}
              {...field.props}
            />
          ))}

          <TouchableOpacity
            onPress={handleSignUp}
            className='bg-blue-500 rounded-lg p-4'
            disabled={loading}
            style={loading ? { opacity: 0.7 } : undefined}
          >
            <Text className='text-white text-center font-semibold'>
              {loading ? '처리중...' : '가입하기'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            className='p-4'
            disabled={loading}
          >
            <Text className='text-gray-600 text-center'>
              이미 계정이 있으신가요? 로그인하기
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
