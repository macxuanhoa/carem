'use server'

import { signIn } from '@/auth'
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    console.log('Attempting login...');
    // We use redirect: false to prevent NextAuth from throwing a redirect error
    // so we can handle success/failure manually
    const result = await signIn('credentials', {
        username: formData.get('username'),
        password: formData.get('password'),
        redirect: false, 
    });

    // Note: In some NextAuth v5 versions, signIn might still throw on error
    // or return undefined on success?
    console.log('SignIn Result:', result);
    
    // If we get here, it might be successful.
  } catch (error) {
    // If it's an AuthError, we handle it
    if (error instanceof AuthError) {
      console.log('AuthError:', error.type);
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Tài khoản hoặc mật khẩu không đúng.';
        default:
          return 'Đã có lỗi xảy ra.';
      }
    }

    // If it's a redirect error (even with redirect:false sometimes), let it pass
    // Or if it's any other error
    console.log('Catch Error:', error);
    throw error;
  }
  
  // If success, we redirect manually
  redirect('/');
}
