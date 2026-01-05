import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  PawPrint,
  Mail,
  Loader2,
  ArrowLeft,
  Lock,
  KeyRound,
} from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const handleSendCode = async () => {
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setIsSendingCode(true);
    try {
      await authApi.forgotPassword(email);
      setCodeSent(true);
      toast.success('Verification code sent to your email');
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Failed to send verification code'
      );
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationCode || !newPassword || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsResetting(true);
    try {
      await authApi.resetPassword({
        email,
        code: verificationCode,
        newPassword,
      });
      toast.success('Password reset successful');
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Failed to reset password'
      );
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <div className="w-full max-w-md">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 gradient-hero rounded-xl flex items-center justify-center">
            <PawPrint className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">Happy-Paws</span>
        </div>

        <h2 className="text-3xl font-bold mb-2">Reset Password</h2>
        <p className="text-muted-foreground mb-8">
          Enter your email to receive a verification code
        </p>

        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="space-y-2">
            <Label>Email</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11"
                />
              </div>
              <Button
                type="button"
                variant="hero"
                onClick={handleSendCode}
                disabled={isSendingCode}
              >
                {isSendingCode ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Send Code'
                )}
              </Button>
            </div>
          </div>

          {codeSent && (
            <>
              <div className="space-y-2">
                <Label>Verification Code</Label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter verification code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="pl-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-11"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isResetting}
              >
                {isResetting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
