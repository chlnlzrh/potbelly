import { Inter } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '../providers/QueryProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'My Restaurant Build',
  description: 'Track your restaurant construction progress',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-background antialiased`}>
        <QueryProvider>
          <main className="h-full">
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  )
}