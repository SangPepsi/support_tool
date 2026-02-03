"use client"

import React from "react"

import { Sidebar } from "./sidebar"
import { Chatbot } from "./chatbot"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <div className="container max-w-[1400px] w-full py-8 px-8">
          {children}
        </div>
      </main>
      <Chatbot />
    </div>
  )
}
