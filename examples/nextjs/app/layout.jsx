import './styles.css';
export const metadata = { title: 'Reading room', manifest: '/manifest.webmanifest', icons: {apple: '/icons/apple-touch-icon.png'} };
export const viewport = {width:'device-width', initialScale:1, viewportFit:'cover', themeColor:'#183d36'};
export default function Layout({children}) {return <html lang="en"><body>{children}</body></html>;}
