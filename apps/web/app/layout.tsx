import './global.css';
import DynamicMeta from '@/components/DynamicMeta';

import {
  AlertWrapper,
  FilterWrapper,
  NotificationsWrapper,
  ToastWrapper,
  PubkyClientWrapper,
  ModalJoinProvider,
} from '@/contexts';
import { ProtectedRoutes } from '@/components';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <DynamicMeta />
      </head>
      <body className="overflow-x-hidden max-w-full">
        <PubkyClientWrapper>
          <FilterWrapper>
            <AlertWrapper>
              <NotificationsWrapper>
                <ToastWrapper>
                  <ModalJoinProvider>
                    <ProtectedRoutes>{children}</ProtectedRoutes>
                  </ModalJoinProvider>
                </ToastWrapper>
              </NotificationsWrapper>
            </AlertWrapper>
          </FilterWrapper>
        </PubkyClientWrapper>
      </body>
    </html>
  );
}
