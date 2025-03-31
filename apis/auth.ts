import { SignupBody } from '@/types/auth.type';
import fetcher from '@/utils/fetcher';

export const signup = async (signupBody: SignupBody) => {
  const response = await fetcher({
    method: 'POST',
    url: '/auth/register',
    data: signupBody,
  });
  return response.data;
};
