import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { BellIcon } from "lucide-react"
import { ModeToggleComponent } from "./mode-toggle"

export function DashboardHeader() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">Welcome back, Alex!</h2>
          <p className="text-sm text-muted-foreground">Here's what's happening with your account today.</p>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggleComponent />
          <Button variant="ghost" size="icon" className="relative">
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-600 rounded-full" />
          </Button>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  )
} 