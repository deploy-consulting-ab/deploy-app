import { Button } from "@/components/ui/button"
import { Calendar, Home, Users, FileText } from "lucide-react"
import Link from "next/link"

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Calendar, label: "Holidays", href: "/dashboard/holidays" },
  { icon: Users, label: "Team", href: "/dashboard/team" },
  { icon: FileText, label: "Documents", href: "/dashboard/documents" },
]

export function Sidebar() {
  return (
    <div className="fixed top-0 left-0 h-screen w-16 md:w-64 bg-sidebar p-4 flex flex-col">
      <div className="mb-8">
        <h2 className="text-xl font-bold hidden md:block">Company Name</h2>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:text-white hover:bg-slate-800"
                >
                  <item.icon className="h-5 w-5 md:mr-2" />
                  <span className="hidden md:inline">{item.label}</span>
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
} 