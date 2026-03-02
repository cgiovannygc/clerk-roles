# Gestion de roles con clerk

## Pasos para el funcionamiento

(considera que si tienes windows, tendras que modificar la dependencia de tailwing, ya que al parecer tiene archivos diferentes para cada SO)

- Ajusta las variables de entorno:
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY,
  CLERK_WEBHOOK_SECRET,
  NEXT_PUBLIC_CLERK_SIGN_UP_URL,
  NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL,
  NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL,
  CONVEX_DEPLOYMENT,
  NEXT_PUBLIC_CONVEX_URL,
  NEXT_PUBLIC_CONVEX_SITE_URL,
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_EVENT_SECRET_KEY
- npm install
- npm run dev
- npx convex dev
- localhost:3000
- Abre listener, en 'ports' en la seccion de la terminal en vs code, en el puerto 3000 y hazlo publico (IMPORTANTE para el funcionamiento del webhook de stripe)
