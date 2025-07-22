import './global.css';

import {
  AlertWrapper,
  FilterWrapper,
  NotificationsWrapper,
  ToastWrapper,
  PubkyClientWrapper,
  ModalProvider
} from '@/contexts';

import {
  Analytics,
  ProtectedRoutes,
  ErrorBoundary,
  HeaderSEO,
  DynamicTitle,
  DynamicFavicon,
  ViewportHandler
} from '@/components';

export const metadata = {
  ...HeaderSEO.getSeoMetadata(),
  ...HeaderSEO.getPWAConfig()
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scrollbar-thin scrollbar-webkit">
      <head>
        {HeaderSEO.getHeaderMetaTags()}
        {HeaderSEO.getPlausibleScript()}
      </head>
      <body className="text-white overflow-x-hidden max-w-full">
        <ErrorBoundary>
          <PubkyClientWrapper>
            <ViewportHandler />
            <FilterWrapper>
              <AlertWrapper>
                <NotificationsWrapper>
                  <ToastWrapper>
                    <ModalProvider>
                      <DynamicFavicon />
                      <DynamicTitle />
                      <ProtectedRoutes>{children}</ProtectedRoutes>
                    </ModalProvider>
                  </ToastWrapper>
                </NotificationsWrapper>
              </AlertWrapper>
            </FilterWrapper>
          </PubkyClientWrapper>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}
