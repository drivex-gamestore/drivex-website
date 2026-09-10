import AppProviders from '@app/providers';
import '../styles/global.css';
import AppLayout from '@components/AppLayout';

export const metadata = {
  title: 'DriveX Store',
  description: 'Smooth animations and store experience',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body data-transition-phase="idle">
        <AppProviders>
          <AppLayout />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
