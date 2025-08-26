import React, { useContext, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { z } from 'zod';

import styles from './styles.module.scss';
import TextInput from '../../components/ui/TextInput';
import PasswordInput from '../../components/ui/PasswordInput';
import Button from '../../components/ui/Button';
import authService from '../../services/authService';
import AuthContext from '../../context/AuthContext';
import { APIError } from '../../lib/errors';

const loginSchema = z.object({
  phoneNumber: z.string().min(10, 'Phone number is required'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters long'),
  district: z.string(),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { setUser, user } = useContext(AuthContext);

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phoneNumber: '',
      password: '',
      district: '',
    },
  });

  const [formMessage, setFormMessage] = useState<{
    type: 'error' | 'success';
    text: string;
  } | null>(null);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data: LoginFormInputs) => {
    setFormMessage(null);

    try {
      const { user, error } = await authService.loginWithPhoneNumberAndPassword(data.phoneNumber, data.password);

      if (error) {
        toast(error, { type: 'error' });
        setFormMessage({
          type: 'error',
          text: error,
        });
        return;
      }

      if (user) {
        setUser(user);
        toast('Login successful.', { type: 'success' });
        navigate('/');
      }
    } catch (error) {
      if (error instanceof APIError) {
        toast(error.message, { type: 'error' });
        setFormMessage({
          type: 'error',
          text: error.message,
        });
      } else {
        toast('An unexpected error occurred while login you in.', {
          type: 'error',
        });
        setFormMessage({
          type: 'error',
          text: 'An unexpected error occurred while login you in.',
        });
      }
    }
  };

  return (
    <div className={styles.loginPage} style={{ backgroundImage: `url('/images/login-page-bg.jpg')` }}>
      <div className={styles.overlay}></div>
      <div className={styles.loginCard}>
        <div className={styles.logoContainer}>
          <img src="/images/detailed-logo.png" alt="Uganda Travel Specialist Logo" className={styles.logo} />
        </div>
        <h1 className={styles.title}>Login to Uganda Travel Specialist</h1>

        <form className={styles.loginForm} onSubmit={handleSubmit(onSubmit)}>
          {formMessage && (
            <p className={`${styles.formMessage} ${formMessage.type === 'error' ? styles.errorMessage : styles.successMessage}`}>
              {formMessage.text}
            </p>
          )}

          <TextInput
            label="Phone number"
            name="phoneNumber"
            type="tel"
            control={control as any}
            errors={errors}
            autoComplete="phone"
            placeholder="+256782346200"
          />

          <PasswordInput
            label="Password"
            name="password"
            control={control as any}
            errors={errors}
            autoComplete="current-password"
            placeholder="Enter your password"
          />

          <Link to="/forgot-password" className={styles.forgotPasswordLink}>
            Forgot Password?
          </Link>

          <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
