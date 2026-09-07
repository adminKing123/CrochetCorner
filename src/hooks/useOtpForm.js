"use client";

import { useState } from "react";
import { validateOtp } from "@/lib/auth/validation";

export function useOtpForm({ onVerify }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateOtp(otp);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const message = await onVerify(otp);
      if (message) {
        setSuccess(message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function clearOtp() {
    setOtp("");
  }

  return {
    otp,
    setOtp,
    error,
    setError,
    success,
    setSuccess,
    loading,
    handleSubmit,
    clearOtp,
  };
}
