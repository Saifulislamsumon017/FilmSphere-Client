'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { IRegisterPayload, registerUserZodSchema } from '@/zod/auth.validation';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';

import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import AppField from '@/components/shared/form/AppField';
import AppSubmitButton from '@/components/shared/form/AppSubmitButton';

import { IRegisterResponse } from '@/types/auth.types';
import { ApiErrorResponse } from '@/types/api.types';
import { registerService } from '@/services/auth/register.service';

import { toast } from 'sonner';
import GoogleLoginButton from '../GoogleLogIn/GoogleLoginButton';

type RegisterResponse = IRegisterResponse | ApiErrorResponse;

const RegisterForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync, isPending } = useMutation<
    RegisterResponse,
    Error,
    IRegisterPayload
  >({
    mutationFn: registerService,
  });

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    } satisfies IRegisterPayload,

    onSubmit: async ({ value }) => {
      setServerError(null);

      try {
        const result = await mutateAsync(value);

        if ('success' in result && result.success === false) {
          const msg = result.message || 'Registration failed';
          setServerError(msg);
          toast.error(msg);
          return;
        }

        toast.success('Account created successfully!');
      } catch (error) {
        const msg =
          error instanceof Error ? error.message : 'Registration failed';

        setServerError(msg);
        toast.error(msg);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md mx-auto shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Please enter your information to register.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={e => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            {/* NAME */}
            <form.Field
              name="name"
              validators={{
                onChange: registerUserZodSchema.shape.name,
              }}
            >
              {field => (
                <AppField
                  field={field}
                  label="Full Name"
                  placeholder="Enter your full name"
                />
              )}
            </form.Field>

            {/* EMAIL */}
            <form.Field
              name="email"
              validators={{
                onChange: registerUserZodSchema.shape.email,
              }}
            >
              {field => (
                <AppField
                  field={field}
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                />
              )}
            </form.Field>

            {/* PASSWORD */}
            <form.Field
              name="password"
              validators={{
                onChange: registerUserZodSchema.shape.password,
              }}
            >
              {field => (
                <AppField
                  field={field}
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  append={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => setShowPassword(prev => !prev)}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </Button>
                  }
                />
              )}
            </form.Field>

            {/* SERVER ERROR */}
            {serverError && (
              <Alert variant="destructive">
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            {/* SUBMIT */}
            <form.Subscribe
              selector={state => [state.canSubmit, state.isSubmitting] as const}
            >
              {([canSubmit, isSubmitting]) => (
                <AppSubmitButton
                  disabled={!canSubmit}
                  isPending={isSubmitting || isPending}
                  pendingLabel="Creating..."
                >
                  Create Account
                </AppSubmitButton>
              )}
            </form.Subscribe>
          </form>

          {/* DIVIDER */}
          {/* <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>

          <div className="relative flex justify-center text-sm">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div> */}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <GoogleLoginButton />
        </CardContent>

        <CardFooter className="justify-center border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary font-medium hover:underline underline-offset-4"
            >
              Sign in to your account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterForm;
