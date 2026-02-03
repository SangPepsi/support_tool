"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, ArrowRight, CheckCircle2, Globe, Smartphone } from "lucide-react"

export function PayFlowOverview() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">PAY Flow Overview</h1>
        <p className="mt-2 text-muted-foreground">
          Understand the VNPAY PAY payment flow for Web and Mobile SDK integrations
        </p>
      </div>

      {/* Flow Type Tabs */}
      <Tabs defaultValue="web" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="web" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Globe className="h-4 w-4" />
            Web Flow
          </TabsTrigger>
          <TabsTrigger value="app" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Smartphone className="h-4 w-4" />
            App SDK Flow
          </TabsTrigger>
        </TabsList>

        {/* Web Flow */}
        <TabsContent value="web" className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">Web Payment Flow</CardTitle>
              <CardDescription>
                Browser-based payment redirect flow using VNPAY payment gateway
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center justify-center gap-2 py-8">
                <FlowStep step={1} title="Merchant Server" description="Generate payment URL" />
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <FlowStep step={2} title="Redirect" description="User to VNPAY" />
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <FlowStep step={3} title="VNPAY Portal" description="User completes payment" />
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <FlowStep step={4} title="Return URL" description="Redirect back to merchant" />
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <FlowStep step={5} title="IPN" description="Server notification" highlight />
              </div>
            </CardContent>
          </Card>

          {/* Web Flow Steps Detail */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <Badge variant="outline" className="w-fit mb-2">Step 1-2</Badge>
                <CardTitle className="text-lg text-card-foreground">Create & Redirect</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>1. Collect order details on your website</p>
                <p>2. Generate payment URL with all required parameters</p>
                <p>3. Create HMAC SHA512 checksum with secret key</p>
                <p>4. Redirect user&apos;s browser to VNPAY payment URL</p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <Badge variant="outline" className="w-fit mb-2">Step 3</Badge>
                <CardTitle className="text-lg text-card-foreground">Payment Processing</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>1. User selects bank and payment method</p>
                <p>2. User authenticates with their bank</p>
                <p>3. Bank processes the transaction</p>
                <p>4. VNPAY receives payment confirmation</p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <Badge variant="outline" className="w-fit mb-2">Step 4</Badge>
                <CardTitle className="text-lg text-card-foreground">Return URL Callback</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>1. VNPAY redirects user to your Return URL</p>
                <p>2. Payment result included in query parameters</p>
                <p>3. Verify checksum before trusting result</p>
                <p>4. Display appropriate message to user</p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card border-primary/50">
              <CardHeader className="pb-3">
                <Badge className="w-fit mb-2 bg-primary text-primary-foreground">Critical</Badge>
                <CardTitle className="text-lg text-card-foreground">IPN (Server-to-Server)</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>1. VNPAY sends POST to your IPN URL</p>
                <p>2. More reliable than Return URL callback</p>
                <p>3. Must respond with correct format</p>
                <p>4. Handle duplicate notifications (idempotency)</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* App SDK Flow */}
        <TabsContent value="app" className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">App SDK Payment Flow</CardTitle>
              <CardDescription>
                Native mobile SDK integration for iOS, Android, and React Native
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center justify-center gap-2 py-8">
                <FlowStep step={1} title="Your Server" description="Generate payment URL" highlight />
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <FlowStep step={2} title="Your App" description="Receive URL from server" />
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <FlowStep step={3} title="VNPAY SDK" description="Open payment UI" />
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <FlowStep step={4} title="SDK Callback" description="Result to app" />
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <FlowStep step={5} title="Server Verify" description="Confirm payment" highlight />
              </div>
            </CardContent>
          </Card>

          {/* App SDK Steps Detail */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-border bg-card border-primary/50">
              <CardHeader className="pb-3">
                <Badge className="w-fit mb-2 bg-primary text-primary-foreground">Security</Badge>
                <CardTitle className="text-lg text-card-foreground">Server-Side URL Generation</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>Payment URL MUST be generated on your server</p>
                <p>Secret key must NEVER be stored in mobile app</p>
                <p>App requests payment URL from your API</p>
                <p>Server returns complete VNPAY payment URL</p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <Badge variant="outline" className="w-fit mb-2">SDK Integration</Badge>
                <CardTitle className="text-lg text-card-foreground">SDK Result Handling</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p><code className="text-xs bg-secondary px-1 py-0.5 rounded font-mono">Success</code> - Payment completed (verify on server)</p>
                <p><code className="text-xs bg-secondary px-1 py-0.5 rounded font-mono">Cancel</code> - User cancelled payment</p>
                <p><code className="text-xs bg-secondary px-1 py-0.5 rounded font-mono">Fail</code> - Payment failed</p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card border-primary/50 md:col-span-2">
              <CardHeader className="pb-3">
                <Badge className="w-fit mb-2 bg-primary text-primary-foreground">Critical</Badge>
                <CardTitle className="text-lg text-card-foreground">Server-Side Verification</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Even when SDK returns &quot;Success&quot;, you MUST verify the payment on your server before confirming to the user. The SDK result can be manipulated on jailbroken/rooted devices.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Common Mistakes */}
      <Card className="border-destructive/50 bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Common Integration Mistakes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <MistakeItem
              title="Not verifying checksum"
              description="Always verify the checksum in callbacks before trusting payment results"
            />
            <MistakeItem
              title="Storing secret key in mobile app"
              description="Secret key must only exist on your backend server, never in client apps"
            />
            <MistakeItem
              title="Ignoring IPN notifications"
              description="IPN is more reliable than Return URL - implement both for production"
            />
            <MistakeItem
              title="Wrong amount format"
              description="Amount must be multiplied by 100 (no decimals). 10,000 VND = 1000000"
            />
            <MistakeItem
              title="Reusing transaction references"
              description="Each payment must have a unique vnp_TxnRef value"
            />
            <MistakeItem
              title="Not handling duplicate IPNs"
              description="VNPAY may send the same IPN multiple times - implement idempotency"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card className="border-primary/50 bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Quick Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              Use sandbox environment for testing before going to production
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              Always use HTTPS for Return URL and IPN URL in production
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              Log all VNPAY responses for debugging purposes
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              Test all error scenarios, not just successful payments
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

function FlowStep({ step, title, description, highlight = false }: {
  step: number
  title: string
  description: string
  highlight?: boolean
}) {
  return (
    <div className={`flex flex-col items-center rounded-lg border p-4 min-w-[120px] ${
      highlight ? "border-primary bg-primary/10" : "border-border bg-secondary"
    }`}>
      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
        highlight ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
      }`}>
        {step}
      </div>
      <span className="mt-2 text-sm font-medium text-foreground">{title}</span>
      <span className="text-xs text-muted-foreground text-center">{description}</span>
    </div>
  )
}

function MistakeItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <AlertTriangle className="h-4 w-4 mt-0.5 text-destructive flex-shrink-0" />
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
