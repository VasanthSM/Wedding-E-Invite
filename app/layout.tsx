import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={title:"Selvam weds Raja Praba",description:"A little Cupid invites you to celebrate Selvam and Raja Praba on 25 October 2026."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
