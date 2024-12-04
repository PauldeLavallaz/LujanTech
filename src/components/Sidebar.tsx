import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { 
  LayoutGrid, 
  Settings, 
  Database, 
  KeyRound,
  BarChart,
  Workflow,
  Sparkles,
  CreditCard
} from "lucide-react";

const sidebarItems = [
  {
    title: "APLICACIÓN",
    items: [
      { name: "Flujos", icon: <Workflow className="w-4 h-4" />, href: "/" },
      { name: "Generador Básico", icon: <Sparkles className="w-4 h-4" />, href: "/generator/basic" },
      { name: "Franatics", icon: <CreditCard className="w-4 h-4" />, href: "/generator/franatics" },
    ]
  },
  {
    title: "CUENTA",
    items: [
      { name: "Configuración", icon: <Settings className="w-4 h-4" />, href: "/settings" },
      { name: "API Keys", icon: <KeyRound className="w-4 h-4" />, href: "/api-keys" },
      { name: "Uso", icon: <Database className="w-4 h-4" />, href: "/usage" },
    ]
  }
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r fixed h-screen flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b">
        <Link href="/" className="text-xl font-bold">
          Morfeo Dreams Lab
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-8">
        {sidebarItems.map((section) => (
          <div key={section.title}>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {section.title}
            </h2>
            <ul className="space-y-2">
              {section.items.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded-md p-2 transition-colors"
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User - Fixed at bottom */}
      <div className="p-4 border-t mt-auto">
        <UserButton afterSignOutUrl="/" />
      </div>
    </aside>
  );
} 