"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CheckCircle2, XCircle, AlertTriangle, Link as LinkIcon } from "lucide-react"
import { errorCodes, transactionStatusCodes } from "@/lib/mock-data"

type ParsedResponse = {
  responseCode: string
  message: string
  transactionStatus: string
  raw: string
  format: string
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
    return { responseCode: "", message: "", transactionStatus: "", raw: text, format: "empty" }
  }

  try {
    const parsed = JSON.parse(trimmed)
    const responseCode = parsed.vnp_ResponseCode || parsed.responseCode || parsed.ResponseCode || ""
    const message = parsed.vnp_Message || parsed.message || parsed.Message || ""
    const transactionStatus = parsed.vnp_TransactionStatus || ""
    if (responseCode || message) {
      return { responseCode, message, transactionStatus, raw: text, format: "json" }
    }
  } catch {
    // fall through
  }

  const queryParams = parseQueryParams(trimmed)
  if (queryParams.vnp_ResponseCode || queryParams.ResponseCode || queryParams.responseCode) {
    return {
      responseCode: queryParams.vnp_ResponseCode || queryParams.ResponseCode || queryParams.responseCode || "",
      message: queryParams.vnp_Message || queryParams.Message || queryParams.message || "",
      transactionStatus: queryParams.vnp_TransactionStatus || "",
      raw: text,
      format: "querystring"
    }
  }

  const codeMatch = trimmed.match(/vnp_ResponseCode\s*[:=]\s*([0-9]{2})/i)
  const msgMatch = trimmed.match(/(vnp_Message|Message)\s*[:=]\s*([^\n]+)/i)
  const statusMatch = trimmed.match(/vnp_TransactionStatus\s*[:=]\s*([0-9]{2})/i)
  if (codeMatch || msgMatch) {
    return {
      responseCode: codeMatch?.[1] || "",
      message: msgMatch?.[2]?.trim() || "",
      transactionStatus: statusMatch?.[1] || "",
      raw: text,
      format: "text"
    }
  }

  return { responseCode: "", message: "", transactionStatus: "", raw: text, format: "unknown" }
}

const buildHashData = (apiType: "querydr" | "refund", values: Record<string, string>) => {
  if (apiType === "querydr") {
    const parts = [
      values.vnp_RequestId,
      values.vnp_Version,
      values.vnp_Command,
      values.vnp_TmnCode,
      values.vnp_TxnRef,
      values.vnp_TransactionDate,
      values.vnp_CreateDate,
      values.vnp_IpAddr,
      values.vnp_OrderInfo
    ]
    return parts.join("|")
  }

  const parts = [
    values.vnp_RequestId,
    values.vnp_Version,
    values.vnp_Command,
    values.vnp_TmnCode,
    values.vnp_TransactionType,
    values.vnp_TxnRef,
    values.vnp_Amount,
    values.vnp_TransactionNo,
    values.vnp_TransactionDate,
    values.vnp_CreateBy,
    values.vnp_CreateDate,
    values.vnp_IpAddr,
    values.vnp_OrderInfo
  ]
  return parts.join("|")
}

