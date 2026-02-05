import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import Sidebar from '@/components/Sidebar';
import { ToastProvider } from '@/components/ToastProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InfluencerReach',
  description: 'Streamline your influencer outreach process',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-background">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
        <ToastProvider />
      </body>
    </html>
  );
}
