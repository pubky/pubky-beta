import './global.css';

import { AlertWrapper, ClientWrapper, FilterWrapper } from '@/contexts';
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
              <ProtectedRoutes>{children}</ProtectedRoutes>
            </AlertWrapper>
          </ClientWrapper>
        </FilterWrapper>
      </body>
    </html>
  );
}
