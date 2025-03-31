import { SignupBody } from '../types/auth.type';
import { axiosInstance } from './@core';

export const signup = async (signupBody: SignupBody) => {
  const response = await axiosInstance.post('/auth/signup', signupBody);
  return response.data;
};
