import './global.css';
import { getViewport, getSeoMetadata, getPWAConfig, getPWATags } from '@/components/HeaderSEO';

import {
  AlertWrapper,
  FilterWrapper,
  NotificationsWrapper,
  ToastWrapper,
  PubkyClientWrapper,
  ModalProvider
} from '@/contexts';
import { ProtectedRoutes } from '@/components';

export const viewport = getViewport();

export const metadata = {
  ...getSeoMetadata({
    title: 'Pubky.app | Unlock the web',
    description: 'Unlock the web. Your keys, your content, your rules.'
  }),
  ...getPWAConfig()
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>{getPWATags()}</head>
      <body className="overflow-x-hidden max-w-full min-w-[420px]">
        <PubkyClientWrapper>
          <FilterWrapper>
            <AlertWrapper>
              <NotificationsWrapper>
                <ToastWrapper>
                  <ModalProvider>
                    <ProtectedRoutes>{children}</ProtectedRoutes>
                  </ModalProvider>
                </ToastWrapper>
              </NotificationsWrapper>
            </AlertWrapper>
          </FilterWrapper>
        </PubkyClientWrapper>
      </body>
    </html>
  );
}
