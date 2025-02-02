//Global
import { ToastContainer } from "react-toastify";

import { NextIntlClientProvider } from 'next-intl';

//Components
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
//Redux-Wrapper
import { ProviderComponent } from "@/redux/provider";

import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';

import { getMessages } from 'next-intl/server';

//Styles
import "./globals.scss";

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'tr' }, { locale: 'ru' }];
}

export default async function RootLayout({ children,
  params: { locale } }: {
    children: React.ReactNode,
    params: { locale: string };
  }) {

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {

  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="google-site-verification" content="bOd8QqxGkJuvqApQU2_PuZzjTqZZuR-nqpY2PA33nzw" />
        <title>TuranLine</title>
      </head>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ProviderComponent>
            <div className="wrapper">
              {/* <Header /> */}
              {children}
              {/* <Footer /> */}
            </div>
          </ProviderComponent>
        </NextIntlClientProvider>
        <ToastContainer />
      </body>
    </html>
  );
}