"use client"

import { useState } from "react"
import { customerSupportIssues, errorCodes, knowledgeBaseItems, transactionStatusCodes } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
import { Search, CheckCircle2, XCircle, AlertCircle, Copy, Download } from "lucide-react"

export function ErrorCodeCenter() {
  const [searchQuery, setSearchQuery] = useState("")
  const [apiFilter, setApiFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<"all" | "success" | "pending" | "cancelled" | "error">("all")
  const [exportMessage, setExportMessage] = useState("")
  const [kbQuery, setKbQuery] = useState("")
  const [kbTagFilter, setKbTagFilter] = useState<string>("all")

  const apis = [...new Set(errorCodes.map(e => e.api))]
  const kbTags = [...new Set(knowledgeBaseItems.flatMap(item => item.tags))].sort()

  const filteredCodes = errorCodes.filter(error => {
    const matchesSearch = 
      error.code.includes(searchQuery) ||
      error.api.toLowerCase().includes(searchQuery.toLowerCase()) ||
      error.rootCause.toLowerCase().includes(searchQuery.toLowerCase()) ||
      error.merchantAction.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesApi = apiFilter === "all" || error.api === apiFilter

    const status =
      error.code === "00"
        ? "success"
        : error.code === "07"
          ? "pending"
          : error.code === "24"
            ? "cancelled"
            : "error"

    const matchesStatus = statusFilter === "all" || statusFilter === status

    return matchesSearch && matchesApi && matchesStatus
  })

  const filteredKb = knowledgeBaseItems.filter(item => {
    const query = kbQuery.toLowerCase()
    const matchesQuery =
      item.title.toLowerCase().includes(query) ||
      item.symptom.toLowerCase().includes(query) ||
      item.cause.toLowerCase().includes(query) ||
      item.resolution.toLowerCase().includes(query) ||
      item.tags.some(tag => tag.toLowerCase().includes(query)) ||
      (item.relatedCodes || []).some(code => code.includes(kbQuery)) ||
      (item.relatedParams || []).some(param => param.toLowerCase().includes(query))

    const matchesTag = kbTagFilter === "all" || item.tags.includes(kbTagFilter)

    return matchesQuery && matchesTag
  })

  const toCsvValue = (value: string) => {
    const escaped = value.replace(/"/g, '""')
    return `"${escaped}"`
  }

  const buildExportRows = () => {
    return filteredCodes.map(item => ({
      code: item.code,
      api: item.api,
      rootCause: item.rootCause,
      merchantAction: item.merchantAction
    }))
  }

  const handleCopy = async () => {
    const rows = buildExportRows()
    const text = [
      "code\tapi\trootCause\tmerchantAction",
      ...rows.map(r => `${r.code}\t${r.api}\t${r.rootCause}\t${r.merchantAction}`)
    ].join("\n")
    await navigator.clipboard.writeText(text)
    setExportMessage("Copied to clipboard")
    setTimeout(() => setExportMessage(""), 2000)
  }

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleExportJson = () => {
    const rows = buildExportRows()
    downloadFile(JSON.stringify(rows, null, 2), "vnpay-error-codes.json", "application/json")
  }

  const handleExportCsv = () => {
    const rows = buildExportRows()
    const header = ["code", "api", "rootCause", "merchantAction"].join(",")
    const body = rows
      .map(r => [r.code, r.api, r.rootCause, r.merchantAction].map(toCsvValue).join(","))
      .join("\n")
    downloadFile([header, body].join("\n"), "vnpay-error-codes.csv", "text/csv")
  }

  const getStatusBadge = (code: string) => {
    if (code === "00") {
      return (
        <Badge className="bg-primary text-primary-foreground">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Success
        </Badge>
      )
    } else if (code === "07") {
      return (
        <Badge className="bg-warning text-warning-foreground">
          <AlertCircle className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      )
    } else if (code === "24") {
      return (
        <Badge variant="outline" className="text-muted-foreground">
          <XCircle className="h-3 w-3 mr-1" />
          Cancelled
        </Badge>
      )
    } else {
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Error
        </Badge>
      )
    }
  }

  const getApiBadge = (api: string) => {
    const colors: Record<string, string> = {
      "IPN Result (vnp_ResponseCode)": "bg-warning/20 text-warning border-warning/30",
      "IPN Acknowledge (Merchant → VNPAY)": "bg-secondary text-foreground border-border",
      "Query (vnp_Command=querydr)": "bg-secondary text-foreground border-border",
      "Refund (vnp_Command=refund)": "bg-secondary text-foreground border-border",
      "Refund Batch ResponseCode (vnp_Command=refundbatch)": "bg-secondary text-foreground border-border",
      "Refund Batch DataResponseCode (vnp_Command=refundbatch)": "bg-secondary text-foreground border-border",
      "API Response (vnp_ResponseCode / vnp_DataResponseCode)": "bg-primary/20 text-primary border-primary/30"
    }
    return (
      <Badge variant="outline" className={colors[api] || ""}>
        {api}
      </Badge>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Error Code Center</h1>
        <p className="mt-2 text-muted-foreground">
          Complete reference of VNPAY PAY response codes and recommended actions
        </p>
      </div>

      {/* Quick Reference */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-primary/50 bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-card-foreground">Success</CardTitle>
          </CardHeader>
          <CardContent>
            <code className="text-2xl font-mono font-bold text-primary">00</code>
            <p className="text-xs text-muted-foreground mt-1">Transaction completed</p>
          </CardContent>
        </Card>
        <Card className="border-warning/50 bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-card-foreground">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <code className="text-2xl font-mono font-bold text-warning">07</code>
            <p className="text-xs text-muted-foreground mt-1">Awaiting confirmation</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-card-foreground">User Cancelled</CardTitle>
          </CardHeader>
          <CardContent>
            <code className="text-2xl font-mono font-bold text-foreground">24</code>
            <p className="text-xs text-muted-foreground mt-1">Customer initiated cancel</p>
          </CardContent>
        </Card>
        <Card className="border-destructive/50 bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-card-foreground">Unknown Error</CardTitle>
          </CardHeader>
          <CardContent>
            <code className="text-2xl font-mono font-bold text-destructive">99</code>
            <p className="text-xs text-muted-foreground mt-1">Contact VNPAY support</p>
          </CardContent>
        </Card>
      </div>

      {/* Error Code Table */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-card-foreground">All Error Codes</CardTitle>
              <CardDescription>
                Search and filter PAY response codes
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative w-full sm:w-48">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search codes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-secondary border-border"
                />
              </div>
              <Select value={apiFilter} onValueChange={setApiFilter}>
                <SelectTrigger className="w-[220px] bg-secondary border-border">
                  <SelectValue placeholder="API / Context" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All APIs</SelectItem>
                  {apis.map(api => (
                    <SelectItem key={api} value={api}>{api}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
                <SelectTrigger className="w-[160px] bg-secondary border-border">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="h-3.5 w-3.5 mr-1.5" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportJson}>
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  JSON
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportCsv}>
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  CSV
                </Button>
              </div>
            </div>
            {exportMessage && (
              <p className="text-xs text-muted-foreground mt-2">{exportMessage}</p>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground w-[100px]">Code</TableHead>
                  <TableHead className="text-muted-foreground w-[100px]">Status</TableHead>
                  <TableHead className="text-muted-foreground">API / Context</TableHead>
                  <TableHead className="text-muted-foreground">Root Cause</TableHead>
                  <TableHead className="text-muted-foreground">Merchant Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCodes.map((error) => (
                  <TableRow key={error.id} className="border-border">
                    <TableCell>
                      <code className="font-mono text-lg font-bold text-foreground">{error.code}</code>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(error.code)}
                    </TableCell>
                    <TableCell>
                      {getApiBadge(error.api)}
                    </TableCell>
                    <TableCell className="text-sm text-foreground">
                      {error.rootCause}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs">
                      {error.merchantAction}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredCodes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No error codes found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Status Codes */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Transaction Status Codes</CardTitle>
          <CardDescription>
            vnp_TransactionStatus reference codes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground w-[100px]">Code</TableHead>
                  <TableHead className="text-muted-foreground">Description</TableHead>
                  <TableHead className="text-muted-foreground">Merchant Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactionStatusCodes.map((status) => (
                  <TableRow key={status.code} className="border-border">
                    <TableCell>
                      <code className="font-mono text-lg font-bold text-foreground">{status.code}</code>
                    </TableCell>
                    <TableCell className="text-sm text-foreground">
                      {status.description}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs">
                      {status.merchantAction}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Base */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-card-foreground">Internal Knowledge Base</CardTitle>
              <CardDescription>
                Common issues, root causes, and resolutions
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search KB..."
                  value={kbQuery}
                  onChange={(e) => setKbQuery(e.target.value)}
                  className="pl-9 bg-secondary border-border"
                />
              </div>
              <Select value={kbTagFilter} onValueChange={setKbTagFilter}>
                <SelectTrigger className="w-[180px] bg-secondary border-border">
                  <SelectValue placeholder="Tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {kbTags.map(tag => (
                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {filteredKb.map(item => (
              <Card key={item.id} className="border-border bg-secondary/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-card-foreground">{item.title}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-muted-foreground">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="text-muted-foreground"><span className="text-foreground font-medium">Symptom:</span> {item.symptom}</p>
                  <p className="text-muted-foreground"><span className="text-foreground font-medium">Cause:</span> {item.cause}</p>
                  <p className="text-muted-foreground"><span className="text-foreground font-medium">Resolution:</span> {item.resolution}</p>
                  {(item.relatedCodes || item.relatedParams) && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {(item.relatedCodes || []).map(code => (
                        <Badge key={`code-${code}`} className="bg-primary/10 text-primary">
                          Code {code}
                        </Badge>
                      ))}
                      {(item.relatedParams || []).map(param => (
                        <Badge key={`param-${param}`} variant="outline" className="text-muted-foreground">
                          {param}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredKb.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No knowledge base items found
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Support Issues */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">CSKH VNPAY - Lỗi thường gặp</CardTitle>
          <CardDescription>
            Tổng hợp các vấn đề CSKH hay tiếp nhận từ khách hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {customerSupportIssues.map(issue => (
              <Card key={issue.id} className="border-border bg-secondary/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-card-foreground">{issue.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="text-muted-foreground"><span className="text-foreground font-medium">Biểu hiện:</span> {issue.symptom}</p>
                  <div className="text-muted-foreground">
                    <span className="text-foreground font-medium">Cần kiểm tra:</span>
                    <ul className="mt-1 list-disc list-inside space-y-1">
                      {issue.checks.map((check, idx) => (
                        <li key={`${issue.id}-check-${idx}`}>{check}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-muted-foreground">
                    <span className="text-foreground font-medium">Hướng xử lý:</span>
                    <ul className="mt-1 list-disc list-inside space-y-1">
                      {issue.actions.map((action, idx) => (
                        <li key={`${issue.id}-action-${idx}`}>{action}</li>
                      ))}
                    </ul>
                  </div>
                  {(issue.relatedCodes || []).length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {issue.relatedCodes?.map(code => (
                        <Badge key={`${issue.id}-code-${code}`} className="bg-primary/10 text-primary">
                          Code {code}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="border-primary/50 bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Handling Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              Always log the full response for debugging
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              Don&apos;t expose raw error codes to end users
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              Implement retry logic for temporary failures
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              Monitor error rates for anomaly detection
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
