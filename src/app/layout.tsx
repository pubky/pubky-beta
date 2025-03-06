import './global.css';
import DynamicMeta from '@/components/DynamicMeta';

import { FilterWrapper, PubkyClientWrapper, ModalProvider } from '@/contexts';
import { ProtectedRoutes, Toasts, Alerts } from '@/components';
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
            <FilterWrapper>
              <ModalProvider>
                <ProtectedRoutes>{children}</ProtectedRoutes>
                <Alerts />
                <Toasts />
              </ModalProvider>
            </FilterWrapper>
          </PubkyClientWrapper>
        </Providers>
      </body>
    </html>
  );
}
