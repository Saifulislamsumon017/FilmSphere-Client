'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useForm } from '@tanstack/react-form';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

import AppField from '@/components/shared/form/AppField';
import AppSubmitButton from '@/components/shared/form/AppSubmitButton';
import { resetPasswordService } from '@/services/auth/resetPassword.service';

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email,
      otp: '',
      newPassword: '',
    },

    onSubmit: async ({ value }) => {
      setServerError(null);

      const res = await resetPasswordService({
        email: value.email,
        otp: value.otp,
        newPassword: value.newPassword,
      });

      if (!res.success) {
        setServerError(res.message);
        toast.error(res.message);
        return;
      }

      toast.success('Password reset successful');

      router.push('/login');
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={e => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <form.Field name="email">
              {field => <AppField field={field} label="Email" disabled />}
            </form.Field>

            {/* OTP */}
            <form.Field name="otp">
              {field => (
                <InputOTP
                  maxLength={6}
                  value={field.state.value}
                  onChange={field.handleChange}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              )}
            </form.Field>

            {/* Password */}
            <form.Field name="newPassword">
              {field => (
                <AppField field={field} label="New Password" type="password" />
              )}
            </form.Field>

            {serverError && (
              <p className="text-red-500 text-sm text-center">{serverError}</p>
            )}

            <AppSubmitButton isPending={form.state.isSubmitting}>
              Reset Password
            </AppSubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordForm;
