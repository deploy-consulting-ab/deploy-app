"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export const SocialComponent = () => {

    const handleGoogleLogin = () => {
        console.log('Google login');
    }   

    const handleGithubLogin = () => {
        console.log('Github login');
    }

    return (
        <div className="flex items-center w-full gap-x-2">
            <Button size="lg" className="flex-1" variant="outline" onClick={handleGoogleLogin}>
                <FcGoogle className="h-5 w-5"/>
            </Button>
            <Button size="lg" className="flex-1" variant="outline" onClick={handleGithubLogin}>
                <FaGithub className="h-5 w-5"/>
            </Button>
        </div>
    )
}