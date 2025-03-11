import './global.css';
import DynamicMeta from '@/components/DynamicMeta';
import PullDownRefresh from '@/components/PullDownRefresh';

import {
  AlertWrapper,
  FilterWrapper,
  NotificationsWrapper,
  ToastWrapper,
  PubkyClientWrapper,
  ModalProvider
} from '@/contexts';
import { ProtectedRoutes } from '@/components';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <DynamicMeta />
      </head>
      <body className="overflow-x-hidden max-w-full">
        <PullDownRefresh />
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
      </body>
    </html>
  );
}
