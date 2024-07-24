import './global.css';

import {
  AlertWrapper,
  ClientWrapper,
  FilterWrapper,
  NotificationsWrapper,
  ToastWrapper,
} from '@/contexts';
import { ProtectedRoutes } from '@/components';

export const metadata = {
  title: 'Pubky',
  description: 'Pubky social',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <FilterWrapper>
          <ClientWrapper>
            <AlertWrapper>
              <NotificationsWrapper>
                <ToastWrapper>
                  <ProtectedRoutes>{children}</ProtectedRoutes>
                </ToastWrapper>
              </NotificationsWrapper>
            </AlertWrapper>
          </ClientWrapper>
        </FilterWrapper>
      </body>
    </html>
  );
}
