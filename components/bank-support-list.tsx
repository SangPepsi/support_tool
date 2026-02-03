"use client"

import { useState, useEffect } from "react"
import { Bank } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, CheckCircle2, AlertCircle, XCircle, RefreshCw } from "lucide-react"
import { Button } from "./ui/button"

export function BankSupportList() {
  const [banks, setBanks] = useState<Bank[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const fetchBanks = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock data - in real app this would come from /api/banks
    const { bankList } = await import("@/lib/mock-data")
    setBanks(bankList)
    setLoading(false)
  }

  useEffect(() => {
    fetchBanks()
  }, [])

  const filteredBanks = banks.filter(bank => {
    const matchesSearch = 
      bank.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bank.bankCode.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || bank.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: Bank["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-primary text-primary-foreground">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Active
          </Badge>
        )
      case "maintenance":
        return (
          <Badge className="bg-warning text-warning-foreground">
            <AlertCircle className="h-3 w-3 mr-1" />
            Maintenance
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Inactive
          </Badge>
        )
    }
  }

  const activeCount = banks.filter(b => b.status === "active").length
  const maintenanceCount = banks.filter(b => b.status === "maintenance").length
  const inactiveCount = banks.filter(b => b.status === "inactive").length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Bank Support List</h1>
        <p className="mt-2 text-muted-foreground">
          Banks and payment methods supported by VNPAY PAY
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-primary/50 bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-card-foreground">Active Banks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">{activeCount}</span>
              <span className="text-sm text-muted-foreground">/ {banks.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/50 bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-card-foreground">Under Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-warning">{maintenanceCount}</span>
          </CardContent>
        </Card>
        <Card className="border-destructive/50 bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-card-foreground">Inactive</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-destructive">{inactiveCount}</span>
          </CardContent>
        </Card>
      </div>

      {/* Bank Table */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-card-foreground">Supported Banks</CardTitle>
              <CardDescription>
                Filter by bank name or status
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative w-full sm:w-48">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search banks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-secondary border-border"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px] bg-secondary border-border">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={fetchBanks}
                disabled={loading}
                className="border-border bg-transparent"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading banks...</span>
            </div>
          ) : (
            <div className="rounded-md border border-border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Bank Code</TableHead>
                    <TableHead className="text-muted-foreground">Bank Name</TableHead>
                    <TableHead className="text-muted-foreground">Payment Methods</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBanks.map((bank) => (
                    <TableRow key={bank.bankCode} className="border-border">
                      <TableCell>
                        <code className="font-mono text-sm text-primary bg-secondary px-2 py-1 rounded">
                          {bank.bankCode}
                        </code>
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {bank.bankName}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {bank.supportedMethods.map(method => (
                            <Badge key={method} variant="outline" className="text-xs">
                              {method}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(bank.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {!loading && filteredBanks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No banks found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notes */}
      <Card className="border-primary/50 bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Integration Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              Use <code className="bg-secondary px-1 rounded font-mono">vnp_BankCode</code> to direct users to specific bank
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              Leave bank code empty to show VNPAY bank selection page
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              Banks under maintenance may return error code 75
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              Check bank status before offering specific bank options
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
