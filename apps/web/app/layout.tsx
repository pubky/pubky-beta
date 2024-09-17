'use client';

import './global.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import {
  AlertWrapper,
  ClientWrapper,
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
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body>
        <PubkyClientWrapper>
          <QueryClientProvider client={queryClient}>
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
          </QueryClientProvider>
        </PubkyClientWrapper>
      </body>
    </html>
  );
}