export function QueryRefundChecker() {
  const [apiType, setApiType] = useState<"querydr" | "refund">("querydr")
  const [responseInput, setResponseInput] = useState("")
  const [secretKey, setSecretKey] = useState("")
  const [hashData, setHashData] = useState("")
  const [checksum, setChecksum] = useState("")
  const [copyMessage, setCopyMessage] = useState("")
  const [hashDataInput, setHashDataInput] = useState("")
  const [hashValidationMessage, setHashValidationMessage] = useState("")
  const [hashValidationStatus, setHashValidationStatus] = useState<"pass" | "fail" | "warn" | "">("")
  const [hashValues, setHashValues] = useState<Record<string, string>>({
    vnp_RequestId: "",
    vnp_Version: "2.1.0",
    vnp_Command: "querydr",
    vnp_TmnCode: "",
    vnp_TxnRef: "",
    vnp_TransactionDate: "",
    vnp_CreateDate: "",
    vnp_IpAddr: "",
    vnp_OrderInfo: "",
    vnp_TransactionType: "",
    vnp_Amount: "",
    vnp_TransactionNo: "",
    vnp_CreateBy: ""
  })

  const parsed = useMemo(() => parseResponse(responseInput), [responseInput])

  const availableCodes = useMemo(() => {
    const apiLabel = apiType === "querydr" ? "Query (vnp_Command=querydr)" : "Refund (vnp_Command=refund)"
    return errorCodes.filter(item => item.api === apiLabel)
  }, [apiType])

  const matchedCode = useMemo(() => {
    return availableCodes.find(item => item.code === parsed.responseCode)
  }, [availableCodes, parsed.responseCode])

  const transactionStatusInfo = useMemo(() => {
    return transactionStatusCodes.find(item => item.code === parsed.transactionStatus)
  }, [parsed.transactionStatus])

  const hints = useMemo(() => {
    const common = {
      "02": ["Kiểm tra vnp_TmnCode (đúng môi trường sandbox/prod)."],
      "03": ["Kiểm tra định dạng dữ liệu gửi (type, length, field bắt buộc)."],
      "91": ["Kiểm tra vnp_TxnRef hoặc vnp_TransactionNo có tồn tại."],
      "94": ["Yêu cầu bị trùng trong khoảng thời gian hạn chế. Chờ và thử lại."],
      "97": [
        "Kiểm tra secret key và chuỗi ký.",
        "Đảm bảo đúng thứ tự và đúng quy tắc ký (theo tài liệu)."
      ],
      "99": ["Ghi log chi tiết request/response và liên hệ VNPAY nếu cần."]
    }

    const refundOnly = {
      "95": ["Giao dịch không thành công bên VNPAY. Kiểm tra trạng thái giao dịch gốc."]
    }

    if (!parsed.responseCode) return []
    if (apiType === "refund" && refundOnly[parsed.responseCode]) {
      return [...(common[parsed.responseCode] || []), ...refundOnly[parsed.responseCode]]
    }
    return common[parsed.responseCode] || []
  }, [apiType, parsed.responseCode])

  const hashFields = useMemo(() => {
    if (apiType === "querydr") {
      return [
        "vnp_RequestId",
        "vnp_Version",
        "vnp_Command",
        "vnp_TmnCode",
        "vnp_TxnRef",
        "vnp_TransactionDate",
        "vnp_CreateDate",
        "vnp_IpAddr",
        "vnp_OrderInfo"
      ]
    }
    return [
      "vnp_RequestId",
      "vnp_Version",
      "vnp_Command",
      "vnp_TmnCode",
      "vnp_TransactionType",
      "vnp_TxnRef",
      "vnp_Amount",
      "vnp_TransactionNo",
      "vnp_TransactionDate",
      "vnp_CreateBy",
      "vnp_CreateDate",
      "vnp_IpAddr",
      "vnp_OrderInfo"
    ]
  }, [apiType])

  const updateHashField = (key: string, value: string) => {
    setHashValues(prev => ({
      ...prev,
      [key]: value,
      vnp_Command: apiType
    }))
  }

  const handleBuildHash = () => {
    const data = buildHashData(apiType, { ...hashValues, vnp_Command: apiType })
    setHashData(data)
    setChecksum("")
    setCopyMessage("")
    setHashValidationMessage("")
    setHashValidationStatus("")
  }

  const handleGenerateChecksum = async () => {
    if (!secretKey) {
      setCopyMessage("Missing secret key")
      return
    }
    const data = buildHashData(apiType, { ...hashValues, vnp_Command: apiType })
    setHashData(data)
    const encoder = new TextEncoder()
    const keyData = encoder.encode(secretKey)
    const msgData = encoder.encode(data)
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-512" },
      false,
      ["sign"]
    )
    const signature = await crypto.subtle.sign("HMAC", cryptoKey, msgData)
    const hash = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("")
    setChecksum(hash)
    setCopyMessage("")
  }

  const handleCopy = async (text: string, message: string) => {
    await navigator.clipboard.writeText(text)
    setCopyMessage(message)
    setTimeout(() => setCopyMessage(""), 2000)
  }

  const handleValidateHashData = () => {
    const input = hashDataInput.trim()
    const correct = buildHashData(apiType, { ...hashValues, vnp_Command: apiType })
    setHashData(correct)
    setChecksum("")
    setCopyMessage("")

    if (!input) {
      setHashValidationStatus("warn")
      setHashValidationMessage("HashData đang trống.")
      return
    }

    if (input === correct) {
      setHashValidationStatus("pass")
      setHashValidationMessage("HashData hợp lệ và đúng format.")
      return
    }

    const inputParts = input.split("|")
    const correctParts = correct.split("|")
    if (inputParts.length !== correctParts.length) {
      setHashValidationStatus("fail")
      setHashValidationMessage(`Sai số lượng field. Expected ${correctParts.length}, got ${inputParts.length}.`)
      return
    }

    const mismatchIndex = inputParts.findIndex((part, idx) => part !== correctParts[idx])
    if (mismatchIndex >= 0) {
      const fieldName = hashFields[mismatchIndex] || `field ${mismatchIndex + 1}`
      setHashValidationStatus("fail")
      setHashValidationMessage(`Sai giá trị tại ${fieldName}.`)
      return
    }

    setHashValidationStatus("fail")
    setHashValidationMessage("HashData không đúng theo format chuẩn.")
  }

  const statusBadge = parsed.responseCode === "00"
    ? (
      <Badge className="bg-primary text-primary-foreground">
        <CheckCircle2 className="h-3 w-3 mr-1" />
        Success
      </Badge>
    )
    : parsed.responseCode
      ? (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Error
        </Badge>
      )
      : (
        <Badge variant="outline" className="text-muted-foreground">
          Unknown
        </Badge>
      )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Query / Refund Error Checker</h1>
        <p className="mt-2 text-muted-foreground">
          Kiểm tra vnp_ResponseCode và vnp_Message cho API querydr/refund
        </p>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">API Reference</CardTitle>
          <CardDescription>VNPAY Query / Refund API documentation</CardDescription>
        </CardHeader>
        <CardContent>
          <a
            href="https://sandbox.vnpayment.vn/apis/docs/truy-van-hoan-tien/querydr&refund.html"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-mono text-primary bg-secondary px-2 py-2 rounded break-all hover:underline"
          >
            <LinkIcon className="h-3 w-3" />
            https://sandbox.vnpayment.vn/apis/docs/truy-van-hoan-tien/querydr&refund.html
          </a>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Select API</CardTitle>
          <CardDescription>Chọn API để đối chiếu bảng mã lỗi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-xs">
            <Select value={apiType} onValueChange={(v) => setApiType(v as "querydr" | "refund")}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="querydr">querydr</SelectItem>
                <SelectItem value="refund">refund</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-foreground">VNPAY Response (JSON hoặc query string)</label>
            <Textarea
              placeholder='{"vnp_ResponseCode":"00","vnp_Message":"Success","vnp_TransactionStatus":"00"}'
              value={responseInput}
              onChange={(e) => setResponseInput(e.target.value)}
              className="min-h-[140px] bg-secondary border-border font-mono text-xs"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setResponseInput('{"vnp_ResponseCode":"00","vnp_Message":"Success","vnp_TransactionStatus":"00"}')
              }
            >
              Example Success
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setResponseInput('{"vnp_ResponseCode":"02","vnp_Message":"Invalid TmnCode"}')
              }
            >
              Example 02
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setResponseInput('{"vnp_ResponseCode":"97","vnp_Message":"Invalid signature"}')
              }
            >
              Example 97
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">HashData & Checksum</CardTitle>
          <CardDescription>
            Tạo chuỗi hashData và checksum cho {apiType}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Nhập hashData để kiểm tra</label>
            <div className="flex gap-2">
              <Textarea
                value={hashDataInput}
                onChange={(e) => setHashDataInput(e.target.value)}
                className="min-h-[80px] bg-secondary border-border font-mono text-xs"
                placeholder="vnp_RequestId|vnp_Version|vnp_Command|..."
              />
              <Button variant="outline" onClick={handleValidateHashData}>
                Check
              </Button>
            </div>
            {hashValidationMessage && (
              <div className="flex items-center gap-2 text-sm">
                {hashValidationStatus === "pass" ? (
                  <Badge className="bg-primary text-primary-foreground">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    PASS
                  </Badge>
                ) : hashValidationStatus === "fail" ? (
                  <Badge variant="destructive">
                    <XCircle className="h-3 w-3 mr-1" />
                    FAIL
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    WARN
                  </Badge>
                )}
                <span className="text-muted-foreground">{hashValidationMessage}</span>
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {hashFields.map(field => (
              <div key={field} className="space-y-1">
                <label className="text-xs text-muted-foreground">{field}</label>
                <Input
                  value={hashValues[field] || ""}
                  onChange={(e) => updateHashField(field, e.target.value)}
                  className="bg-secondary border-border font-mono"
                />
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Secret Key</label>
              <Input
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="bg-secondary border-border font-mono"
                placeholder="Enter secret key"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button variant="outline" onClick={handleBuildHash}>
                Build HashData
              </Button>
              <Button onClick={handleGenerateChecksum}>
                Generate Checksum
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">hashData</label>
            <div className="flex gap-2">
              <Textarea
                value={hashData}
                readOnly
                className="min-h-[80px] bg-secondary border-border font-mono text-xs"
              />
              <Button
                variant="outline"
                onClick={() => handleCopy(hashData, "HashData copied")}
                disabled={!hashData}
              >
                Copy
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Checksum (HMAC SHA512)</label>
            <div className="flex gap-2">
              <Input
                value={checksum}
                readOnly
                className="bg-secondary border-border font-mono"
              />
              <Button
                variant="outline"
                onClick={() => handleCopy(checksum, "Checksum copied")}
                disabled={!checksum}
              >
                Copy
              </Button>
            </div>
          </div>

          {copyMessage && (
            <p className="text-xs text-muted-foreground">{copyMessage}</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Result</CardTitle>
          <CardDescription>Đối chiếu mã lỗi theo bảng chuẩn VNPAY</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            {statusBadge}
            {parsed.format !== "empty" && (
              <span className="text-xs text-muted-foreground">Format: {parsed.format}</span>
            )}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">vnp_ResponseCode</label>
              <Input value={parsed.responseCode || ""} readOnly className="bg-secondary border-border font-mono" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">vnp_Message</label>
              <Input value={parsed.message || ""} readOnly className="bg-secondary border-border" />
            </div>
          </div>

          {matchedCode ? (
            <div className="rounded-md border border-border bg-secondary/40 p-3 text-sm">
              <p className="text-foreground font-medium">{matchedCode.rootCause}</p>
              <p className="text-muted-foreground mt-1">{matchedCode.merchantAction}</p>
            </div>
          ) : parsed.responseCode ? (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Không tìm thấy mã lỗi trong bảng {apiType}.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Chưa có dữ liệu phản hồi.</p>
          )}

          {parsed.transactionStatus && (
            <div className="rounded-md border border-border bg-secondary/40 p-3 text-sm">
              <p className="text-foreground font-medium">
                vnp_TransactionStatus: {parsed.transactionStatus}
              </p>
              <p className="text-muted-foreground mt-1">
                {transactionStatusInfo ? transactionStatusInfo.description : "Unknown transaction status"}
              </p>
            </div>
          )}

          {hints.length > 0 && (
            <div className="rounded-md border border-border bg-secondary/40 p-3 text-sm">
              <p className="text-foreground font-medium">Checklist gợi ý</p>
              <ul className="mt-2 list-disc list-inside text-muted-foreground space-y-1">
                {hints.map((item, idx) => (
                  <li key={`${parsed.responseCode}-hint-${idx}`}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
