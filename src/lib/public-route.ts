const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/verify-email',
  '/reset-password',
  '/forgot-password',
];

export const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
};
