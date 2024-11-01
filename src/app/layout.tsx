import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import "@/styles/globals.css";
import ProviderTanstack from "@/providers/tanstack-provider";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ProviderTanstack>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <div className="flex flex-1 flex-col gap-4 px-4 py-10 *:overscroll-none">
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </ProviderTanstack>
      </body>
    </html>
  );
}