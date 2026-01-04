import "./globals.css";
import { JobawayCssLinks, JobawayScripts } from "./JobawayAssets";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <JobawayCssLinks />
      </head>
      <body>
        {children}
        <JobawayScripts />
      </body>
    </html>
  );
}
