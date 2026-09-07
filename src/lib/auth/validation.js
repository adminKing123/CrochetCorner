import { otpTypes, validationMessages } from "@/config/site";

export { otpTypes };

export const OTP_TYPES = Object.values(otpTypes);

export function isValidOtpType(type) {
  return OTP_TYPES.includes(type);
}

export function validatePasswordMatch(password, confirmPassword) {
  if (password !== confirmPassword) {
    return validationMessages.passwordMismatch;
  }

  return validatePasswordLength(password);
}

export function validatePasswordLength(password) {
  if (password.length < 6) {
    return validationMessages.passwordTooShort;
  }

  return null;
}

export function validatePassword(password, confirmPassword) {
  return validatePasswordMatch(password, confirmPassword);
}

export function validateOtp(code) {
  if (code.length !== 6) {
    return validationMessages.otpIncomplete;
  }

  return null;
}
