import './globals.css'
import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import {ClerkProvider} from "@clerk/nextjs";
import {ToastProvider} from "@/components/providers/toast-provider";
import {ConfettiProvider} from "@/components/providers/confetti-provider";
import {ThemeProvider} from "@/components/providers/theme-provider";

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
    title: 'Slope Online School',
    description: 'Slope Online School',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider>
            <html lang="en">
            <body className={inter.className}>
                <ToastProvider/>
                <ConfettiProvider/>
                {children}
            </body>
            </html>
        </ClerkProvider>
    )
}
