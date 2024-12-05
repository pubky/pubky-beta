import './global.css';

import {
  AlertWrapper,
  FilterWrapper,
  NotificationsWrapper,
  ToastWrapper,
} from '@/contexts';
import { ProtectedRoutes } from '@/components';
import { PubkyClientWrapper } from '@/contexts/_pubky';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <PubkyClientWrapper>
          <FilterWrapper>
            <AlertWrapper>
              <NotificationsWrapper>
                <ToastWrapper>
                  <ProtectedRoutes>{children}</ProtectedRoutes>
                </ToastWrapper>
              </NotificationsWrapper>
            </AlertWrapper>
          </FilterWrapper>
        </PubkyClientWrapper>
      </body>
    </html>
  );
}
