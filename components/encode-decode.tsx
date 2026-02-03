"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Copy, CheckCircle2, Info, ArrowLeftRight } from "lucide-react"

export function EncodeDecode() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [copied, setCopied] = useState(false)

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

  // Decode URL encoded string
  const vnpayDecode = (str: string): string => {
    try {
      return decodeURIComponent(str.replace(/\+/g, ' '))
    } catch {
      return "Error: Invalid encoded string"
    }
  }

  // Process query string (encode values only, not keys)
  const processQueryString = (str: string, encode: boolean): string => {
    // Check if it's a query string format
    if (str.includes('=')) {
      const pairs = str.split('&')
      return pairs.map(pair => {
        const [key, ...valueParts] = pair.split('=')
        const value = valueParts.join('=') // Handle values with = in them
        
        // Skip encoding for vnp_SecureHash and vnp_SecureHashType
        if (key === 'vnp_SecureHash' || key === 'vnp_SecureHashType') {
          return `${key}=${value}`
        }
        
        if (encode) {
          return `${key}=${vnpayEncodeValue(key, value)}`
        } else {
          return `${key}=${vnpayDecode(value)}`
        }
      }).join('&')
    }
    
    // Plain text
    return encode ? vnpayEncode(str) : vnpayDecode(str)
  }

  const handleProcess = () => {
    const result = processQueryString(input, mode === "encode")
    setOutput(result)
  }

  const handleSwap = () => {
    setInput(output)
    setOutput("")
    setMode(mode === "encode" ? "decode" : "encode")
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Encode / Decode Tool</h1>
        <p className="mt-2 text-muted-foreground">
          URL encode and decode values using VNPAY encoding rules (UTF-8, RFC 3986)
        </p>
      </div>

      {/* Info Card */}
      <Card className="border-primary/50 bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm text-card-foreground">
            <Info className="h-4 w-4 text-primary" />
            VNPAY Encoding Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <ul className="list-disc list-inside space-y-1">
            <li>Encode parameter <strong>values only</strong>, not parameter keys</li>
            <li>Do <strong>NOT</strong> encode <code className="bg-secondary px-1 rounded font-mono">vnp_SecureHash</code> or <code className="bg-secondary px-1 rounded font-mono">vnp_SecureHashType</code></li>
            <li>Use UTF-8 encoding with RFC 3986 compliance</li>
            <li>Special characters like space, &amp;, = must be encoded in values</li>
          </ul>
        </CardContent>
      </Card>

      {/* Main Tool */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-card-foreground">Encoding Tool</CardTitle>
              <CardDescription>
                Enter a value or query string to encode/decode
              </CardDescription>
            </div>
            <Tabs value={mode} onValueChange={(v) => setMode(v as "encode" | "decode")}>
              <TabsList className="bg-secondary">
                <TabsTrigger value="encode" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Encode
                </TabsTrigger>
                <TabsTrigger value="decode" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Decode
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1fr,auto,1fr]">
            {/* Input */}
            <div className="space-y-2">
              <Label className="text-foreground">
                Input {mode === "encode" ? "(Raw)" : "(Encoded)"}
              </Label>
              <Textarea
                placeholder={mode === "encode" 
                  ? "Payment for order #123\nor\nvnp_OrderInfo=Payment for order #123&vnp_TxnRef=ORDER123"
                  : "Payment%20for%20order%20%23123\nor\nvnp_OrderInfo=Payment+for+order+%23123&vnp_TxnRef=ORDER123"
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[200px] font-mono text-sm bg-secondary border-border"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center justify-center gap-2">
              <Button 
                onClick={handleProcess} 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {mode === "encode" ? "Encode" : "Decode"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSwap}
                className="text-muted-foreground bg-transparent"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Output */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-foreground">
                  Output {mode === "encode" ? "(Encoded)" : "(Decoded)"}
                </Label>
                {output && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="text-muted-foreground h-auto py-1"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="mr-1 h-3 w-3 text-primary" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-1 h-3 w-3" />
                        Copy
                      </>
                    )}
                  </Button>
                )}
              </div>
              <Textarea
                value={output}
                readOnly
                placeholder="Result will appear here..."
                className="min-h-[200px] font-mono text-sm bg-secondary border-border"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Examples */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Common Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ExampleRow
              label="Order Info with special chars"
              raw="Payment for order #123 (VIP)"
              encoded="Payment+for+order+%23123+%28VIP%29"
            />
            <ExampleRow
              label="Return URL"
              raw="https://merchant.com/payment/return?order=123"
              encoded="https%3A%2F%2Fmerchant.com%2Fpayment%2Freturn%3Forder%3D123"
            />
            <ExampleRow
              label="Vietnamese text"
              raw="Thanh toán đơn hàng"
              encoded="Thanh+to%C3%A1n+%C4%91%C6%A1n+h%C3%A0ng"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ExampleRow({ label, raw, encoded }: { label: string; raw: string; encoded: string }) {
  return (
    <div className="rounded-md border border-border p-4">
      <p className="text-sm font-medium text-foreground mb-3">{label}</p>
      <div className="grid gap-2 md:grid-cols-2">
        <div>
          <Badge variant="outline" className="mb-2">Raw</Badge>
          <code className="block text-xs font-mono text-muted-foreground bg-secondary p-2 rounded break-all">
            {raw}
          </code>
        </div>
        <div>
          <Badge className="mb-2 bg-primary text-primary-foreground">Encoded</Badge>
          <code className="block text-xs font-mono text-muted-foreground bg-secondary p-2 rounded break-all">
            {encoded}
          </code>
        </div>
      </div>
    </div>
  )
}
