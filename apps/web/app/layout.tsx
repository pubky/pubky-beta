import './global.css';

import { ClientWrapper } from '../contexts/client';
import { FilterWrapper } from '../contexts/filters';
import ProtectedRoutes from './components/ProtectedRoutes';

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
            <ProtectedRoutes>{children}</ProtectedRoutes>
          </ClientWrapper>
        </FilterWrapper>
      </body>
    </html>
  );
}
