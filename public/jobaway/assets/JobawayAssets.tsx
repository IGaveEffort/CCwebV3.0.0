import Script from 'next/script';

/**
 * Drop this into app/layout.tsx <head> (links) and <body> (scripts)
 * so the Jobaway theme CSS/JS and plugins load exactly.
 */
export function JobawayCssLinks() {
    return (
        <>
            <link rel="stylesheet" href="/jobaway/assets/css/bootstrap.css" />
            <link rel="stylesheet" href="/jobaway/assets/css/animate.css" />
            <link rel="stylesheet" href="/jobaway/assets/css/font-awesome-all.css" />
            <link rel="stylesheet" href="/jobaway/assets/css/flaticon.css" />
            <link rel="stylesheet" href="/jobaway/assets/css/elpath.css" />
            <link rel="stylesheet" href="/jobaway/assets/css/owl.css" />
            <link rel="stylesheet" href="/jobaway/assets/css/jquery.fancybox.min.css" />
            <link rel="stylesheet" href="/jobaway/assets/css/nice-select.css" />
            <link rel="stylesheet" href="/jobaway/assets/css/odometer.css" />
            <link rel="stylesheet" href="/jobaway/assets/css/jquery-ui.css" />
            <link rel="stylesheet" href="/jobaway/assets/css/style.css" />
            <link rel="stylesheet" href="/jobaway/assets/css/responsive.css" />
            <link rel="stylesheet" href="/jobaway/assets/css/color.css" />
            {/* Optional: rtl.css if needed */}
            {/* <link rel="stylesheet" href="/jobaway/assets/css/rtl.css" /> */}
        </>
    );
}

export function JobawayScripts() {
    return (
        <>
            {/* jQuery is required by the theme JS */}
            <Script
                src="https://code.jquery.com/jquery-3.6.0.min.js"
                strategy="beforeInteractive"
            />
            <Script src="/jobaway/assets/js/bootstrap.min.js" strategy="afterInteractive" />
            <Script src="/jobaway/assets/js/wow.js" strategy="afterInteractive" />
            <Script src="/jobaway/assets/js/owl.js" strategy="afterInteractive" />
            <Script src="/jobaway/assets/js/jquery.fancybox.js" strategy="afterInteractive" />
            <Script src="/jobaway/assets/js/jquery.nice-select.min.js" strategy="afterInteractive" />
            <Script src="/jobaway/assets/js/odometer.js" strategy="afterInteractive" />
            <Script src="/jobaway/assets/js/appear.js" strategy="afterInteractive" />
            <Script src="/jobaway/assets/js/isotope.js" strategy="afterInteractive" />
            <Script src="/jobaway/assets/js/scrolltop.min.js" strategy="afterInteractive" />
            <Script src="/jobaway/assets/js/script.js" strategy="afterInteractive" />
        </>
    );
}
