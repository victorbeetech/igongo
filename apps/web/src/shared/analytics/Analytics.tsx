"use client";
// Loads Google Tag Manager (which carries GA4, Meta Pixel, TikTok Pixel and
// Google Ads tags) only when an ID is set and the visitor has agreed.

import Script from "next/script";
import { useConsent } from "./consent";

// The container ID comes from the environment; none is kept in the code.
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

/** The tag manager, after consent. Renders nothing otherwise. */
export function Analytics() {
  const consent = useConsent();
  if (!GTM_ID || consent !== "granted") return null;
  return (
    <Script id="gtm" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  );
}
