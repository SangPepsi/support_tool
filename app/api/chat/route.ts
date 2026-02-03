import { NextResponse } from "next/server"
import {
  payParameters,
  errorCodes,
  transactionStatusCodes,
  checklistItems,
  knowledgeBaseItems,
  customerSupportIssues,
  platformPartners,
  deepLinkApps
} from "@/lib/mock-data"
import { promises as fs } from "fs"
import path from "path"

type ChatMessage = { role: "user" | "assistant"; content: string }

const normalize = (text: string) => text.toLowerCase()
const normalizeKey = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "")
const tokenize = (text: string) =>
  normalize(text)
    .split(/[^a-z0-9]+/g)
    .filter(token => token.length >= 2)

const extractCodes = (text: string) => {
  const matches = text.match(/\b\d{2}\b/g)
  return matches ? Array.from(new Set(matches)) : []
}

const isGreeting = (text: string) => {
  const q = normalize(text)
  return ["xin chào", "chào", "hello", "hi", "chào bạn"].some(g => q.includes(g))
}

const isSmalltalk = (text: string) => {
  const q = normalize(text)
  return [
    "nói chuyện",
    "trò chuyện",
    "bạn là ai",
    "bạn làm gì",
    "bao nhiêu tuổi",
    "bạn bao nhiêu tuổi",
    "giúp gì",
    "hỗ trợ gì"
  ].some(t => q.includes(t))
}

const isSourceSearch = (text: string) => {
  const q = normalize(text)
  return [
    "mã nguồn",
    "source",
    "code",
    "file",
    "tìm trong code",
    "tìm trong mã"
  ].some(t => q.includes(t))
}

const isDeepLinkListQuery = (text: string) => {
  const q = normalize(text)
  return (
    (q.includes("deep-link") || q.includes("deeplink") || q.includes("deep link")) &&
    (q.includes("ngân hàng") || q.includes("bank") || q.includes("hỗ trợ") || q.includes("danh sách"))
  )
}

const buildDeepLinkListReply = () => {
  const supported = deepLinkApps.filter(item => item.deeplinkSupport)
  const names = supported.slice(0, 12).map(item => item.bankCode).join(", ")
  const more = supported.length > 12 ? ` ... (+${supported.length - 12})` : ""
  return `Danh sách ngân hàng hỗ trợ deep-link (${supported.length}): ${names}${more}`
}

const helpMessage = () => {
  return [
    "Bạn có thể hỏi theo các dạng sau:",
    "- Mã lỗi: ví dụ \"95\", \"97\", \"00\"",
    "- Tham số: ví dụ \"vnp_OrderInfo\"",
    "- CSKH: ví dụ \"không nhận OTP\", \"ngân hàng bảo trì\"",
    "- Deep-link: ví dụ \"Vietcombank\", \"zalopay\"",
    "- Nền tảng go-live: ví dụ \"Haravan\", \"Sapo\""
  ].join("\n")
}

const buildErrorCodeReply = (code: string) => {
  const error = errorCodes.find(item => item.code === code)
  if (!error) return null
  return [
    `Mã lỗi: ${error.code}`,
    `Ngữ cảnh: ${error.api}`,
    `Mô tả: ${error.rootCause}`,
    `Hướng xử lý: ${error.merchantAction}`
  ].join("\n")
}

const buildTransactionStatusReply = (code: string) => {
  const status = transactionStatusCodes.find(item => item.code === code)
  if (!status) return null
  return [
    `Tình trạng giao dịch: ${status.code}`,
    `Mô tả: ${status.description}`,
    `Hướng xử lý: ${status.merchantAction}`
  ].join("\n")
}

const buildParamReply = (query: string) => {
  const q = normalize(query)
  const match = payParameters.find(item => normalize(item.name) === q)
  if (!match) return null
  return [
    `Tham số: ${match.name}`,
    `Bắt buộc: ${match.required ? "Có" : "Không"}`,
    `Cần encode: ${match.encodeRequired ? "Có" : "Không"}`,
    `Mô tả: ${match.description}`,
    `Lỗi thường gặp: ${match.commonMistakes}`
  ].join("\n")
}

const searchKnowledgeBase = (query: string) => {
  const q = normalize(query)
  const tokens = tokenize(query)
  if (q.length < 3) return []
  const scored = knowledgeBaseItems.map(item => {
    const haystack = [
      item.title,
      item.symptom,
      item.cause,
      item.resolution,
      ...(item.tags || [])
    ].join(" ")
    const text = normalize(haystack)
    let score = 0
    if (text.includes(q)) score += 5
    tokens.forEach(token => {
      if (text.includes(token)) score += 1
    })
    if ((item.relatedCodes || []).some(code => code === query)) score += 3
    if ((item.relatedParams || []).some(param => normalize(param).includes(q))) score += 2
    return { item, score }
  })
  return scored
    .filter(entry => entry.score >= 2)
    .sort((a, b) => b.score - a.score)
    .map(entry => entry.item)
}

