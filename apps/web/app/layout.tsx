import './global.css';

import { ClientWrapper } from '../contexts/client';
import { FilterWrapper } from '../contexts/filters';
import ProtectedRoutes from './components/ProtectedRoutes';

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
