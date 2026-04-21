/* =========================================================
   FORGET PASSWORD FORM
   FILE: src/components/modules/auth/ForgetPasswordForm.tsx
========================================================= */
'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useState } from 'react';
import { useForm } from '@tanstack/react-form';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import AppField from '@/components/shared/form/AppField';
import AppSubmitButton from '@/components/shared/form/AppSubmitButton';

import { forgetPasswordService } from '@/services/auth/forgetPassword.service';

const ForgetPasswordForm = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: '',
    },

    onSubmit: async ({ value }) => {
      setServerError(null);

      const result = await forgetPasswordService(value);

      if (!result || result.success === false) {
        const msg = result.message || 'Failed';
        setServerError(msg);
        toast.error(msg);
        return;
      }

      toast.success(result.message);

      router.push(
        `/reset-password?email=${encodeURIComponent(value.email.trim())}`,
      );
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>Enter your email to receive OTP</CardDescription>
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
                <AppField
                  field={field}
                  label="Email"
                  type="email"
                  placeholder="Enter email"
                />
              )}
            </form.Field>

            {serverError && (
              <p className="text-sm text-center text-red-500">{serverError}</p>
            )}

            <AppSubmitButton
              isPending={form.state.isSubmitting}
              pendingLabel="Sending..."
            >
              Send OTP
            </AppSubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgetPasswordForm;
