'use client';

import './global.css';

import NextTopLoader from 'nextjs-toploader';
import { ClientWrapper } from '../contexts/client';
import { FilterWrapper } from '../contexts/filters';
import ProtectedRoutes from './components/ProtectedRoutes';

// export const metadata = {
//   title: 'Pubky',
//   description: 'Pubky social',
// };

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
            <div className="z-index-999">
              <NextTopLoader color="#FD00FF" />
            </div>
            <ProtectedRoutes>{children}</ProtectedRoutes>
          </ClientWrapper>
        </FilterWrapper>
      </body>
    </html>
  );
}
