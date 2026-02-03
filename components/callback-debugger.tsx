"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  CheckCircle2, 
  XCircle, 
  Bug, 
  AlertTriangle, 
  Info,
  ArrowRight
} from "lucide-react"
import { errorCodes, transactionStatusCodes } from "@/lib/mock-data"

interface DebugResult {
  checksumValid: boolean | null
  responseCode: string
  responseCodeMeaning: string
  transactionStatus: string
  transactionStatusMeaning: string
  parameters: { key: string; value: string }[]
  merchantActions: string[]
}

export function CallbackDebugger() {
  const [callbackUrl, setCallbackUrl] = useState("")
  const [secretKey, setSecretKey] = useState("")
  const [result, setResult] = useState<DebugResult | null>(null)
  const [isDebugging, setIsDebugging] = useState(false)

  const getResponseCodeInfo = (code: string, preferredApiKeyword?: string) => {
    const preferred = preferredApiKeyword
      ? errorCodes.find(e => e.code === code && e.api.includes(preferredApiKeyword))
      : undefined
    const error = preferred || errorCodes.find(e => e.code === code)
    if (error) {
      return {
        meaning: error.rootCause,
        action: error.merchantAction
      }
    }
    return {
      meaning: "Unknown response code",
      action: "Contact VNPAY support for clarification"
    }
  }

  const getTransactionStatusInfo = (code: string) => {
    const status = transactionStatusCodes.find(s => s.code === code)
    if (status) {
      return {
        meaning: status.description,
        action: status.merchantAction
      }
    }
    return {
      meaning: "Unknown transaction status",
      action: "Verify transaction status with VNPAY"
    }
  }

  const debugCallback = async () => {
    setIsDebugging(true)

    try {
      // Parse URL
      let queryString = callbackUrl
      if (callbackUrl.includes('?')) {
        queryString = callbackUrl.split('?')[1]
      }

      // Parse parameters
      const params = new URLSearchParams(queryString)
      const paramObj: Record<string, string> = {}
      const paramList: { key: string; value: string }[] = []

      params.forEach((value, key) => {
        paramObj[key] = value
        paramList.push({ 
          key, 
          value: decodeURIComponent(value)
        })
      })

      // Get response code
      const responseCode = paramObj['vnp_ResponseCode'] || paramObj['vnp_TransactionStatus'] || 'N/A'
      const transactionStatus = paramObj['vnp_TransactionStatus'] || 'N/A'
      const codeInfo = getResponseCodeInfo(responseCode, "IPN")
      const transactionInfo = transactionStatus !== 'N/A'
        ? getTransactionStatusInfo(transactionStatus)
        : { meaning: "N/A", action: "" }

      // Validate checksum if secret key provided
      let checksumValid: boolean | null = null
      if (secretKey && paramObj['vnp_SecureHash']) {
        const providedHash = paramObj['vnp_SecureHash']
        
        const sortedParams = Object.keys(paramObj)
          .filter(key => key !== 'vnp_SecureHash' && key !== 'vnp_SecureHashType')
          .sort()
          .map(key => `${key}=${paramObj[key]}`)
          .join('&')

        const encoder = new TextEncoder()
        const keyData = encoder.encode(secretKey)
        const data = encoder.encode(sortedParams)
        
        const cryptoKey = await crypto.subtle.importKey(
          'raw',
          keyData,
          { name: 'HMAC', hash: 'SHA-512' },
          false,
          ['sign']
        )
        
        const signature = await crypto.subtle.sign('HMAC', cryptoKey, data)
        const generatedHash = Array.from(new Uint8Array(signature))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')

        checksumValid = providedHash.toLowerCase() === generatedHash.toLowerCase()
      }

      // Generate merchant actions based on response
      const merchantActions: string[] = []
      
      if (checksumValid === false) {
        merchantActions.push("CRITICAL: Checksum validation failed - do not trust this response")
        merchantActions.push("Verify your secret key is correct")
        merchantActions.push("Check for parameter tampering")
      } else if (checksumValid === true) {
        merchantActions.push("Checksum verified - response is authentic")
      }

      if (responseCode === '00') {
        merchantActions.push("Payment successful - update order status to PAID")
        merchantActions.push("Send confirmation email/notification to customer")
        merchantActions.push("Fulfill the order")
      } else if (responseCode === '24') {
        merchantActions.push("Customer cancelled - keep order as PENDING")
        merchantActions.push("Allow customer to retry payment")
      } else {
        merchantActions.push(codeInfo.action)
      }

      if (transactionInfo.action) {
        merchantActions.push(transactionInfo.action)
      }

      merchantActions.push("Log this callback for audit purposes")
      merchantActions.push("If IPN callback, respond with correct format to VNPAY")

      setResult({
        checksumValid,
        responseCode,
        responseCodeMeaning: codeInfo.meaning,
        transactionStatus,
        transactionStatusMeaning: transactionInfo.meaning,
        parameters: paramList.sort((a, b) => a.key.localeCompare(b.key)),
        merchantActions
      })
    } catch {
      setResult({
        checksumValid: null,
        responseCode: 'Error',
        responseCodeMeaning: 'Failed to parse callback URL',
        transactionStatus: 'Error',
        transactionStatusMeaning: 'Error',
        parameters: [],
        merchantActions: ['Check the URL format and try again']
      })
    }

    setIsDebugging(false)
  }

  const getStatusBadge = (code: string) => {
    if (code === '00') {
      return <Badge className="bg-primary text-primary-foreground">Success</Badge>
    } else if (code === '24') {
      return <Badge className="bg-warning text-warning-foreground">Cancelled</Badge>
    } else {
      return <Badge variant="destructive">Failed</Badge>
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Callback Debugger</h1>
        <p className="mt-2 text-muted-foreground">
          Debug VNPAY payment callbacks and understand payment results
        </p>
      </div>

      {/* Info Card */}
      <Card className="border-primary/50 bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm text-card-foreground">
            <Info className="h-4 w-4 text-primary" />
            About Callbacks
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>VNPAY sends payment results through two channels:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Return URL</strong> - Browser redirect after payment (may not fire if user closes browser)</li>
            <li><strong>IPN URL</strong> - Server-to-server notification (more reliable, implement both)</li>
          </ul>
        </CardContent>
      </Card>

      {/* Input Form */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Debug Callback URL</CardTitle>
          <CardDescription>
            Paste a callback URL to decode parameters and understand the payment result
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-foreground">Callback URL</Label>
            <Textarea
              placeholder="https://merchant.com/callback?vnp_Amount=1000000&vnp_ResponseCode=00&..."
              value={callbackUrl}
              onChange={(e) => setCallbackUrl(e.target.value)}
              className="min-h-[100px] font-mono text-sm bg-secondary border-border"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Secret Key (optional - for checksum validation)</Label>
            <Input
              type="password"
              placeholder="Enter your VNPAY secret key"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="font-mono bg-secondary border-border"
            />
          </div>
          <Button 
            onClick={debugCallback}
            disabled={!callbackUrl || isDebugging}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Bug className="mr-2 h-4 w-4" />
            {isDebugging ? 'Debugging...' : 'Debug Callback'}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <>
          {/* Status Overview */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">Payment Result</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Response Code</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold font-mono text-foreground">{result.responseCode}</span>
                    {getStatusBadge(result.responseCode)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{result.responseCodeMeaning}</p>
                </div>
                
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Transaction Status</p>
                  <span className="text-2xl font-bold font-mono text-foreground">{result.transactionStatus}</span>
                  {result.transactionStatusMeaning !== 'N/A' && (
                    <p className="text-sm text-muted-foreground mt-2">{result.transactionStatusMeaning}</p>
                  )}
                </div>

                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Checksum</p>
                  {result.checksumValid === null ? (
                    <span className="text-sm text-muted-foreground">Not validated (no secret key)</span>
                  ) : result.checksumValid ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span className="text-primary font-medium">Valid</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-destructive" />
                      <span className="text-destructive font-medium">Invalid</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Merchant Actions */}
          <Card className="border-primary/50 bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-primary" />
                Recommended Merchant Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.merchantActions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    {action.includes('CRITICAL') ? (
                      <AlertTriangle className="h-4 w-4 mt-0.5 text-destructive flex-shrink-0" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                    )}
                    <span className={action.includes('CRITICAL') ? 'text-destructive' : 'text-muted-foreground'}>
                      {action}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Parameters Table */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">Decoded Parameters</CardTitle>
              <CardDescription>
                All parameters from the callback URL
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground">Parameter</TableHead>
                      <TableHead className="text-muted-foreground">Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.parameters.map((param) => (
                      <TableRow key={param.key} className="border-border">
                        <TableCell>
                          <code className="font-mono text-sm text-primary">{param.key}</code>
                        </TableCell>
                        <TableCell className="font-mono text-sm text-foreground break-all">
                          {param.value}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
