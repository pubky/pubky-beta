import './global.css';
import DynamicMeta from '@/components/DynamicMeta';

import { FilterWrapper, ToastWrapper, PubkyClientWrapper, ModalProvider } from '@/contexts';
import { ProtectedRoutes, Alerts } from '@/components';
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
              <ToastWrapper>
                <ModalProvider>
                  <ProtectedRoutes>{children}</ProtectedRoutes>
                  <Alerts />
                </ModalProvider>
              </ToastWrapper>
            </FilterWrapper>
          </PubkyClientWrapper>
        </Providers>
      </body>
    </html>
  );
}
