"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CheckCircle2, XCircle, AlertTriangle, Play, ListChecks } from "lucide-react"

type IpnCase = {
  id: string
  title: string
  expectedCode: string
  expectedMessage: string
  description: string
  params: Record<string, string>
}

type ParsedResponse = {
  rspCode: string
  message: string
  raw: string
  format: string
}

type CaseResult = {
  id: string
  title: string
  expectedCode: string
  expectedMessage: string
  actualCode: string
  actualMessage: string
  status: "pass" | "fail" | "error"
  raw: string
}

const ipnCases: IpnCase[] = [
  {
    id: "success",
    title: "00 - Ghi nhận giao dịch thành công",
    expectedCode: "00",
    expectedMessage: "Confirm Success",
    description: "Đơn hàng hợp lệ, chưa xử lý, checksum đúng.",
    params: { vnp_ResponseCode: "00", vnp_TransactionStatus: "00" }
  },
  {
    id: "order-not-found",
    title: "01 - Không tìm thấy mã đơn hàng",
    expectedCode: "01",
    expectedMessage: "Order not found",
    description: "Gửi vnp_TxnRef không tồn tại trong hệ thống.",
    params: { vnp_TxnRef: "ORDER_NOT_FOUND" }
  },
  {
    id: "already-processed",
    title: "02 - Yêu cầu đã được xử lý trước đó",
    expectedCode: "02",
    expectedMessage: "Order already confirmed",
    description: "Gửi vnp_TxnRef đã xử lý thành công trước đó.",
    params: { vnp_TxnRef: "ORDER_ALREADY_CONFIRMED" }
  },
  {
    id: "ip-not-allowed",
    title: "03 - IP không được phép truy cập",
    expectedCode: "03",
    expectedMessage: "Invalid IP",
    description: "IP gọi IPN không nằm trong whitelist (nếu có).",
    params: { vnp_TxnRef: "ORDER_VALID" }
  },
  {
    id: "invalid-signature",
    title: "97 - Sai chữ ký (checksum không khớp)",
    expectedCode: "97",
    expectedMessage: "Invalid signature",
    description: "Checksum sai hoặc thiếu vnp_SecureHash.",
    params: { vnp_SecureHash: "invalid" }
  },
  {
    id: "system-error",
    title: "99 - Lỗi hệ thống",
    expectedCode: "99",
    expectedMessage: "Unknown error",
    description: "Lỗi xử lý phía merchant hoặc hệ thống.",
    params: { vnp_TxnRef: "ORDER_SYSTEM_ERROR" }
  }
]

const formatDate = () => {
  const d = new Date()
  const pad = (n: number) => n.toString().padStart(2, "0")
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
}

const vnpayEncode = (str: string): string => {
  return encodeURIComponent(str)
    .replace(/!/g, "%21")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/\*/g, "%2A")
}

const vnpayEncodeValue = (key: string, value: string): string => {
  const encoded = vnpayEncode(value)
  return key === "vnp_OrderInfo" ? encoded.replace(/%20/g, "+") : encoded
}

const parseQueryParams = (raw: string): Record<string, string> => {
  const trimmed = raw.trim().replace(/^\?/, "")
  if (!trimmed) return {}
  const params = new URLSearchParams(trimmed)
  const result: Record<string, string> = {}
  params.forEach((value, key) => {
    result[key] = value
  })
  return result
}

const parseResponse = (text: string): ParsedResponse => {
  const trimmed = text.trim()
  if (!trimmed) {
    return { rspCode: "", message: "", raw: text, format: "empty" }
  }

  try {
    const parsed = JSON.parse(trimmed)
    const rspCode = parsed.RspCode || parsed.rspCode || parsed.RSPCODE || ""
    const message = parsed.Message || parsed.RspMsg || parsed.message || ""
    if (rspCode || message) {
      return { rspCode, message, raw: text, format: "json" }
    }
  } catch {
    // fall through
  }

  const queryParams = parseQueryParams(trimmed)
  if (queryParams.RspCode || queryParams.rspCode || queryParams.RSPCODE) {
    return {
      rspCode: queryParams.RspCode || queryParams.rspCode || queryParams.RSPCODE || "",
      message: queryParams.Message || queryParams.RspMsg || queryParams.message || "",
      raw: text,
      format: "querystring"
    }
  }

  const codeMatch = trimmed.match(/RspCode\s*[:=]\s*([0-9]{2})/i)
  const msgMatch = trimmed.match(/(RspMsg|Message)\s*[:=]\s*([^\n]+)/i)
  if (codeMatch || msgMatch) {
    return {
      rspCode: codeMatch?.[1] || "",
      message: msgMatch?.[2]?.trim() || "",
      raw: text,
      format: "text"
    }
  }

  return { rspCode: "", message: "", raw: text, format: "unknown" }
}

