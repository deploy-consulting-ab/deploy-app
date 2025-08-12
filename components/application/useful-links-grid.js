"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Wallet, Shield, Leaf, Clock, FileText } from "lucide-react";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";

const iconMap = {
  Wallet,
  Shield,
  Leaf,
  Clock,
  FileText,
};

export function UsefulLinksGrid({ links, title }) {
  // Convert single item to array if needed
  const linksArray = Array.isArray(links) ? links : [links];
  const isMobile = useIsMobile();
  return (
    <>
      {!isMobile && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

      {linksArray.map((link) => {
        const Icon = iconMap[link.icon];

        return (
          <Card
            variant="shadow"
            key={link.href}
            className="group hover:shadow-lg transition-all duration-200"
          >
            <Link href={link.href} className="block" target={link.target}>
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                  {link.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {link.description}
                </p>
              </CardContent>
            </Link>
          </Card>
        );
      })}
    </div>
    </>
  );
}