const searchCustomerSupport = (query: string) => {
  const q = normalize(query)
  const tokens = tokenize(query)
  if (q.length < 3) return []
  const scored = customerSupportIssues.map(item => {
    const haystack = [
      item.title,
      item.symptom,
      ...(item.checks || []),
      ...(item.actions || [])
    ].join(" ")
    const text = normalize(haystack)
    let score = 0
    if (text.includes(q)) score += 4
    tokens.forEach(token => {
      if (text.includes(token)) score += 1
    })
    if ((item.relatedCodes || []).some(code => code === query)) score += 3
    return { item, score }
  })
  return scored
    .filter(entry => entry.score >= 2)
    .sort((a, b) => b.score - a.score)
    .map(entry => entry.item)
}

const searchPlatforms = (query: string) => {
  const q = normalize(query)
  return platformPartners.filter(item =>
    normalize(item.module).includes(q) ||
    normalize(item.note || "").includes(q)
  )
}

const searchDeepLinks = (query: string) => {
  const q = normalize(query)
  const tokens = tokenize(query)
  return deepLinkApps.filter(item =>
    normalize(item.bankCode).includes(q) ||
    normalize(item.appName).includes(q) ||
    normalize(item.iosScheme || "").includes(q) ||
    normalize(item.androidScheme || "").includes(q) ||
    tokens.some(token =>
      normalize(item.bankCode).includes(token) ||
      normalize(item.appName).includes(token)
    )
  )
}

type ExternalPage = { url: string; text: string }

const EXTERNAL_BASE_URL = "https://sandbox.vnpayment.vn/apis/"
const EXTERNAL_CACHE_TTL_MS = 6 * 60 * 60 * 1000

let externalCache: { fetchedAt: number; pages: ExternalPage[] } | null = null

const extractLinks = (html: string, baseUrl: string) => {
  const hrefRegex = /href="([^"]+)"/gi
  const links = new Set<string>()
  let match: RegExpExecArray | null
  while ((match = hrefRegex.exec(html)) !== null) {
    const raw = match[1]
    if (raw.startsWith("javascript:") || raw.startsWith("#") || raw.startsWith("mailto:")) {
      continue
    }
    try {
      const url = new URL(raw, baseUrl)
      if (!url.href.startsWith(EXTERNAL_BASE_URL)) continue
      links.add(url.href)
    } catch {
      // ignore invalid URLs
    }
  }
  return Array.from(links)
}

