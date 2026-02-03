"use client"

import React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Globe,
  Smartphone,
  Code2,
  AlertCircle,
  Building2,
  CheckSquare,
  ChevronDown,
  Hash,
  ShieldCheck,
  Bug,
  Link2,
  FileSearch
} from "lucide-react"
import { useState } from "react"

interface NavItem {
  title: string
  href?: string
  icon: React.ReactNode
  children?: { title: string; href: string; icon?: React.ReactNode }[]
}

const navigation: NavItem[] = [
  {
    title: "PAY Flow Overview",
    href: "/",
    icon: <LayoutDashboard className="h-4 w-4" />
  },
  {
    title: "PAY Web Integration",
    href: "/web-integration",
    icon: <Globe className="h-4 w-4" />
  },
  {
    title: "PAY App SDK",
    href: "/app-sdk",
    icon: <Smartphone className="h-4 w-4" />
  },
  {
    title: "Tools",
    icon: <Code2 className="h-4 w-4" />,
    children: [
      { title: "Encode / Decode", href: "/tools/encode-decode", icon: <Hash className="h-4 w-4" /> },
      { title: "Checksum Validator", href: "/tools/checksum", icon: <ShieldCheck className="h-4 w-4" /> },
      { title: "Callback Debugger", href: "/tools/callback", icon: <Bug className="h-4 w-4" /> },
      { title: "IPN URL Checker", href: "/tools/ipn-checker", icon: <Link2 className="h-4 w-4" /> },
      { title: "Query/Refund Checker", href: "/tools/query-refund-checker", icon: <FileSearch className="h-4 w-4" /> }
    ]
  },
  {
    title: "Error Code Center",
    href: "/error-codes",
    icon: <AlertCircle className="h-4 w-4" />
  },
  {
    title: "Bank Support List",
    href: "/banks",
    icon: <Building2 className="h-4 w-4" />
  },
  {
    title: "Integration Checklist",
    href: "/checklist",
    icon: <CheckSquare className="h-4 w-4" />
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(["Tools"])
  const isToolsRoute = pathname.startsWith("/tools")

  const toggleExpand = (title: string) => {
    if (title === "Tools") return
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <span className="font-mono text-sm font-bold text-primary-foreground">VN</span>
            </div>
            <div>
              <span className="font-semibold text-sidebar-foreground">VNPAY</span>
              <span className="ml-1 text-xs text-muted-foreground">DevTools</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.title}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      isActive(item.href)
                        ? "bg-sidebar-accent text-primary font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                ) : item.title === "Tools" ? (
                  <>
                    <div
                      className={cn(
                        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm",
                        isToolsRoute
                          ? "bg-sidebar-accent text-primary font-medium"
                          : "text-sidebar-foreground"
                      )}
                    >
                      {item.icon}
                      {item.title}
                    </div>
                    {item.children && (
                      <ul className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-4">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                                isActive(child.href)
                                  ? "bg-sidebar-accent text-primary font-medium"
                                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                              )}
                            >
                              {child.icon}
                              {child.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => toggleExpand(item.title)}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                        "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <span className="flex items-center gap-3">
                        {item.icon}
                        {item.title}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          expandedItems.includes(item.title) && "rotate-180"
                        )}
                      />
                    </button>
                    {item.children && expandedItems.includes(item.title) && (
                      <ul className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-4">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                                isActive(child.href)
                                  ? "bg-sidebar-accent text-primary font-medium"
                                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                              )}
                            >
                              {child.icon}
                              {child.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <p className="text-xs text-muted-foreground">
            Developer Support Tool
          </p>
          <p className="text-xs text-muted-foreground">
            PAY Integration Only
          </p>
          <p className="text-xs text-muted-foreground">@SangLV</p>
        </div>
      </div>
    </aside>
  )
}
