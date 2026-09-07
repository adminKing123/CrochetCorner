"use client";

import OtpInput from "@/components/auth/OtpInput";
import ResendOtpLink from "@/components/auth/ResendOtpLink";
import { useOtpForm } from "@/hooks/useOtpForm";
import { AuthButton, AuthError, AuthSuccess } from "@/components/auth/ui";

export default function OtpVerificationForm({
  email,
  otpType,
  submitLabel,
  loadingLabel = "Verifying...",
  onVerify,
}) {
  const {
    otp,
    setOtp,
    error,
    setError,
    success,
    setSuccess,
    loading,
    handleSubmit,
    clearOtp,
  } = useOtpForm({ onVerify });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AuthError message={error} />
      <AuthSuccess message={success} />

      <OtpInput value={otp} onChange={setOtp} disabled={loading} />

      <AuthButton type="submit" disabled={loading || otp.length !== 6}>
        {loading ? loadingLabel : submitLabel}
      </AuthButton>

      <ResendOtpLink
        email={email}
        type={otpType}
        onSuccess={(message) => {
          setSuccess(message);
          clearOtp();
        }}
        onError={setError}
      />
    </form>
  );
}
