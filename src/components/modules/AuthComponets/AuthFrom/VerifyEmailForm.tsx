'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

import { verifyEmailService } from '@/services/auth/verifyEmail.service';
import AppField from '@/components/shared/form/AppField';
import AppSubmitButton from '@/components/shared/form/AppSubmitButton';

const VerifyEmailForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const email = searchParams.get('email') || '';

  const form = useForm({
    defaultValues: {
      email,
      otp: '',
    },

    onSubmit: async ({ value }) => {
      setServerError(null);

      if (!value.email) {
        toast.error('Email missing in URL');
        return;
      }

      if (value.otp.length !== 6) {
        toast.error('OTP must be 6 digits');
        return;
      }

      const result = await verifyEmailService(value);

      console.log('CLIENT RESULT:', result);

      if (!result || result.success === false) {
        const msg = result.message || 'Verification failed';
        setServerError(msg);
        toast.error(msg);
        return;
      }

      toast.success('Email verified successfully');

      // 🚀 GUARANTEED REDIRECT
      router.push('/login');
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle>Verify Email</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to your email
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={e => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            <form.Field name="email">
              {field => (
                <AppField field={field} label="Email" type="email" disabled />
              )}
            </form.Field>

            <form.Field name="otp">
              {field => (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Verification Code
                  </label>

                  <div className="flex justify-center">
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
                  </div>
                </div>
              )}
            </form.Field>

            {serverError && (
              <p className="text-red-500 text-sm text-center">{serverError}</p>
            )}

            <AppSubmitButton
              isPending={form.state.isSubmitting}
              pendingLabel="Verifying..."
            >
              Verify Email
            </AppSubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailForm;
