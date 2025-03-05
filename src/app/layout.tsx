import './global.css';
import DynamicMeta from '@/components/DynamicMeta';

import {
  AlertWrapper,
  FilterWrapper,
  NotificationsWrapper,
  ToastWrapper,
  PubkyClientWrapper,
  ModalProvider
} from '@/contexts';
import { ProtectedRoutes } from '@/components';
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
              <AlertWrapper>
                <NotificationsWrapper>
                  <ToastWrapper>
                    <ModalProvider>
                      <ProtectedRoutes>{children}</ProtectedRoutes>
                    </ModalProvider>
                  </ToastWrapper>
                </NotificationsWrapper>
              </AlertWrapper>
            </FilterWrapper>
          </PubkyClientWrapper>
        </Providers>
      </body>
    </html>
  );
}
