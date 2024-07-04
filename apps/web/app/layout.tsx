import './global.css';

import {
  AlertWrapper,
  ClientWrapper,
  FilterWrapper,
  NotificationsWrapper,
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
                <ProtectedRoutes>{children}</ProtectedRoutes>
              </NotificationsWrapper>
            </AlertWrapper>
          </ClientWrapper>
        </FilterWrapper>
      </body>
    </html>
  );
}
