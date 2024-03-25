import './global.css';

import { ClientWrapper } from '../contexts/client';
import { FilterWrapper } from '../contexts/filters';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <FilterWrapper>
          <ClientWrapper>{children}</ClientWrapper>
        </FilterWrapper>
      </body>
    </html>
  );
}
