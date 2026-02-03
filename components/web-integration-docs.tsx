"use client"

import React from "react"

import { payParameters, platformPartners } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { Search, CheckCircle2, XCircle, AlertTriangle } from "lucide-react"

export function WebIntegrationDocs() {
  const [searchQuery, setSearchQuery] = useState("")
  const [requiredFilter, setRequiredFilter] = useState<"all" | "required" | "optional">("all")
  const [encodeFilter, setEncodeFilter] = useState<"all" | "encode" | "no-encode">("all")
  const [platformQuery, setPlatformQuery] = useState("")

  const filteredParams = payParameters.filter(
    param =>
      (param.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        param.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (requiredFilter === "all" ||
        (requiredFilter === "required" && param.required) ||
        (requiredFilter === "optional" && !param.required)) &&
      (encodeFilter === "all" ||
        (encodeFilter === "encode" && param.encodeRequired) ||
        (encodeFilter === "no-encode" && !param.encodeRequired))
  )

  const filteredPlatforms = platformPartners.filter(item => {
    const query = platformQuery.toLowerCase()
    return (
      item.module.toLowerCase().includes(query) ||
      (item.note || "").toLowerCase().includes(query)
    )
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">PAY Web Integration</h1>
        <p className="mt-2 text-muted-foreground">
          Complete parameter reference for VNPAY PAY web payment integration
        </p>
      </div>

      {/* Quick Reference */}
      <div className="grid gap-4 grid-cols-[1.5fr_1fr_1fr]">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-card-foreground">API Endpoint</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <code className="block text-xs font-mono text-primary bg-secondary px-2 py-1 rounded break-all">
                https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
              </code>
              <code className="block text-xs font-mono text-primary bg-secondary px-2 py-1 rounded break-all">
                https://pay.vnpay.vn/vpcpay.html
              </code>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-card-foreground">Hash Algorithm</CardTitle>
          </CardHeader>
          <CardContent>
            <code className="text-xs font-mono text-primary bg-secondary px-2 py-1 rounded">
              HMAC SHA512
            </code>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-card-foreground">Encoding</CardTitle>
          </CardHeader>
          <CardContent>
            <code className="text-xs font-mono text-primary bg-secondary px-2 py-1 rounded">
              UTF-8 / RFC 3986
            </code>
          </CardContent>
        </Card>
      </div>

      {/* Parameter Table */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-card-foreground">Parameter Dictionary</CardTitle>
              <CardDescription>
                All parameters required for PAY payment request
              </CardDescription>
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search parameters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-secondary border-border"
                />
              </div>
              <Select value={requiredFilter} onValueChange={(v) => setRequiredFilter(v as typeof requiredFilter)}>
                <SelectTrigger className="w-full sm:w-[170px] bg-secondary border-border">
                  <SelectValue placeholder="Required" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Required</SelectItem>
                  <SelectItem value="required">Required only</SelectItem>
                  <SelectItem value="optional">Optional only</SelectItem>
                </SelectContent>
              </Select>
              <Select value={encodeFilter} onValueChange={(v) => setEncodeFilter(v as typeof encodeFilter)}>
                <SelectTrigger className="w-full sm:w-[170px] bg-secondary border-border">
                  <SelectValue placeholder="Encode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Encoding</SelectItem>
                  <SelectItem value="encode">Encode only</SelectItem>
                  <SelectItem value="no-encode">No encode</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border overflow-auto max-h-[640px]">
            <Table className="w-full table-fixed">
              <TableHeader className="sticky top-0 z-10 bg-card">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground w-[220px]">Parameter</TableHead>
                  <TableHead className="text-muted-foreground text-center w-[120px]">Required</TableHead>
                  <TableHead className="text-muted-foreground text-center w-[120px]">Encode</TableHead>
                  <TableHead className="text-muted-foreground w-[320px]">Description</TableHead>
                  <TableHead className="text-muted-foreground w-[320px]">Common Mistakes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParams.map((param) => (
                  <TableRow key={param.name} className="border-border odd:bg-secondary/40">
                    <TableCell>
                      <code className="font-mono text-sm text-primary">{param.name}</code>
                      {param.example && (
                        <p className="text-xs text-muted-foreground mt-1 break-words">
                          e.g.{" "}
                          <code className="bg-secondary px-1 rounded break-all">{param.example}</code>
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {param.required ? (
                        <Badge className="bg-primary text-primary-foreground">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Yes
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          <XCircle className="h-3 w-3 mr-1" />
                          No
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {param.encodeRequired ? (
                        <Badge className="bg-warning text-warning-foreground">
                          Yes
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          No
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-foreground whitespace-normal break-words align-top">
                      {param.description}
                    </TableCell>
                    <TableCell className="text-sm whitespace-normal break-words align-top">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{param.commonMistakes}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Go-live Platform Partners */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-card-foreground">Go-live Platform Partners</CardTitle>
              <CardDescription>
                Các đơn vị nền tảng đã hoàn thành kết nối và có thể go-live ngay
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search platform..."
                value={platformQuery}
                onChange={(e) => setPlatformQuery(e.target.value)}
                className="pl-9 bg-secondary border-border"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border overflow-auto max-h-[420px]">
            <Table className="w-full table-fixed">
              <TableHeader className="sticky top-0 z-10 bg-card">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground w-[280px]">Module kết nối</TableHead>
                  <TableHead className="text-muted-foreground w-[200px]">Note</TableHead>
                  <TableHead className="text-muted-foreground w-[120px] text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlatforms.map((item) => (
                  <TableRow key={`${item.module}-${item.note || "none"}`} className="border-border odd:bg-secondary/40">
                    <TableCell className="text-sm text-foreground break-words">
                      {item.module}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground break-words">
                      {item.note || "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-primary text-primary-foreground">Go-live</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredPlatforms.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              No platforms found
            </div>
          )}
        </CardContent>
      </Card>

      {/* URL Building Guide */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Building the Payment URL</CardTitle>
          <CardDescription>Step-by-step guide to constructing a valid payment request</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Step number={1} title="Prepare Parameters">
              <p>Collect all required parameters for the payment request. Ensure vnp_Amount is multiplied by 100.</p>
            </Step>
            <Step number={2} title="Sort Parameters">
              <p>Sort all parameters alphabetically by parameter name (key). This is crucial for checksum generation.</p>
            </Step>
            <Step number={3} title="Build Query String">
              <p>Create a query string with sorted parameters. URL encode values that require encoding (UTF-8, RFC 3986).</p>
              <code className="block mt-2 p-3 bg-secondary rounded-md text-xs font-mono overflow-x-auto">
                vnp_Amount=1000000&vnp_Command=pay&vnp_CreateDate=20240115153000&...
              </code>
            </Step>
            <Step number={4} title="Generate Checksum">
              <p>Create HMAC SHA512 hash of the query string using your secret key. Do NOT include vnp_SecureHash or vnp_SecureHashType in the hash input.</p>
              <code className="block mt-2 p-3 bg-secondary rounded-md text-xs font-mono overflow-x-auto">
                {`const hmac = crypto.createHmac('sha512', secretKey);\nhmac.update(queryString);\nconst checksum = hmac.digest('hex');`}
              </code>
            </Step>
            <Step number={5} title="Append Checksum">
              <p>Add vnp_SecureHash to the query string. Do NOT URL encode the checksum value.</p>
              <code className="block mt-2 p-3 bg-secondary rounded-md text-xs font-mono overflow-x-auto">
                ...&vnp_SecureHash=abc123def456...
              </code>
            </Step>
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="border-primary/50 bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Important Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              <span>Do NOT encode <code className="bg-secondary px-1 rounded font-mono">vnp_SecureHash</code> or <code className="bg-secondary px-1 rounded font-mono">vnp_SecureHashType</code></span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              <span>Parameter names are case-sensitive</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              <span>Empty parameters should be excluded from the request</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              <span>Use sandbox environment for testing: <code className="bg-secondary px-1 rounded font-mono">sandbox.vnpayment.vn</code></span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              <span>Production environment: <code className="bg-secondary px-1 rounded font-mono">pay.vnpay.vn</code></span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
        {number}
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-foreground">{title}</h4>
        <div className="mt-1 text-sm text-muted-foreground">{children}</div>
      </div>
    </div>
  )
}
