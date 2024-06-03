import './global.css';

import { ClientWrapper } from '../contexts/client';
import { FilterWrapper } from '../contexts/filters';
import { ProtectedRoutes } from '../components';
import { AlertWrapper } from '../contexts/alerts';

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
              <ProtectedRoutes>{children}</ProtectedRoutes>
            </AlertWrapper>
          </ClientWrapper>
        </FilterWrapper>
      </body>
    </html>
  );
}