export function IpnUrlChecker() {
  const [ipnUrl, setIpnUrl] = useState("")
  const [method, setMethod] = useState<"GET" | "POST">("GET")
  const [tmnCode, setTmnCode] = useState("DEMO")
  const [secretKey, setSecretKey] = useState("")
  const [includeSecureHash, setIncludeSecureHash] = useState(true)
  const [selectedCaseId, setSelectedCaseId] = useState(ipnCases[0].id)
  const [customParams, setCustomParams] = useState("")
  const [expectedCode, setExpectedCode] = useState(ipnCases[0].expectedCode)
  const [expectedMessage, setExpectedMessage] = useState(ipnCases[0].expectedMessage)
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<CaseResult | null>(null)
  const [batchResults, setBatchResults] = useState<CaseResult[]>([])
  const [errorText, setErrorText] = useState("")

  const selectedCase = useMemo(
    () => ipnCases.find(item => item.id === selectedCaseId) || ipnCases[0],
    [selectedCaseId]
  )

  const baseParams = useMemo(() => ({
    vnp_TmnCode: tmnCode || "DEMO",
    vnp_Amount: "100000",
    vnp_Command: "pay",
    vnp_CreateDate: formatDate(),
    vnp_CurrCode: "VND",
    vnp_TxnRef: "ORDER123",
    vnp_OrderInfo: "IPN test",
    vnp_TransactionNo: "123456",
    vnp_ResponseCode: "00",
    vnp_TransactionStatus: "00"
  }), [tmnCode])

  const buildParams = async (caseItem: IpnCase) => {
    const overrideParams = parseQueryParams(customParams)
    const params = {
      ...baseParams,
      ...caseItem.params,
      ...overrideParams
    }

    if (includeSecureHash && secretKey) {
      const sortedParams = Object.keys(params)
        .filter(key => key !== "vnp_SecureHash" && key !== "vnp_SecureHashType")
        .sort()
        .map(key => `${key}=${vnpayEncodeValue(key, params[key])}`)
        .join("&")

      const encoder = new TextEncoder()
      const keyData = encoder.encode(secretKey)
      const data = encoder.encode(sortedParams)
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-512" },
        false,
        ["sign"]
      )
      const signature = await crypto.subtle.sign("HMAC", cryptoKey, data)
      const secureHash = Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("")
      return { ...params, vnp_SecureHash: secureHash }
    }

    return params
  }

  const compareExpected = (expectedRspCode: string, expectedRspMessage: string, parsed: ParsedResponse) => {
    const codeMatch = expectedRspCode ? parsed.rspCode === expectedRspCode : true
    const messageMatch = expectedRspMessage
      ? parsed.message.toLowerCase().includes(expectedRspMessage.toLowerCase())
      : true
    return codeMatch && messageMatch
  }

  const sendRequest = async (caseItem: IpnCase, expectedRspCode: string, expectedRspMessage: string) => {
    if (!ipnUrl) {
      throw new Error("Please enter IPN URL")
    }

    const params = await buildParams(caseItem)
    let responseText = ""

    if (method === "GET") {
      const url = new URL(ipnUrl)
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value)
      })
      const res = await fetch(url.toString(), { method: "GET" })
      responseText = await res.text()
    } else {
      const body = new URLSearchParams(params)
      const res = await fetch(ipnUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body
      })
      responseText = await res.text()
    }

    const parsed = parseResponse(responseText)
    const pass = compareExpected(expectedRspCode, expectedRspMessage, parsed)

    return {
      id: caseItem.id,
      title: caseItem.title,
      expectedCode: expectedRspCode,
      expectedMessage: expectedRspMessage,
      actualCode: parsed.rspCode || "(empty)",
      actualMessage: parsed.message || "(empty)",
      status: pass ? "pass" : "fail",
      raw: parsed.raw
    } satisfies CaseResult
  }

  const handleRunSingle = async () => {
    setIsRunning(true)
    setErrorText("")
    setBatchResults([])
    try {
      const res = await sendRequest(selectedCase, expectedCode, expectedMessage)
      setResult(res)
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : "Failed to call IPN URL")
      setResult(null)
    } finally {
      setIsRunning(false)
    }
  }

  const handleRunAll = async () => {
    setIsRunning(true)
    setErrorText("")
    setResult(null)
    const results: CaseResult[] = []
    try {
      for (const item of ipnCases) {
        const res = await sendRequest(item, item.expectedCode, item.expectedMessage)
        results.push(res)
      }
      setBatchResults(results)
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : "Failed to call IPN URL")
    } finally {
      setIsRunning(false)
    }
  }

  const getStatusBadge = (status: CaseResult["status"]) => {
    if (status === "pass") {
      return (
        <Badge className="bg-primary text-primary-foreground">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          PASS
        </Badge>
      )
    }
    if (status === "fail") {
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          FAIL
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="text-muted-foreground">
        ERROR
      </Badge>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">IPN URL Checker</h1>
        <p className="mt-2 text-muted-foreground">
          Giả lập IPN và kiểm tra RspCode/RspMsg trả về từ hệ thống merchant
        </p>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">IPN Endpoint</CardTitle>
          <CardDescription>Nhập URL IPN của merchant và cấu hình test</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm text-foreground">IPN URL</label>
              <Input
                placeholder="https://merchant.com/ipn"
                value={ipnUrl}
                onChange={(e) => setIpnUrl(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-foreground">Method</label>
              <Select value={method} onValueChange={(v) => setMethod(v as "GET" | "POST")}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm text-foreground">vnp_TmnCode</label>
              <Input
                placeholder="DEMO"
                value={tmnCode}
                onChange={(e) => setTmnCode(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-foreground">Secret Key (optional)</label>
              <Input
                placeholder="Secret key for checksum"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="bg-secondary border-border"
              />
              <div className="text-xs text-muted-foreground">
                Bật checksum: <span className="text-foreground">{includeSecureHash ? "Yes" : "No"}</span>
                <Button
                  variant="link"
                  className="px-2 text-xs"
                  onClick={() => setIncludeSecureHash(!includeSecureHash)}
                >
                  Toggle
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Test Case</CardTitle>
          <CardDescription>Chọn case giả lập để kiểm tra RspCode/RspMsg</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm text-foreground">Case</label>
              <Select
                value={selectedCaseId}
                onValueChange={(v) => {
                  setSelectedCaseId(v)
                  const item = ipnCases.find(c => c.id === v)
                  if (item) {
                    setExpectedCode(item.expectedCode)
                    setExpectedMessage(item.expectedMessage)
                  }
                }}
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ipnCases.map(item => (
                    <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{selectedCase.description}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-foreground">Custom Params (optional)</label>
              <Textarea
                placeholder="vnp_TxnRef=ORDER123&vnp_Amount=1000000"
                value={customParams}
                onChange={(e) => setCustomParams(e.target.value)}
                className="min-h-[90px] bg-secondary border-border font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm text-foreground">Expected RspCode</label>
              <Input
                value={expectedCode}
                onChange={(e) => setExpectedCode(e.target.value)}
                className="bg-secondary border-border font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-foreground">Expected RspMsg / Message</label>
              <Input
                value={expectedMessage}
                onChange={(e) => setExpectedMessage(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleRunSingle} disabled={isRunning}>
              <Play className="h-4 w-4 mr-2" />
              Run Selected
            </Button>
            <Button variant="outline" onClick={handleRunAll} disabled={isRunning}>
              <ListChecks className="h-4 w-4 mr-2" />
              Run All Cases
            </Button>
          </div>
          {errorText && (
            <p className="text-sm text-destructive flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {errorText}
            </p>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              {getStatusBadge(result.status)}
              <span className="text-sm text-muted-foreground">{result.title}</span>
            </div>
            <div className="grid gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Expected:</span>
                <code className="bg-secondary px-2 py-0.5 rounded">{result.expectedCode}</code>
                <span className="text-muted-foreground">/ {result.expectedMessage}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Actual:</span>
                <code className="bg-secondary px-2 py-0.5 rounded">{result.actualCode}</code>
                <span className="text-muted-foreground">/ {result.actualMessage}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Raw response:</span>
                <code className="ml-2 bg-secondary px-2 py-0.5 rounded break-all">{result.raw}</code>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {batchResults.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Batch Results</CardTitle>
            <CardDescription>Kiểm tra tổng hợp các case</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Case</TableHead>
                    <TableHead className="text-muted-foreground">Expected</TableHead>
                    <TableHead className="text-muted-foreground">Actual</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batchResults.map(item => (
                    <TableRow key={item.id} className="border-border">
                      <TableCell className="text-sm text-foreground">{item.title}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.expectedCode} / {item.expectedMessage}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.actualCode} / {item.actualMessage}
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
