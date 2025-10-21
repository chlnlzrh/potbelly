import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'My Restaurant Build',
  description: 'Track your restaurant construction progress',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-background antialiased`}>
        <main className="h-full">
          {children}
        </main>
      </body>
    </html>
  )
}