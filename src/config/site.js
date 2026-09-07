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
  shop: "/shop",
  collections: "/collections",
  collectionDetail: (id) => `/collections/${id}`,
  login: "/login",
  signup: "/signup",
  verifyEmail: "/verify-email",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  admin: "/admin",
  customOrders: "/custom-orders",
  myCustomOrders: "/custom-orders/requests",
  about: "/about",
  cart: "/cart",
  checkout: "/checkout",
  myOrders: "/orders",
};

export const adminRoutes = {
  root: "/admin",
  heroCarousel: "/admin/hero-carousel",
  products: "/admin/products",
  productNew: "/admin/products/new",
  productEdit: (id) => `/admin/products/${id}/edit`,
  collections: "/admin/collections",
  collectionNew: "/admin/collections/new",
  collectionEdit: (id) => `/admin/collections/${id}/edit`,
  keys: "/admin/keys",
  categories: "/admin/categories",
  customOrders: "/admin/custom-orders",
  shopOrders: "/admin/shop-orders",
};

export const adminNavItems = [
  {
    label: "Hero Carousel",
    href: adminRoutes.heroCarousel,
    icon: "IoImagesOutline",
  },
  {
    label: "Products",
    href: adminRoutes.products,
    icon: "IoBagOutline",
  },
  {
    label: "Collections",
    href: adminRoutes.collections,
    icon: "IoAlbumsOutline",
  },
  {
    label: "Keys",
    href: adminRoutes.keys,
    icon: "IoKeyOutline",
  },
  {
    label: "Categories",
    href: adminRoutes.categories,
    icon: "IoFolderOutline",
  },
  {
    label: "Custom Orders",
    href: adminRoutes.customOrders,
    icon: "IoCreateOutline",
  },
  {
    label: "Shop Orders",
    href: adminRoutes.shopOrders,
    icon: "IoReceiptOutline",
  },
];

export const taxonomyAdminConfig = {
  keys: {
    type: "keys",
    title: "Keys",
    singular: "Key",
    description: "Manage product keys used for tagging and filtering.",
    route: adminRoutes.keys,
  },
  categories: {
    type: "categories",
    title: "Categories",
    singular: "Category",
    description: "Manage product categories for organization and browsing.",
    route: adminRoutes.categories,
  },
};

export const navLinks = [
  { label: "Shop", href: authRoutes.shop },
  { label: "Collections", href: authRoutes.collections },
  { label: "Custom Orders", href: authRoutes.customOrders },
  { label: "Our Story", href: authRoutes.about },
];

export const footerLinks = [
  { label: "About Us", href: authRoutes.about },
  { label: "Shop", href: authRoutes.shop },
  { label: "Collections", href: authRoutes.collections },
  { label: "Custom Orders", href: authRoutes.customOrders },
];

export const contactInfo = {
  location: "India",
};

export const profileMenuItems = [
  { label: "My Orders", href: authRoutes.myOrders },
  { label: "My Custom Orders", href: authRoutes.myCustomOrders },
  { label: "New Custom Order", href: authRoutes.customOrders },
  { label: "Log out", action: "logout" },
];

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
