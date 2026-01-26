import React from "react";
import { SiteHeader } from "@/components/site-header";
import { BreadcrumbProvider } from "@/components/app-breadcrumb";

export default async function RootPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbProvider>
        <SiteHeader />
      </BreadcrumbProvider>

      <main className="flex-1">{children}</main>
    </>
  );
}