const stripHtml = (html: string) => {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

const fetchExternalKnowledge = async () => {
  if (externalCache && Date.now() - externalCache.fetchedAt < EXTERNAL_CACHE_TTL_MS) {
    return externalCache.pages
  }

  const baseRes = await fetch(EXTERNAL_BASE_URL, { cache: "no-store" })
  const baseHtml = await baseRes.text()
  const links = extractLinks(baseHtml, EXTERNAL_BASE_URL)

  const pages: ExternalPage[] = []
  const uniqueLinks = Array.from(new Set([EXTERNAL_BASE_URL, ...links]))

  for (const url of uniqueLinks) {
    try {
      const res = await fetch(url, { cache: "no-store" })
      const html = await res.text()
      pages.push({ url, text: stripHtml(html) })
    } catch {
      // skip failed fetch
    }
  }

  externalCache = { fetchedAt: Date.now(), pages }
  return pages
}

const searchExternal = async (query: string) => {
  const q = normalize(query)
  if (!q || q.length < 2) return []
  const pages = await fetchExternalKnowledge()
  const matches: { url: string; snippet: string }[] = []
  for (const page of pages) {
    const idx = normalize(page.text).indexOf(q)
    if (idx >= 0) {
      const start = Math.max(0, idx - 80)
      const end = Math.min(page.text.length, idx + 120)
      matches.push({
        url: page.url,
        snippet: page.text.slice(start, end).trim()
      })
    }
    if (matches.length >= 5) break
  }
  return matches
}

const isExternalPreferred = (text: string) => {
  const q = normalize(text)
  return [
    "api",
    "querydr",
    "refund",
    "token",
    "trả góp",
    "vnpay-qr",
    "vnpayment",
    "sandbox"
  ].some(t => q.includes(t))
}

const collectFiles = async (rootDir: string, extensions: string[]) => {
  const entries = await fs.readdir(rootDir, { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name)
    if (entry.isDirectory()) {
      if (["node_modules", ".next", ".git"].includes(entry.name)) continue
      const childFiles = await collectFiles(fullPath, extensions)
      files.push(...childFiles)
    } else if (extensions.some(ext => entry.name.endsWith(ext))) {
      files.push(fullPath)
    }
  }
  return files
}

const searchProjectFiles = async (query: string) => {
  const q = normalize(query)
  const qKey = normalizeKey(query)
  if (!q || q.length < 2) return []
  const tokens = tokenize(query)
  const root = process.cwd()
  const targetDirs = ["app", "components", "lib"]
  const extensions = [".ts", ".tsx", ".md", ".txt"]
  const allFiles: string[] = []
  for (const dir of targetDirs) {
    const fullDir = path.join(root, dir)
    try {
      const files = await collectFiles(fullDir, extensions)
      allFiles.push(...files)
    } catch {
      // ignore missing dirs
    }
  }

  const matches: { file: string; line: number; text: string }[] = []
  for (const file of allFiles) {
    const content = await fs.readFile(file, "utf8")
    const lines = content.split(/\r?\n/)
    lines.forEach((line, idx) => {
      const lineText = normalize(line)
      const lineKey = normalizeKey(line)
      const fileKey = normalizeKey(file)
      const tokenMatch = tokens.some(token => lineText.includes(token))
      if (
        lineText.includes(q) ||
        lineKey.includes(qKey) ||
        fileKey.includes(qKey) ||
        tokenMatch
      ) {
        matches.push({
          file: path.relative(root, file),
          line: idx + 1,
          text: line.trim()
        })
      }
    })
    if (matches.length >= 5) break
  }
  return matches.slice(0, 5)
}

export async function POST(req: Request) {
  try {
    const { message, history } = (await req.json()) as {
      message?: string
      history?: ChatMessage[]
    }

    if (!message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 })
    }

    const query = message.trim()
    const replies: string[] = []

    if (isGreeting(query)) {
      return NextResponse.json({
        reply: "Xin chào! Bạn muốn tra cứu mã lỗi, tham số hay vấn đề CSKH nào?"
      })
    }

    if (isSmalltalk(query)) {
      return NextResponse.json({
        reply: "Mình là chatbot hỗ trợ VNPAY. Bạn có thể hỏi mã lỗi, tham số, CSKH hoặc deep-link để mình tra cứu."
      })
    }

    if (isDeepLinkListQuery(query)) {
      return NextResponse.json({
        reply: buildDeepLinkListReply()
      })
    }

    if (isExternalPreferred(query)) {
      const externalMatches = await searchExternal(query)
      if (externalMatches.length > 0) {
        const first = externalMatches[0]
        replies.push(`Nguồn VNPAY APIs: ${first.url}\n${first.snippet}`)
      }
    }

    const codes = extractCodes(query)
    if (codes.length > 0) {
      const code = codes[0]
      const errorReply = buildErrorCodeReply(code)
      if (errorReply) replies.push(errorReply)
      const statusReply = buildTransactionStatusReply(code)
      if (statusReply) replies.push(statusReply)
    }

    const kbMatches = searchKnowledgeBase(query)
    if (kbMatches.length > 0) {
      const top = kbMatches[0]
      replies.push(`${top.title}\n${top.resolution}`)
    }

    const csMatches = searchCustomerSupport(query)
    if (csMatches.length > 0) {
      const top = csMatches[0]
      replies.push(`${top.title}\n${top.actions.join(" ")}`)
    }

    const deepLinkMatches = searchDeepLinks(query)
    if (deepLinkMatches.length > 0) {
      const top = deepLinkMatches[0]
      replies.push(
        `Ngân hàng: ${top.bankCode} — ${top.appName}\nHỗ trợ deep-link: ${top.deeplinkSupport ? "Có" : "Không"}`
      )
    }

    const paramReply = buildParamReply(query)
    if (paramReply) replies.push(paramReply)

    const platformMatches = searchPlatforms(query)
    if (platformMatches.length > 0) {
      const top = platformMatches[0]
      replies.push(`Nền tảng go-live: ${top.module}${top.note ? ` (${top.note})` : ""}`)
    }

    if (replies.length === 0) {
      if (isSourceSearch(query)) {
        const fileMatches = await searchProjectFiles(query)
        if (fileMatches.length > 0) {
          const first = fileMatches[0]
          replies.push(`Tìm thấy trong mã nguồn: ${first.file}:${first.line}\n${first.text}`)
        }
      }
    }

    if (replies.length === 0) {
      const externalMatches = await searchExternal(query)
      if (externalMatches.length > 0) {
        const first = externalMatches[0]
        replies.push(`Nguồn VNPAY APIs: ${first.url}\n${first.snippet}`)
      }
    }

    if (replies.length === 0) {
      return NextResponse.json({
        reply:
          "Chưa tìm thấy thông tin trong tri thức nội bộ.\n" +
          "Vui lòng liên hệ: kythuatctt@vnpay.vn\n\n" +
          helpMessage()
      })
    }

    return NextResponse.json({ reply: replies.join("\n\n") })
  } catch (error) {
    return NextResponse.json(
      { error: "Unexpected error", detail: String(error) },
      { status: 500 }
    )
  }
}
