import './globals.scss'
import Script from 'next/script'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'From Playlist To Playlist',
    description: 'Transfer songs from a Spotify playlist to a YouTube playlist and vice versa!',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Script src="https://kit.fontawesome.com/315845a82f.js" crossOrigin="anonymous"></Script>
                
                {children}
            </body>
        </html>
    )
}
