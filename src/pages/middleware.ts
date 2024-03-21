// import NextAuth from 'next-auth';

// export default auth((req) => {
//  const { nextUrl } = req;

//  const isAuthenticated = !!req.auth;

//  if (isAuthenticated)
//   return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));

//  if (!isAuthenticated && !isPublicRoute)
//   return Response.redirect(new URL(ROOT, nextUrl));
// });

// export const config = {
//  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
// };