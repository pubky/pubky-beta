import './global.css';

import {
  AlertWrapper,
  FilterWrapper,
  NotificationsWrapper,
  ToastWrapper,
  PubkyClientWrapper,
  ModalProvider
} from '@/contexts';

import { Analytics, ProtectedRoutes, HeaderSEO, DynamicTitle } from '@/components';

export const metadata = {
  ...HeaderSEO.getSeoMetadata(),
  ...HeaderSEO.getPWAConfig()
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>{HeaderSEO.getHeaderMetaTags()}</head>
      <body className="overflow-x-hidden max-w-full min-w-[420px]">
        <PubkyClientWrapper>
          <FilterWrapper>
            <AlertWrapper>
              <NotificationsWrapper>
                <ToastWrapper>
                  <ModalProvider>
                    <DynamicTitle />
                    <ProtectedRoutes>{children}</ProtectedRoutes>
                  </ModalProvider>
                </ToastWrapper>
              </NotificationsWrapper>
            </AlertWrapper>
          </FilterWrapper>
        </PubkyClientWrapper>
        <Analytics />
      </body>
    </html>
  );
}
