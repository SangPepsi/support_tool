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
import { CheckCircle2, XCircle, ShieldCheck, AlertTriangle, Info } from "lucide-react"

interface ValidationResult {
  isValid: boolean
  providedHash: string
  generatedHash: string
  parameters: { key: string; value: string; issue?: string }[]
  hashInput: string
}

export function ChecksumValidator() {
  const [paymentUrl, setPaymentUrl] = useState("")
  const [secretKey, setSecretKey] = useState("")
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [isValidating, setIsValidating] = useState(false)

  // VNPAY URL encoding (RFC 3986)
  const vnpayEncode = (str: string): string => {
    return encodeURIComponent(str)
      .replace(/!/g, '%21')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\*/g, '%2A')
  }

  const vnpayEncodeValue = (key: string, value: string): string => {
    const encoded = vnpayEncode(value)
    return key === 'vnp_OrderInfo' ? encoded.replace(/%20/g, '+') : encoded
  }

  const validateChecksum = async () => {
    setIsValidating(true)
    
    try {
      // Parse URL
      let queryString = paymentUrl
      if (paymentUrl.includes('?')) {
        queryString = paymentUrl.split('?')[1]
      }

      // Parse parameters
      const params = new URLSearchParams(queryString)
      const paramObj: Record<string, string> = {}
      const paramList: { key: string; value: string; issue?: string }[] = []

      params.forEach((value, key) => {
        paramObj[key] = value
        const issues: string[] = []
        
        // Check for common issues
        if (key === 'vnp_Amount' && value.includes('.')) {
          issues.push('Amount should not have decimals')
        }
        if (key === 'vnp_CreateDate' && value.length !== 14) {
          issues.push('Date format should be yyyyMMddHHmmss (14 chars)')
        }
        
        paramList.push({ 
          key, 
          value: decodeURIComponent(value),
          issue: issues.length > 0 ? issues.join(', ') : undefined
        })
      })

      // Get provided hash
      const providedHash = paramObj['vnp_SecureHash'] || ''

      // Remove hash params and sort
      const sortedParams = Object.keys(paramObj)
        .filter(key => key !== 'vnp_SecureHash' && key !== 'vnp_SecureHashType')
        .sort()
        .map(key => `${key}=${vnpayEncodeValue(key, paramObj[key])}`)
        .join('&')

      // Generate hash using Web Crypto API
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

      setResult({
        isValid: providedHash.toLowerCase() === generatedHash.toLowerCase(),
        providedHash,
        generatedHash,
        parameters: paramList.sort((a, b) => a.key.localeCompare(b.key)),
        hashInput: sortedParams
      })
    } catch {
      setResult({
        isValid: false,
        providedHash: 'Error parsing URL',
        generatedHash: 'Error generating hash',
        parameters: [],
        hashInput: ''
      })
    }

    setIsValidating(false)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Checksum Validator</h1>
        <p className="mt-2 text-muted-foreground">
          Validate VNPAY payment URL checksums and debug signature issues
        </p>
      </div>

      {/* Info Card */}
      <Card className="border-primary/50 bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm text-card-foreground">
            <Info className="h-4 w-4 text-primary" />
            How Checksum Validation Works
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <ol className="list-decimal list-inside space-y-1">
            <li>Parse query parameters from the payment URL</li>
            <li>Remove <code className="bg-secondary px-1 rounded font-mono">vnp_SecureHash</code> and <code className="bg-secondary px-1 rounded font-mono">vnp_SecureHashType</code></li>
            <li>Sort remaining parameters alphabetically by key</li>
            <li>Build hash string in format: <code className="bg-secondary px-1 rounded font-mono">key1=value1&key2=value2...</code></li>
            <li>Generate HMAC SHA512 using your secret key</li>
            <li>Compare generated hash with provided vnp_SecureHash</li>
          </ol>
        </CardContent>
      </Card>

      {/* Input Form */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Validate Payment URL</CardTitle>
          <CardDescription>
            Enter a VNPAY payment URL or callback URL and your secret key to validate
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-foreground">Payment URL or Query String</Label>
            <Textarea
              placeholder="https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=1806000&vnp_Command=pay&vnp_CreateDate=20210801153333&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+%3A5&vnp_OrderType=other&vnp_ReturnUrl=https%3A%2F%2Fdomainmerchant.vn%2FReturnUrl&vnp_TmnCode=DEMOV210&vnp_TxnRef=5&vnp_Version=2.1.0&vnp_SecureHash=..."
              value={paymentUrl}
              onChange={(e) => setPaymentUrl(e.target.value)}
              className="min-h-[120px] font-mono text-sm bg-secondary border-border"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Secret Key</Label>
            <Input
              type="password"
              placeholder="Enter your VNPAY secret key"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="font-mono bg-secondary border-border"
            />
            <p className="text-xs text-muted-foreground">
              Your secret key is never sent to any server - validation is done locally in your browser
            </p>
          </div>
          <Button 
            onClick={validateChecksum}
            disabled={!paymentUrl || !secretKey || isValidating}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <ShieldCheck className="mr-2 h-4 w-4" />
            {isValidating ? 'Validating...' : 'Validate Checksum'}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <>
          {/* Status Card */}
          <Card className={`border-2 ${result.isValid ? 'border-primary bg-primary/5' : 'border-destructive bg-destructive/5'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {result.isValid ? (
                  <>
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                    <span className="text-primary">PASS - Checksum Valid</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-6 w-6 text-destructive" />
                    <span className="text-destructive">FAIL - Checksum Mismatch</span>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground text-xs">Provided Hash</Label>
                  <code className="block mt-1 p-2 bg-secondary rounded text-xs font-mono break-all text-foreground">
                    {result.providedHash || '(none)'}
                  </code>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Generated Hash</Label>
                  <code className="block mt-1 p-2 bg-secondary rounded text-xs font-mono break-all text-foreground">
                    {result.generatedHash}
                  </code>
                </div>
              </div>
              
              {!result.isValid && (
                <div className="p-3 bg-destructive/10 rounded-md">
                  <p className="text-sm text-destructive font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Common causes for checksum mismatch:
                  </p>
                  <ul className="mt-2 text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>Incorrect secret key</li>
                    <li>Parameters not sorted alphabetically</li>
                    <li>Including vnp_SecureHash in hash calculation</li>
                    <li>Encoding issues in parameter values</li>
                    <li>Using wrong hash algorithm (should be SHA512)</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hash Input */}
          {result.hashInput && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-card-foreground text-base">Hash Input String</CardTitle>
                <CardDescription>
                  This is the string used to generate the checksum (sorted parameters without hash)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <code className="block p-3 bg-secondary rounded text-xs font-mono break-all text-muted-foreground">
                  {result.hashInput}
                </code>
              </CardContent>
            </Card>
          )}

          {/* Parameters Table */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">Parsed Parameters</CardTitle>
              <CardDescription>
                All parameters extracted from the URL (sorted alphabetically)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground">Parameter</TableHead>
                      <TableHead className="text-muted-foreground">Value</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.parameters.map((param) => (
                      <TableRow key={param.key} className="border-border">
                        <TableCell>
                          <code className="font-mono text-sm text-primary">{param.key}</code>
                        </TableCell>
                        <TableCell className="font-mono text-sm text-foreground max-w-md break-all">
                          {param.value}
                        </TableCell>
                        <TableCell>
                          {param.issue ? (
                            <Badge variant="outline" className="text-destructive border-destructive">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {param.issue}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-primary border-primary">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              OK
                            </Badge>
                          )}
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
