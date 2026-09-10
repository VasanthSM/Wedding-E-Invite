import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={title:"Raja Praba weds Selvam",description:"A little Cupid invites you to celebrate Raja Praba and Selvam on 25 October 2026."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
