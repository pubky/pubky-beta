import { ProfileWrapper } from '../contexts/profile';
import { AuthWrapper } from '../contexts/auth';
import './global.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthWrapper>
          <ProfileWrapper>{children}</ProfileWrapper>
        </AuthWrapper>
      </body>
    </html>
  );
}
