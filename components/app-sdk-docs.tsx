"use client"

import React, { useMemo, useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { AlertTriangle, CheckCircle2, Shield, Smartphone, Server, ArrowRight, Search } from "lucide-react"
import { deepLinkApps } from "@/lib/mock-data"

export function AppSdkDocs() {
  const [deepLinkSearch, setDeepLinkSearch] = useState("")
  const [deepLinkFilter, setDeepLinkFilter] = useState<"all" | "deeplink" | "qr-only">("all")

  const filteredDeepLinkApps = useMemo(() => {
    const query = deepLinkSearch.toLowerCase()
    return deepLinkApps.filter(item => {
      const matchesQuery =
        item.bankCode.toLowerCase().includes(query) ||
        item.appName.toLowerCase().includes(query) ||
        (item.iosScheme || "").toLowerCase().includes(query) ||
        (item.androidScheme || "").toLowerCase().includes(query)
      const matchesFilter = deepLinkFilter === "all" || item.category === deepLinkFilter
      return matchesQuery && matchesFilter
    })
  }, [deepLinkFilter, deepLinkSearch])

  const groupedDeepLinkApps = useMemo(() => {
    return {
      deeplink: filteredDeepLinkApps.filter(item => item.category === "deeplink"),
      qrOnly: filteredDeepLinkApps.filter(item => item.category === "qr-only")
    }
  }, [filteredDeepLinkApps])
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">PAY App SDK Integration</h1>
        <p className="mt-2 text-muted-foreground">
          Mobile SDK documentation for iOS, Android, and React Native
        </p>
      </div>

      {/* Official SDK Document */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-card-foreground">Official SDK Document</CardTitle>
          <CardDescription>
            VNPAY Mobile SDK technical specification (PDF)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <a
            href="https://sandbox.vnpayment.vn/apis/files/Tai%20lieu%20ky%20thuat%20ket%20noi%20CTT%20VNPAY%20Mobile%20SDK.pdf"
            target="_blank"
            rel="noreferrer"
            className="block text-xs font-mono text-primary bg-secondary px-2 py-2 rounded break-all hover:underline"
          >
            https://sandbox.vnpayment.vn/apis/files/Tai%20lieu%20ky%20thuat%20ket%20noi%20CTT%20VNPAY%20Mobile%20SDK.pdf
          </a>
        </CardContent>
      </Card>

      {/* Flow Overview */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Mobile Payment Flow</CardTitle>
          <CardDescription>
            How payments work with the VNPAY mobile SDK
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-center gap-4 py-6">
            <FlowBox icon={<Server className="h-5 w-5" />} title="Your Server" subtitle="Generate URL" highlight />
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <FlowBox icon={<Smartphone className="h-5 w-5" />} title="Your App" subtitle="Receive URL" />
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <FlowBox icon={<Smartphone className="h-5 w-5" />} title="VNPAY SDK" subtitle="Payment UI" />
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <FlowBox icon={<Smartphone className="h-5 w-5" />} title="SDK Result" subtitle="Callback" />
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <FlowBox icon={<Server className="h-5 w-5" />} title="Server Verify" subtitle="Confirm" highlight />
          </div>
        </CardContent>
      </Card>

      {/* Security Warning */}
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Shield className="h-5 w-5 text-destructive" />
            Critical Security Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <SecurityItem
              title="Server-Side URL Generation"
              description="Payment URL MUST be generated on your server. Never generate it on the mobile device."
            />
            <SecurityItem
              title="Never Store Secret Key in App"
              description="The secret key must NEVER be included in your mobile app code or bundle."
            />
            <SecurityItem
              title="Server-Side Verification"
              description="After SDK returns success, verify the payment on your server before confirming to user."
            />
            <SecurityItem
              title="Don't Trust SDK Result Alone"
              description="SDK result can be manipulated on jailbroken/rooted devices. Always verify server-side."
            />
          </div>
        </CardContent>
      </Card>

      {/* Platform Tabs */}
      <Tabs defaultValue="ios" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="ios" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            iOS
          </TabsTrigger>
          <TabsTrigger value="android" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Android
          </TabsTrigger>
          <TabsTrigger value="react-native" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            React Native
          </TabsTrigger>
        </TabsList>

        {/* iOS */}
        <TabsContent value="ios" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">iOS Integration</CardTitle>
              <CardDescription>Swift/Objective-C SDK integration guide</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Installation</h4>
                <code className="block p-3 bg-secondary rounded-md text-sm font-mono text-muted-foreground">
                  pod &apos;VNPAYMerchant&apos;
                </code>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Usage</h4>
                <pre className="block p-3 bg-secondary rounded-md text-xs font-mono text-muted-foreground overflow-x-auto">
{`// 1. Request payment URL from your server
let paymentURL = await yourAPI.getPaymentURL(orderId: orderId)

// 2. Open VNPAY SDK
VNPAYMerchant.shared.open(
    paymentURL: paymentURL,
    scheme: "yourapp",
    completion: { result in
        switch result {
        case .success:
            // 3. IMPORTANT: Verify on server before confirming
            await yourAPI.verifyPayment(orderId: orderId)
        case .cancelled:
            // User cancelled
        case .failed(let error):
            // Handle error
        }
    }
)`}</pre>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-foreground">URL Scheme Configuration</h4>
                <p className="text-sm text-muted-foreground">
                  Add your URL scheme to Info.plist for callback handling:
                </p>
                <pre className="block p-3 bg-secondary rounded-md text-xs font-mono text-muted-foreground overflow-x-auto">
{`<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>yourapp</string>
        </array>
    </dict>
</array>`}</pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Android */}
        <TabsContent value="android" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">Android Integration</CardTitle>
              <CardDescription>Kotlin/Java SDK integration guide</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Installation</h4>
                <code className="block p-3 bg-secondary rounded-md text-sm font-mono text-muted-foreground">
                  implementation &apos;com.vnpay:merchant-sdk:1.0.0&apos;
                </code>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Usage</h4>
                <pre className="block p-3 bg-secondary rounded-md text-xs font-mono text-muted-foreground overflow-x-auto">
{`// 1. Request payment URL from your server
val paymentURL = yourAPI.getPaymentURL(orderId)

// 2. Open VNPAY SDK
VNPAYMerchant.openPayment(
    activity = this,
    paymentURL = paymentURL,
    scheme = "yourapp"
)

// 3. Handle result in onActivityResult
override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
    when (VNPAYMerchant.getResult(requestCode, resultCode, data)) {
        VNPAYResult.SUCCESS -> {
            // IMPORTANT: Verify on server before confirming
            yourAPI.verifyPayment(orderId)
        }
        VNPAYResult.CANCELLED -> {
            // User cancelled
        }
        VNPAYResult.FAILED -> {
            // Handle error
        }
    }
}`}</pre>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Manifest Configuration</h4>
                <pre className="block p-3 bg-secondary rounded-md text-xs font-mono text-muted-foreground overflow-x-auto">
{`<activity
    android:name=".PaymentResultActivity"
    android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="yourapp" />
    </intent-filter>
</activity>`}</pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* React Native */}
        <TabsContent value="react-native" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">React Native Integration</CardTitle>
              <CardDescription>Cross-platform SDK integration guide</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Installation</h4>
                <code className="block p-3 bg-secondary rounded-md text-sm font-mono text-muted-foreground">
                  npm install react-native-vnpay-merchant
                </code>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Usage</h4>
                <pre className="block p-3 bg-secondary rounded-md text-xs font-mono text-muted-foreground overflow-x-auto">
{`import VNPAYMerchant from 'react-native-vnpay-merchant';

const handlePayment = async (orderId: string) => {
  // 1. Request payment URL from your server
  const paymentURL = await yourAPI.getPaymentURL(orderId);
  
  // 2. Open VNPAY SDK
  const result = await VNPAYMerchant.open({
    paymentURL,
    scheme: 'yourapp',
  });
  
  // 3. Handle result
  switch (result.status) {
    case 'success':
      // IMPORTANT: Verify on server before confirming
      await yourAPI.verifyPayment(orderId);
      break;
    case 'cancelled':
      // User cancelled
      break;
    case 'failed':
      // Handle error
      break;
  }
};`}</pre>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Platform Setup</h4>
                <p className="text-sm text-muted-foreground">
                  Remember to configure URL schemes for both iOS and Android platforms as shown in their respective tabs.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Troubleshooting */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Troubleshooting</CardTitle>
          <CardDescription>
            Common SDK issues and fixes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Lỗi không tìm thấy thư viện do maven (Gradle 7.x)</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>
                Tại file <code className="bg-secondary px-1 rounded font-mono">/AwesomeProject/react-native-vnpay-merchant/android/build.gradle</code>:
                đổi <code className="bg-secondary px-1 rounded font-mono">maven</code> thành <code className="bg-secondary px-1 rounded font-mono">maven-publish</code>.
              </li>
              <li>
                Config lại file <code className="bg-secondary px-1 rounded font-mono">/AwesomeProject/react-native-vnpay-merchant/android/build.gradle</code>:
                bỏ <code className="bg-secondary px-1 rounded font-mono">implementation(name: 'merchant-1.0.25', ext: 'aar')</code>,
                chuyển sang import lib bằng aar thủ công
                <code className="bg-secondary px-1 rounded font-mono">implementation files('libs/merchant-1.0.25.aar')</code>,
                và comment lại 2 đoạn code này.
              </li>
              <li>
                Tạo thư mục:
                <code className="bg-secondary px-1 rounded font-mono">/AwesomeProject/react-native-vnpay-merchant/android/libs</code>,
                <code className="bg-secondary px-1 rounded font-mono">/AwesomeProject/react-native-vnpay-merchant/android/src/libs</code>
                và copy file <code className="bg-secondary px-1 rounded font-mono">merchant-1.0.25.aar</code> vào theo cây thư mục dưới đây.
              </li>
              <li>
                Config lại file <code className="bg-secondary px-1 rounded font-mono">/AwesomeProject/android/build.gradle</code>.
              </li>
              <li>
                Copy thư mục <code className="bg-secondary px-1 rounded font-mono">/AwesomeProject/react-native-vnpay-merchant/android/libs</code>
                vào <code className="bg-secondary px-1 rounded font-mono">/AwesomeProject/android/app/libs</code>
                và <code className="bg-secondary px-1 rounded font-mono">/AwesomeProject/android/libs</code>.
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Deep-link Schemes */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-card-foreground">Deep-link Scheme List</CardTitle>
              <CardDescription>
                Danh sách app hỗ trợ deep-link/scan QRCode
              </CardDescription>
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search bank/app..."
                  value={deepLinkSearch}
                  onChange={(e) => setDeepLinkSearch(e.target.value)}
                  className="pl-9 bg-secondary border-border"
                />
              </div>
              <Select value={deepLinkFilter} onValueChange={(v) => setDeepLinkFilter(v as typeof deepLinkFilter)}>
                <SelectTrigger className="w-full sm:w-[180px] bg-secondary border-border">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="deeplink">Deep-link</SelectItem>
                  <SelectItem value="qr-only">QR only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border overflow-auto max-h-[520px]">
            <Table className="w-full table-fixed">
              <TableHeader className="sticky top-0 z-10 bg-card">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground w-[60px]">No.</TableHead>
                  <TableHead className="text-muted-foreground w-[80px]">Logo</TableHead>
                  <TableHead className="text-muted-foreground w-[160px]">Bank Code</TableHead>
                  <TableHead className="text-muted-foreground w-[220px]">App Name</TableHead>
                  <TableHead className="text-muted-foreground w-[120px] text-center">Deep-link</TableHead>
                  <TableHead className="text-muted-foreground w-[200px]">iOS Scheme</TableHead>
                  <TableHead className="text-muted-foreground w-[200px]">Android Scheme</TableHead>
                  <TableHead className="text-muted-foreground w-[160px]">iOS PackID</TableHead>
                  <TableHead className="text-muted-foreground w-[160px]">Android PackID</TableHead>
                  <TableHead className="text-muted-foreground w-[260px]">App Links</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupedDeepLinkApps.deeplink.length > 0 && (
                  <>
                    <TableRow className="border-border bg-secondary/60">
                      <TableCell colSpan={10} className="text-sm font-medium text-foreground">
                        Deep-link supported
                      </TableCell>
                    </TableRow>
                    {groupedDeepLinkApps.deeplink.map(item => (
                      <TableRow key={`${item.bankCode}-${item.no}`} className="border-border odd:bg-secondary/40">
                        <TableCell className="text-sm text-muted-foreground">{item.no}</TableCell>
                        <TableCell>
                          {item.logoLink ? (
                            <img
                              src={item.logoLink}
                              alt={`${item.appName} logo`}
                              className="h-8 w-8 rounded-sm object-contain bg-secondary"
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-foreground break-words">{item.bankCode}</TableCell>
                        <TableCell className="text-sm text-foreground break-words">{item.appName}</TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-primary text-primary-foreground">Yes</Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground break-all">
                          {item.iosScheme || "—"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground break-all">
                          {item.androidScheme || "—"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground break-all">
                          {item.iosPackId || "—"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground break-all">
                          {item.androidPackId || "—"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground break-all">
                          {item.androidAppLink && (
                            <div>Android: {item.androidAppLink}</div>
                          )}
                          {item.iosAppLink && (
                            <div>iOS: {item.iosAppLink}</div>
                          )}
                          {!item.androidAppLink && !item.iosAppLink && "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
                {groupedDeepLinkApps.qrOnly.length > 0 && (
                  <>
                    <TableRow className="border-border bg-secondary/60">
                      <TableCell colSpan={10} className="text-sm font-medium text-foreground">
                        QR-only (no deep-link)
                      </TableCell>
                    </TableRow>
                    {groupedDeepLinkApps.qrOnly.map(item => (
                      <TableRow key={`${item.bankCode}-${item.no}`} className="border-border odd:bg-secondary/40">
                        <TableCell className="text-sm text-muted-foreground">{item.no}</TableCell>
                        <TableCell>
                          {item.logoLink ? (
                            <img
                              src={item.logoLink}
                              alt={`${item.appName} logo`}
                              className="h-8 w-8 rounded-sm object-contain bg-secondary"
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-foreground break-words">{item.bankCode}</TableCell>
                        <TableCell className="text-sm text-foreground break-words">{item.appName}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="text-muted-foreground">No</Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground break-all">
                          {item.iosScheme || "—"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground break-all">
                          {item.androidScheme || "—"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground break-all">
                          {item.iosPackId || "—"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground break-all">
                          {item.androidPackId || "—"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground break-all">
                          {item.androidAppLink && (
                            <div>Android: {item.androidAppLink}</div>
                          )}
                          {item.iosAppLink && (
                            <div>iOS: {item.iosAppLink}</div>
                          )}
                          {!item.androidAppLink && !item.iosAppLink && "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
              </TableBody>
            </Table>
          </div>
          {filteredDeepLinkApps.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              No apps found
            </div>
          )}
        </CardContent>
      </Card>

      {/* SDK Result Mapping */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">SDK Result Mapping</CardTitle>
          <CardDescription>
            How to interpret SDK callback results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <ResultCard
              result="Success"
              status="success"
              description="Payment completed in SDK. User saw success screen."
              action="MUST verify payment on server before confirming to user. SDK result alone is not trustworthy."
            />
            <ResultCard
              result="Cancel"
              status="warning"
              description="User cancelled the payment flow."
              action="Allow user to retry payment. Order status remains pending."
            />
            <ResultCard
              result="Fail"
              status="error"
              description="Payment failed due to error (bank issue, timeout, etc)."
              action="Show error message to user. Allow retry with same or different payment method."
            />
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card className="border-primary/50 bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-3 md:grid-cols-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              Show loading indicator while requesting payment URL from server
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              Handle app backgrounding - payment may complete while app is in background
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              Implement proper error handling for network failures
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              Test on real devices, not just simulators
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              Use sandbox environment for development testing
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              Log SDK results for debugging purposes
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

function FlowBox({ icon, title, subtitle, highlight = false }: {
  icon: React.ReactNode
  title: string
  subtitle: string
  highlight?: boolean
}) {
  return (
    <div className={`flex flex-col items-center rounded-lg border p-4 min-w-[100px] ${
      highlight ? "border-primary bg-primary/10" : "border-border bg-secondary"
    }`}>
      <div className={highlight ? "text-primary" : "text-muted-foreground"}>
        {icon}
      </div>
      <span className="mt-2 text-sm font-medium text-foreground">{title}</span>
      <span className="text-xs text-muted-foreground">{subtitle}</span>
    </div>
  )
}

function SecurityItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function ResultCard({ result, status, description, action }: {
  result: string
  status: "success" | "warning" | "error"
  description: string
  action: string
}) {
  const statusColors = {
    success: "bg-primary/10 border-primary text-primary",
    warning: "bg-warning/10 border-warning text-warning",
    error: "bg-destructive/10 border-destructive text-destructive"
  }

  return (
    <div className={`rounded-lg border p-4 ${statusColors[status]}`}>
      <Badge className={status === "success" ? "bg-primary" : status === "warning" ? "bg-warning text-warning-foreground" : "bg-destructive"}>
        {result}
      </Badge>
      <p className="mt-3 text-sm text-foreground">{description}</p>
      <p className="mt-2 text-xs text-muted-foreground">{action}</p>
    </div>
  )
}
