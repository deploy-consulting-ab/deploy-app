"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";

export const BackButton = ({ label, href }) => {
    return (
        <Button variant="link" className="w-full font-normal" size="sm" asChild>
            <Link href={href}>
                {label}
            </Link>
        </Button>
    )
}