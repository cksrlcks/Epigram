import { User } from 'next-auth';
import { z } from 'zod';

export const signupFormSchema = z
  .object({
    email: z.string().min(1, '이메일은 필수 입력입니다.').email('이메일 형식으로 작성해 주세요.'),
    nickname: z
      .string()
      .min(1, '닉네임은 필수 입력입니다.')
      .max(20, '닉네임은 최대 20자까지 가능합니다.'),
    password: z.preprocess(
      (value) => (value === '' ? undefined : value),
      z
        .string({ required_error: '비밀번호는 필수 입력입니다.' })
        .min(8, '비밀번호는 최소 8자 이상입니다.')
        .regex(/^[a-zA-Z0-9!@#$%^&*()_+]+$/, '비밀번호는 숫자, 영문, 특수문자로만 가능합니다.'),
    ),
    passwordConfirmation: z.string().min(1, '비밀번호 확인을 입력해 주세요.'),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirmation'],
  });

export type SignupFormType = z.infer<typeof signupFormSchema>;

export const loginFormSchema = z.object({
  email: z.string().min(1, '이메일은 필수 입력입니다.').email('이메일 형식으로 작성해 주세요.'),
  password: z.string().min(1, '비밀번호는 필수 입력입니다.'),
});

export type LoginFormType = z.infer<typeof loginFormSchema>;

export type AuthResponse = {
  refreshToken: string;
  accessToken: string;
  user: User;
};

export type RefreshResponse = Pick<AuthResponse, 'accessToken'>;

export type googleTokenRepsone = {
  id_token: string;
};
