export const siteConfig = {
  name: "Crochet Corner",
  description:
    "Your cozy corner for crochet patterns, projects, and a creative community.",
  tagline: "Every stitch tells a story — creativity happens one loop at a time.",
  logo: {
    src: "/CrochetCornerLogo.png",
    alt: "Crochet Corner",
    width: 180,
    height: 180,
  },
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

export const authRoutes = {
  home: "/",
  login: "/login",
  signup: "/signup",
  verifyEmail: "/verify-email",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
};

export const otpTypes = {
  emailVerification: "email_verification",
  passwordReset: "password_reset",
};

export const authCopy = {
  login: {
    title: "Welcome back!",
    subtitle: "Pick up right where your yarn left off.",
    footerText: "Don't have an account?",
    footerLink: "Create one free",
    submitLabel: "Sign in with email",
    loadingLabel: "Signing in...",
  },
  signup: {
    title: "Create your account",
    subtitle: "A world of patterns, colors, and cozy projects awaits.",
    footerText: "Already have an account?",
    footerLink: "Sign in instead",
    submitLabel: "Sign up with email",
    loadingLabel: "Creating account...",
  },
};

export const validationMessages = {
  passwordMismatch: "Passwords do not match.",
  passwordTooShort: "Password must be at least 6 characters.",
  otpIncomplete: "Please enter the full 6-digit code.",
  genericError: "Something went wrong. Please try again.",
};

export const MIN_PASSWORD_LENGTH = 6;
export const OTP_LENGTH = 6;
