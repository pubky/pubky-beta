import './global.css';
import DynamicMeta from '@/components/DynamicMeta';

import { PubkyClientWrapper } from '@/contexts';
import { ProtectedRoutes, Toasts, Alerts, Modals } from '@/components';
import { Providers } from '@/store/provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <DynamicMeta />
      </head>
      <body className="overflow-x-hidden max-w-full">
        <Providers>
          <PubkyClientWrapper>
            <ProtectedRoutes>{children}</ProtectedRoutes>
            <Alerts />
            <Toasts />
            <Modals />
          </PubkyClientWrapper>
        </Providers>
      </body>
    </html>
  );
}
