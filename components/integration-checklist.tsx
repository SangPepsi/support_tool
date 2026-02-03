"use client"

import { useState, useEffect } from "react"
import { checklistItems } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Globe, Smartphone, CheckCircle2, RotateCcw } from "lucide-react"

export function IntegrationChecklist() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("vnpay-checklist")
    if (saved) {
      setCheckedItems(new Set(JSON.parse(saved)))
    }
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("vnpay-checklist", JSON.stringify([...checkedItems]))
  }, [checkedItems])

  const toggleItem = (id: string) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const resetChecklist = (category: "web" | "app" | "all") => {
    if (category === "all") {
      setCheckedItems(new Set())
    } else {
      setCheckedItems(prev => {
        const newSet = new Set(prev)
        checklistItems
          .filter(item => item.category === category)
          .forEach(item => newSet.delete(item.id))
        return newSet
      })
    }
  }

  const webItems = checklistItems.filter(item => item.category === "web")
  const appItems = checklistItems.filter(item => item.category === "app")

  const webProgress = (webItems.filter(item => checkedItems.has(item.id)).length / webItems.length) * 100
  const appProgress = (appItems.filter(item => checkedItems.has(item.id)).length / appItems.length) * 100
  const totalProgress = (checkedItems.size / checklistItems.length) * 100

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Integration Checklist</h1>
        <p className="mt-2 text-muted-foreground">
          Track your VNPAY PAY integration progress
        </p>
      </div>

      {/* Overall Progress */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-card-foreground">Overall Progress</CardTitle>
              <CardDescription>
                {checkedItems.size} of {checklistItems.length} items completed
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => resetChecklist("all")}
              className="text-muted-foreground"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">{Math.round(totalProgress)}%</span>
            </div>
            <Progress value={totalProgress} className="h-3" />
          </div>
          {totalProgress === 100 && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium text-foreground">Congratulations!</p>
                <p className="text-sm text-muted-foreground">You have completed all checklist items.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs defaultValue="web" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="web" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Globe className="h-4 w-4" />
            Web Integration
          </TabsTrigger>
          <TabsTrigger value="app" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Smartphone className="h-4 w-4" />
            App SDK
          </TabsTrigger>
        </TabsList>

        {/* Web Checklist */}
        <TabsContent value="web" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-card-foreground">PAY Web Checklist</CardTitle>
                  <CardDescription>
                    {webItems.filter(item => checkedItems.has(item.id)).length} of {webItems.length} completed
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => resetChecklist("web")}
                  className="text-muted-foreground"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
              <Progress value={webProgress} className="h-2 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {webItems.map((item, index) => (
                  <ChecklistItemRow
                    key={item.id}
                    item={item}
                    index={index + 1}
                    checked={checkedItems.has(item.id)}
                    onToggle={() => toggleItem(item.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* App Checklist */}
        <TabsContent value="app" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-card-foreground">PAY App SDK Checklist</CardTitle>
                  <CardDescription>
                    {appItems.filter(item => checkedItems.has(item.id)).length} of {appItems.length} completed
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => resetChecklist("app")}
                  className="text-muted-foreground"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
              <Progress value={appProgress} className="h-2 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appItems.map((item, index) => (
                  <ChecklistItemRow
                    key={item.id}
                    item={item}
                    index={index + 1}
                    checked={checkedItems.has(item.id)}
                    onToggle={() => toggleItem(item.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Tips */}
      <Card className="border-primary/50 bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Integration Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              Complete all items before going to production
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              Test thoroughly in sandbox environment first
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              Document any custom implementations
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              Your progress is saved in your browser
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

function ChecklistItemRow({ 
  item, 
  index, 
  checked, 
  onToggle 
}: { 
  item: { id: string; title: string; description: string }
  index: number
  checked: boolean
  onToggle: () => void 
}) {
  return (
    <div 
      className={`flex items-start gap-4 p-4 rounded-lg border transition-colors cursor-pointer ${
        checked 
          ? "bg-primary/5 border-primary/30" 
          : "bg-secondary border-border hover:border-primary/30"
      }`}
      onClick={onToggle}
    >
      <div className="flex items-center gap-3">
        <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
          checked ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        }`}>
          {checked ? <CheckCircle2 className="h-4 w-4" /> : index}
        </span>
        <Checkbox 
          checked={checked}
          onCheckedChange={onToggle}
          onClick={(e) => e.stopPropagation()}
          className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-medium ${checked ? "text-primary line-through" : "text-foreground"}`}>
          {item.title}
        </p>
        <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
      </div>
    </div>
  )
}
