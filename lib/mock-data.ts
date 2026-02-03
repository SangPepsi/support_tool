// PAY Web Integration Parameters
export interface PayParameter {
  name: string
  required: boolean
  encodeRequired: boolean
  description: string
  commonMistakes: string
  example?: string
}

export const payParameters: PayParameter[] = [
  {
    name: "vnp_Version",
    required: true,
    encodeRequired: false,
    description: "Version of the VNPAY API. Current version is 2.1.0",
    commonMistakes: "Using outdated version number",
    example: "2.1.0"
  },
  {
    name: "vnp_Command",
    required: true,
    encodeRequired: false,
    description: "API command. Use 'pay' for payment requests",
    commonMistakes: "Using wrong command value or case-sensitive errors",
    example: "pay"
  },
  {
    name: "vnp_TmnCode",
    required: true,
    encodeRequired: false,
    description: "Merchant terminal code provided by VNPAY",
    commonMistakes: "Using test TmnCode in production or vice versa",
    example: "DEMO1234"
  },
  {
    name: "vnp_Amount",
    required: true,
    encodeRequired: false,
    description: "Payment amount in VND, multiplied by 100 (no decimal)",
    commonMistakes: "Not multiplying by 100, or including decimal points",
    example: "1000000 (for 10,000 VND)"
  },
  {
    name: "vnp_CurrCode",
    required: true,
    encodeRequired: false,
    description: "Currency code. Currently only VND is supported",
    commonMistakes: "Using unsupported currency codes",
    example: "VND"
  },
  {
    name: "vnp_TxnRef",
    required: true,
    encodeRequired: true,
    description: "Unique transaction reference for each payment request",
    commonMistakes: "Reusing transaction reference, not ensuring uniqueness",
    example: "ORDER123456"
  },
  {
    name: "vnp_OrderInfo",
    required: true,
    encodeRequired: true,
    description: "Order description. Must be URL encoded",
    commonMistakes: "Not encoding special characters, exceeding max length",
    example: "Payment for order #123"
  },
  {
    name: "vnp_OrderType",
    required: true,
    encodeRequired: false,
    description: "Order category code",
    commonMistakes: "Using invalid order type codes",
    example: "other"
  },
  {
    name: "vnp_Locale",
    required: true,
    encodeRequired: false,
    description: "Language for payment page. Use 'vn' for Vietnamese, 'en' for English",
    commonMistakes: "Using unsupported locale values",
    example: "vn"
  },
  {
    name: "vnp_ReturnUrl",
    required: true,
    encodeRequired: true,
    description: "URL to redirect user after payment completion",
    commonMistakes: "Not encoding URL, using HTTP instead of HTTPS in production",
    example: "https://merchant.com/payment/return"
  },
  {
    name: "vnp_IpAddr",
    required: true,
    encodeRequired: false,
    description: "IP address of the customer making the payment",
    commonMistakes: "Using server IP instead of client IP, invalid IP format",
    example: "192.168.1.1"
  },
  {
    name: "vnp_CreateDate",
    required: true,
    encodeRequired: false,
    description: "Transaction creation timestamp in yyyyMMddHHmmss format",
    commonMistakes: "Wrong date format, using local time instead of UTC+7",
    example: "20240115153000"
  },
  {
    name: "vnp_ExpireDate",
    required: false,
    encodeRequired: false,
    description: "Payment expiration timestamp in yyyyMMddHHmmss format",
    commonMistakes: "Setting expiration time too short or in wrong format",
    example: "20240115160000"
  },
  {
    name: "vnp_BankCode",
    required: false,
    encodeRequired: false,
    description: "Bank code for direct bank selection. Leave empty to show bank selection page",
    commonMistakes: "Using incorrect bank codes",
    example: "NCB"
  },
  {
    name: "vnp_SecureHash",
    required: true,
    encodeRequired: false,
    description: "HMAC SHA512 hash for request verification. Generated from all parameters",
    commonMistakes: "Wrong hash algorithm, incorrect parameter sorting, encoding hash value",
    example: "abc123...def456"
  }
]

// Error Codes
export interface ErrorCode {
  id: string
  code: string
  api: string
  rootCause: string
  merchantAction: string
}

export const errorCodes: ErrorCode[] = [
  {
    id: "api-success-00",
    code: "00",
    api: "API Response (vnp_ResponseCode / vnp_DataResponseCode)",
    rootCause: "Thành công",
    merchantAction: "Ghi nhận giao dịch thành công và tiếp tục xử lý nghiệp vụ"
  },
  {
    id: "ipn-result-05",
    code: "05",
    api: "IPN Result (vnp_ResponseCode)",
    rootCause: "Tài khoản không đủ số dư để thực hiện giao dịch",
    merchantAction: "Hướng dẫn khách hàng kiểm tra số dư hoặc chọn phương thức khác"
  },
  {
    id: "ipn-result-06",
    code: "06",
    api: "IPN Result (vnp_ResponseCode)",
    rootCause: "Nhập sai mật khẩu xác thực (OTP)",
    merchantAction: "Yêu cầu khách hàng thực hiện lại giao dịch và nhập OTP đúng"
  },
  {
    id: "ipn-result-07",
    code: "07",
    api: "IPN Result (vnp_ResponseCode)",
    rootCause: "Trừ tiền thành công, giao dịch bị nghi ngờ",
    merchantAction: "Chờ merchant admin xác nhận từ chối/đồng ý giao dịch"
  },
  {
    id: "ipn-result-09",
    code: "09",
    api: "IPN Result (vnp_ResponseCode)",
    rootCause: "Thẻ/tài khoản chưa đăng ký Internet Banking",
    merchantAction: "Hướng dẫn khách hàng đăng ký Internet Banking tại ngân hàng"
  },
  {
    id: "ipn-result-10",
    code: "10",
    api: "IPN Result (vnp_ResponseCode)",
    rootCause: "Xác thực thông tin thẻ/tài khoản sai quá 3 lần",
    merchantAction: "Yêu cầu khách hàng kiểm tra lại thông tin hoặc dùng phương thức khác"
  },
  {
    id: "ipn-result-11",
    code: "11",
    api: "IPN Result (vnp_ResponseCode)",
    rootCause: "Hết thời gian chờ thanh toán",
    merchantAction: "Cho phép khách hàng thực hiện lại giao dịch"
  },
  {
    id: "ipn-result-12",
    code: "12",
    api: "IPN Result (vnp_ResponseCode)",
    rootCause: "Thẻ/tài khoản bị khóa",
    merchantAction: "Hướng dẫn khách hàng liên hệ ngân hàng để mở khóa"
  },
  {
    id: "ipn-result-24",
    code: "24",
    api: "IPN Result (vnp_ResponseCode)",
    rootCause: "Khách hàng hủy giao dịch",
    merchantAction: "Giữ trạng thái đơn hàng và cho phép thanh toán lại nếu cần"
  },
  {
    id: "ipn-result-79",
    code: "79",
    api: "IPN Result (vnp_ResponseCode)",
    rootCause: "Nhập sai mật khẩu thanh toán quá số lần quy định",
    merchantAction: "Yêu cầu khách hàng thực hiện lại giao dịch"
  },
  {
    id: "ipn-result-65",
    code: "65",
    api: "IPN Result (vnp_ResponseCode)",
    rootCause: "Tài khoản vượt hạn mức giao dịch trong ngày",
    merchantAction: "Đề nghị khách hàng thử lại vào ngày khác hoặc dùng tài khoản khác"
  },
  {
    id: "ipn-result-75",
    code: "75",
    api: "IPN Result (vnp_ResponseCode)",
    rootCause: "Ngân hàng thanh toán đang bảo trì",
    merchantAction: "Đề nghị khách hàng thử lại sau hoặc dùng ngân hàng khác"
  },
  {
    id: "ipn-result-99",
    code: "99",
    api: "IPN Result (vnp_ResponseCode)",
    rootCause: "Các lỗi khác (không có trong danh sách)",
    merchantAction: "Liên hệ VNPAY để được hỗ trợ"
  },
  {
    id: "ipn-ack-00",
    code: "00",
    api: "IPN Acknowledge (Merchant → VNPAY)",
    rootCause: "Ghi nhận giao dịch thành công",
    merchantAction: "Phản hồi IPN thành công theo đúng định dạng"
  },
  {
    id: "ipn-ack-01",
    code: "01",
    api: "IPN Acknowledge (Merchant → VNPAY)",
    rootCause: "Không tìm thấy mã đơn hàng",
    merchantAction: "Kiểm tra hệ thống đơn hàng và vnp_TxnRef"
  },
  {
    id: "ipn-ack-02",
    code: "02",
    api: "IPN Acknowledge (Merchant → VNPAY)",
    rootCause: "Yêu cầu đã được xử lý trước đó",
    merchantAction: "Trả về kết quả đã xử lý (idempotent)"
  },
  {
    id: "ipn-ack-03",
    code: "03",
    api: "IPN Acknowledge (Merchant → VNPAY)",
    rootCause: "Địa chỉ IP không được phép truy cập",
    merchantAction: "Kiểm tra whitelist IP nếu có cấu hình"
  },
  {
    id: "ipn-ack-97",
    code: "97",
    api: "IPN Acknowledge (Merchant → VNPAY)",
    rootCause: "Sai chữ ký (checksum không khớp)",
    merchantAction: "Kiểm tra secret key và cách tạo checksum"
  },
  {
    id: "ipn-ack-99",
    code: "99",
    api: "IPN Acknowledge (Merchant → VNPAY)",
    rootCause: "Lỗi hệ thống",
    merchantAction: "Ghi log, thử lại và liên hệ VNPAY nếu cần"
  },
  {
    id: "query-02",
    code: "02",
    api: "Query (vnp_Command=querydr)",
    rootCause: "Merchant không hợp lệ (vnp_TmnCode không đúng)",
    merchantAction: "Kiểm tra lại vnp_TmnCode"
  },
  {
    id: "query-03",
    code: "03",
    api: "Query (vnp_Command=querydr)",
    rootCause: "Dữ liệu gửi sang không đúng định dạng",
    merchantAction: "Kiểm tra định dạng dữ liệu và kiểu dữ liệu gửi lên"
  },
  {
    id: "query-08",
    code: "08",
    api: "Query (vnp_Command=querydr)",
    rootCause: "Hệ thống đang bảo trì",
    merchantAction: "Thử lại sau hoặc theo dõi thông báo từ VNPAY"
  },
  {
    id: "query-91",
    code: "91",
    api: "Query (vnp_Command=querydr)",
    rootCause: "Không tìm thấy giao dịch yêu cầu",
    merchantAction: "Kiểm tra lại mã giao dịch và thời điểm truy vấn"
  },
  {
    id: "query-97",
    code: "97",
    api: "Query (vnp_Command=querydr)",
    rootCause: "Chữ ký không hợp lệ",
    merchantAction: "Kiểm tra secret key và chuỗi dữ liệu ký"
  },
  {
    id: "query-99",
    code: "99",
    api: "Query (vnp_Command=querydr)",
    rootCause: "Các lỗi khác (không có trong danh sách)",
    merchantAction: "Liên hệ VNPAY để được hỗ trợ"
  },
  {
    id: "refund-02",
    code: "02",
    api: "Refund (vnp_Command=refund)",
    rootCause: "Merchant không hợp lệ (vnp_TmnCode không đúng)",
    merchantAction: "Kiểm tra lại vnp_TmnCode"
  },
  {
    id: "refund-03",
    code: "03",
    api: "Refund (vnp_Command=refund)",
    rootCause: "Dữ liệu gửi sang không đúng định dạng",
    merchantAction: "Kiểm tra định dạng dữ liệu và kiểu dữ liệu gửi lên"
  },
  {
    id: "refund-08",
    code: "08",
    api: "Refund (vnp_Command=refund)",
    rootCause: "Hệ thống đang bảo trì",
    merchantAction: "Thử lại sau hoặc theo dõi thông báo từ VNPAY"
  },
  {
    id: "refund-16",
    code: "16",
    api: "Refund (vnp_Command=refund)",
    rootCause: "Không thực hiện được hoàn tiền trong thời gian này",
    merchantAction: "Thử lại sau hoặc liên hệ VNPAY"
  },
  {
    id: "refund-91",
    code: "91",
    api: "Refund (vnp_Command=refund)",
    rootCause: "Không tìm thấy giao dịch yêu cầu hoàn trả",
    merchantAction: "Kiểm tra lại thông tin giao dịch và mã tham chiếu"
  },
  {
    id: "refund-93",
    code: "93",
    api: "Refund (vnp_Command=refund)",
    rootCause: "Số tiền hoàn trả không hợp lệ",
    merchantAction: "Đảm bảo số tiền hoàn ≤ số tiền thanh toán"
  },
  {
    id: "refund-94",
    code: "94",
    api: "Refund (vnp_Command=refund)",
    rootCause: "Giao dịch đã gửi yêu cầu hoàn tiền trước đó",
    merchantAction: "Không gửi lại, theo dõi trạng thái xử lý"
  },
  {
    id: "refund-95",
    code: "95",
    api: "Refund (vnp_Command=refund)",
    rootCause: "Giao dịch không thành công bên VNPAY, từ chối xử lý",
    merchantAction: "Tra soát giao dịch và liên hệ VNPAY"
  },
  {
    id: "refund-97",
    code: "97",
    api: "Refund (vnp_Command=refund)",
    rootCause: "Chữ ký không hợp lệ",
    merchantAction: "Kiểm tra secret key và chuỗi dữ liệu ký"
  },
  {
    id: "refund-99",
    code: "99",
    api: "Refund (vnp_Command=refund)",
    rootCause: "Các lỗi khác (không có trong danh sách)",
    merchantAction: "Liên hệ VNPAY để được hỗ trợ"
  },
  {
    id: "refund-batch-res-02",
    code: "02",
    api: "Refund Batch ResponseCode (vnp_Command=refundbatch)",
    rootCause: "Merchant không hợp lệ (vnp_TmnCode không đúng)",
    merchantAction: "Kiểm tra lại vnp_TmnCode"
  },
  {
    id: "refund-batch-res-03",
    code: "03",
    api: "Refund Batch ResponseCode (vnp_Command=refundbatch)",
    rootCause: "Dữ liệu gửi sang không đúng định dạng",
    merchantAction: "Kiểm tra định dạng dữ liệu và kiểu dữ liệu gửi lên"
  },
  {
    id: "refund-batch-res-08",
    code: "08",
    api: "Refund Batch ResponseCode (vnp_Command=refundbatch)",
    rootCause: "Hệ thống đang bảo trì",
    merchantAction: "Thử lại sau hoặc theo dõi thông báo từ VNPAY"
  },
  {
    id: "refund-batch-res-94",
    code: "94",
    api: "Refund Batch ResponseCode (vnp_Command=refundbatch)",
    rootCause: "Yêu cầu hoàn theo lô đã được gửi trước đó",
    merchantAction: "Không gửi lại, theo dõi trạng thái xử lý"
  },
  {
    id: "refund-batch-res-97",
    code: "97",
    api: "Refund Batch ResponseCode (vnp_Command=refundbatch)",
    rootCause: "Chữ ký không hợp lệ",
    merchantAction: "Kiểm tra secret key và chuỗi dữ liệu ký"
  },
  {
    id: "refund-batch-res-99",
    code: "99",
    api: "Refund Batch ResponseCode (vnp_Command=refundbatch)",
    rootCause: "Các lỗi khác (không có trong danh sách)",
    merchantAction: "Liên hệ VNPAY để được hỗ trợ"
  },
  {
    id: "refund-batch-data-16",
    code: "16",
    api: "Refund Batch DataResponseCode (vnp_Command=refundbatch)",
    rootCause: "Không thực hiện được hoàn tiền trong thời gian này",
    merchantAction: "Thử lại sau hoặc liên hệ VNPAY"
  },
  {
    id: "refund-batch-data-91",
    code: "91",
    api: "Refund Batch DataResponseCode (vnp_Command=refundbatch)",
    rootCause: "Không tìm thấy giao dịch yêu cầu hoàn trả",
    merchantAction: "Kiểm tra lại thông tin giao dịch và mã tham chiếu"
  },
  {
    id: "refund-batch-data-93",
    code: "93",
    api: "Refund Batch DataResponseCode (vnp_Command=refundbatch)",
    rootCause: "Số tiền hoàn trả không hợp lệ",
    merchantAction: "Đảm bảo số tiền hoàn ≤ số tiền thanh toán"
  },
  {
    id: "refund-batch-data-94",
    code: "94",
    api: "Refund Batch DataResponseCode (vnp_Command=refundbatch)",
    rootCause: "Giao dịch đã được gửi yêu cầu hoàn tiền trước đó",
    merchantAction: "Không gửi lại, theo dõi trạng thái xử lý"
  },
  {
    id: "refund-batch-data-95",
    code: "95",
    api: "Refund Batch DataResponseCode (vnp_Command=refundbatch)",
    rootCause: "Giao dịch không thành công bên VNPAY, từ chối xử lý",
    merchantAction: "Tra soát giao dịch và liên hệ VNPAY"
  },
  {
    id: "refund-batch-data-99",
    code: "99",
    api: "Refund Batch DataResponseCode (vnp_Command=refundbatch)",
    rootCause: "Các lỗi khác (không có trong danh sách)",
    merchantAction: "Liên hệ VNPAY để được hỗ trợ"
  }
]

// Transaction Status Codes
export interface TransactionStatusCode {
  code: string
  description: string
  merchantAction: string
}

export const transactionStatusCodes: TransactionStatusCode[] = [
  {
    code: "00",
    description: "Giao dịch thành công",
    merchantAction: "Ghi nhận thanh toán thành công"
  },
  {
    code: "01",
    description: "Giao dịch chưa hoàn tất",
    merchantAction: "Chờ kết quả cuối, không giao hàng"
  },
  {
    code: "02",
    description: "Giao dịch bị lỗi",
    merchantAction: "Kiểm tra chi tiết giao dịch và tra soát nếu cần"
  },
  {
    code: "04",
    description: "Giao dịch đảo (khách bị trừ tiền nhưng GD chưa thành công)",
    merchantAction: "Theo dõi hoàn tiền hoặc tra soát với VNPAY"
  },
  {
    code: "05",
    description: "VNPAY đang xử lý giao dịch hoàn tiền",
    merchantAction: "Chờ VNPAY xử lý hoàn tiền"
  },
  {
    code: "06",
    description: "VNPAY đã gửi yêu cầu hoàn tiền sang ngân hàng",
    merchantAction: "Chờ ngân hàng phản hồi"
  },
  {
    code: "07",
    description: "Giao dịch bị nghi ngờ gian lận",
    merchantAction: "Tạm ngưng xử lý và kiểm tra thêm"
  },
  {
    code: "08",
    description: "Giao dịch quá thời gian thanh toán",
    merchantAction: "Cho phép khách hàng thanh toán lại nếu cần"
  },
  {
    code: "09",
    description: "Giao dịch hoàn trả bị từ chối",
    merchantAction: "Thông báo cho khách và tra soát"
  },
  {
    code: "10",
    description: "Đã giao hàng",
    merchantAction: "Ghi nhận trạng thái giao hàng"
  },
  {
    code: "11",
    description: "Giao dịch bị hủy",
    merchantAction: "Hủy đơn và cập nhật trạng thái"
  },
  {
    code: "20",
    description: "Giao dịch đã được thanh quyết toán cho merchant",
    merchantAction: "Đối soát và ghi nhận đã thanh quyết toán"
  }
]

// Internal Knowledge Base
export interface KnowledgeBaseItem {
  id: string
  title: string
  tags: string[]
  symptom: string
  cause: string
  resolution: string
  relatedCodes?: string[]
  relatedParams?: string[]
}

export const knowledgeBaseItems: KnowledgeBaseItem[] = [
  {
    id: "kb-duplicate-ipn",
    title: "IPN gửi lặp nhiều lần",
    tags: ["IPN", "Idempotency", "Webhook"],
    symptom: "Đơn hàng bị cập nhật nhiều lần khi VNPAY gọi IPN",
    cause: "IPN có thể retry nếu merchant phản hồi chậm hoặc lỗi",
    resolution: "Thiết kế handler idempotent theo vnp_TxnRef + vnp_TransactionNo",
    relatedCodes: ["02"],
    relatedParams: ["vnp_TxnRef", "vnp_TransactionNo"]
  },
  {
    id: "kb-checksum-mismatch",
    title: "Checksum không khớp",
    tags: ["Checksum", "Encoding"],
    symptom: "VNPAY trả 97 hoặc merchant verify thất bại",
    cause: "Sai secret key, sai sort, hoặc encode không đúng",
    resolution: "Sort key A→Z, bỏ vnp_SecureHash/Type, encode value đúng RFC 3986",
    relatedCodes: ["97"],
    relatedParams: ["vnp_SecureHash", "vnp_SecureHashType"]
  },
  {
    id: "kb-amount-format",
    title: "Sai định dạng vnp_Amount",
    tags: ["Format", "Payment"],
    symptom: "Giao dịch thất bại hoặc sai số tiền",
    cause: "Gửi số tiền có dấu chấm hoặc không nhân 100",
    resolution: "Luôn gửi số tiền VND * 100, không có dấu thập phân",
    relatedParams: ["vnp_Amount"]
  },
  {
    id: "kb-orderinfo-encoding",
    title: "vnp_OrderInfo encode sai",
    tags: ["Encoding", "QueryString"],
    symptom: "Checksum mismatch hoặc nội dung bị lỗi hiển thị",
    cause: "Encode sai dấu cách hoặc ký tự đặc biệt",
    resolution: "Encode UTF-8, space dùng + cho vnp_OrderInfo theo spec",
    relatedParams: ["vnp_OrderInfo"]
  },
  {
    id: "kb-gradle-maven",
    title: "Lỗi không tìm thấy thư viện do maven (Gradle 7.x)",
    tags: ["SDK", "Android", "Gradle", "Maven"],
    symptom: "Không tìm thấy thư viện khi build Android với Gradle 7.x",
    cause: "Cấu hình maven/aar chưa đúng theo yêu cầu SDK",
    resolution:
      "1) Đổi maven -> maven-publish trong /AwesomeProject/react-native-vnpay-merchant/android/build.gradle. " +
      "2) Bỏ implementation(name: 'merchant-1.0.25', ext: 'aar'), chuyển sang implementation files('libs/merchant-1.0.25.aar') và comment 2 đoạn code liên quan. " +
      "3) Tạo thư mục /react-native-vnpay-merchant/android/libs và /android/src/libs, copy merchant-1.0.25.aar. " +
      "4) Config lại /AwesomeProject/android/build.gradle. " +
      "5) Copy /react-native-vnpay-merchant/android/libs vào /android/app/libs và /android/libs."
  }
]

// Go-live Platform Partners
export interface PlatformPartner {
  module: string
  note?: string
}

export const platformPartners: PlatformPartner[] = [
  { module: "Payment Link" },
  { module: "Haravan" },
  { module: "Nexpando" },
  { module: "Sapo" },
  { module: "XeCa" },
  { module: "Vban" },
  { module: "PKH" },
  { module: "shopify" },
  { module: "Vitda" },
  { module: "Zozo" },
  { module: "P.A (web30s)" },
  { module: "Salemall (checkout.vn)" },
  { module: "Nhanh.vn" },
  { module: "HECWIN" },
  { module: "IM Group" },
  { module: "Teko" },
  { module: "LadiPage" },
  { module: "Maybay.net" },
  { module: "CNV loyalty" },
  { module: "ezCloud" },
  { module: "PSC" },
  { module: "ASC" },
  { module: "ONSHOP" },
  { module: "Savista - Salink" },
  { module: "An Vui" },
  { module: "Vexere" },
  { module: "Abaha" },
  { module: "CYHOME" },
  { module: "VinHMS" },
  { module: "MobiTRIP" },
  { module: "Gosell", note: "Mediastep" },
  { module: "Edubit", note: "UNICA" },
  { module: "Pos Pancake" },
  { module: "Hoola" },
  { module: "Analy" },
  { module: "T4tek.co" },
  { module: "ZamiApp" },
  { module: "DG1" },
  { module: "Web Minh Thuận" },
  { module: "Sipos.vn", note: "REDSUN" },
  { module: "DigiBird" },
  { module: "Kingpro" },
  { module: "EVOTECH" },
  { module: "Storecake", note: "Webcake" }
]

// Customer Support Common Issues
export interface CustomerSupportIssue {
  id: string
  title: string
  symptom: string
  checks: string[]
  actions: string[]
  relatedCodes?: string[]
}

export const customerSupportIssues: CustomerSupportIssue[] = [
  {
    id: "cs-otp-wrong",
    title: "Nhập sai OTP",
    symptom: "Khách báo giao dịch thất bại do OTP sai",
    checks: ["Xác nhận khách đã nhập đúng OTP", "Kiểm tra code 06/10 nếu có"],
    actions: ["Yêu cầu khách thực hiện lại giao dịch", "Khuyến nghị dùng phương thức khác nếu lặp lại"],
    relatedCodes: ["06", "10"]
  },
  {
    id: "cs-otp-missing",
    title: "Không nhận được OTP",
    symptom: "Khách không nhận OTP hoặc nhận chậm",
    checks: ["Kiểm tra SMS/Push của ngân hàng", "Xác nhận số điện thoại đăng ký"],
    actions: ["Đề nghị khách thử lại sau vài phút", "Chuyển sang phương thức khác nếu vẫn lỗi"]
  },
  {
    id: "cs-bank-maintenance",
    title: "Ngân hàng bảo trì",
    symptom: "Khách thanh toán không được, báo lỗi ngân hàng",
    checks: ["Kiểm tra code 75/08", "Xác minh ngân hàng đang bảo trì"],
    actions: ["Khuyến nghị khách thử lại sau", "Chọn ngân hàng khác"],
    relatedCodes: ["75", "08"]
  },
  {
    id: "cs-insufficient-balance",
    title: "Không đủ số dư",
    symptom: "Giao dịch thất bại do số dư không đủ",
    checks: ["Kiểm tra code 05/51"],
    actions: ["Hướng dẫn khách nạp thêm tiền hoặc dùng phương thức khác"],
    relatedCodes: ["05", "51"]
  },
  {
    id: "cs-daily-limit",
    title: "Vượt hạn mức giao dịch",
    symptom: "Khách bị từ chối do vượt hạn mức ngày",
    checks: ["Kiểm tra code 65"],
    actions: ["Khuyến nghị khách thử lại ngày hôm sau hoặc dùng tài khoản khác"],
    relatedCodes: ["65"]
  },
  {
    id: "cs-cancelled",
    title: "Khách hủy giao dịch",
    symptom: "Khách quay lại và thấy trạng thái hủy",
    checks: ["Kiểm tra code 24", "Xác nhận khách đã bấm hủy"],
    actions: ["Cho phép khách thanh toán lại nếu muốn"],
    relatedCodes: ["24"]
  },
  {
    id: "cs-timeout",
    title: "Hết thời gian thanh toán",
    symptom: "Giao dịch timeout",
    checks: ["Kiểm tra code 11/08", "Xác nhận khách không hoàn tất trong thời gian cho phép"],
    actions: ["Đề nghị khách thực hiện lại giao dịch"],
    relatedCodes: ["11", "08"]
  },
  {
    id: "cs-reversed",
    title: "Bị trừ tiền nhưng đơn chưa cập nhật",
    symptom: "Khách báo trừ tiền nhưng đơn hàng chưa thành công",
    checks: ["Kiểm tra vnp_TransactionStatus = 04", "Đối soát IPN/Querydr"],
    actions: ["Theo dõi hoàn tiền hoặc tra soát với VNPAY"],
    relatedCodes: ["04"]
  },
  {
    id: "cs-signature",
    title: "Sai chữ ký",
    symptom: "Merchant báo checksum không khớp",
    checks: ["Kiểm tra secret key", "Kiểm tra quy tắc ký và encoding"],
    actions: ["So khớp chuỗi ký, loại bỏ vnp_SecureHash/Type trước khi ký"],
    relatedCodes: ["97"]
  },
  {
    id: "cs-refund-delay",
    title: "Hoàn tiền chậm",
    symptom: "Khách chưa nhận được tiền hoàn",
    checks: ["Kiểm tra vnp_TransactionStatus 05/06", "Kiểm tra kết quả refund"],
    actions: ["Thông báo thời gian xử lý, theo dõi trạng thái với ngân hàng"],
    relatedCodes: ["05", "06"]
  }
]

// Deep-link Scheme List
export interface DeepLinkApp {
  no: number
  bankCode: string
  appName: string
  deeplinkSupport: boolean
  iosScheme?: string
  iosPackId?: string
  androidScheme?: string
  androidPackId?: string
  androidAppLink?: string
  iosAppLink?: string
  logoLink?: string
  category: "deeplink" | "qr-only"
}

export const deepLinkApps: DeepLinkApp[] = [
  {
    no: 1,
    bankCode: "VIETCOMBANK",
    appName: "VCB Digibank",
    deeplinkSupport: true,
    iosScheme: "vietcombankmobile",
    iosPackId: "id561433133",
    androidScheme: "vietcombankmobile",
    androidPackId: "com.VCB",
    androidAppLink: "https://play.google.com/store/apps/details?id=com.VCB",
    iosAppLink: "https://itunes.apple.com/vn/app/vietcombank/id561433133?mt=8",
    logoLink: "https://pay.vnpay.vn/images/bank/qr-vietcombank.png",
    category: "deeplink"
  },
  {
    no: 2,
    bankCode: "AGRIBANK",
    appName: "Agribank Plus",
    deeplinkSupport: true,
    iosScheme: "agribankmobile",
    iosPackId: "id935944952",
    androidScheme: "agribankmobile",
    androidPackId: "com.vnpay.Agribank3g",
    androidAppLink: "https://play.google.com/store/apps/details?id=com.vnpay.Agribank3g",
    iosAppLink: "https://itunes.apple.com/vn/app/agribank-e-mobile-banking/id935944952?mt=8",
    logoLink: "https://pay.vnpay.vn/images/bank/qr-agribank.png",
    category: "deeplink"
  },
  {
    no: 3,
    bankCode: "BIDV",
    appName: "BIDV SmartBanking",
    deeplinkSupport: true,
    iosScheme: "bidvsmartbanking",
    iosPackId: "id1061867449",
    androidScheme: "bidvsmartbanking",
    androidPackId: "com.vnpay.bidv",
    androidAppLink: "https://play.google.com/store/apps/details?id=com.vnpay.bidv",
    iosAppLink: "https://itunes.apple.com/vn/app/bidv-smart-banking/id1061867449?mt=8",
    logoLink: "https://pay.vnpay.vn/images/bank/qr-bidv.png",
    category: "deeplink"
  },
  {
    no: 4,
    bankCode: "VIETINBANK",
    appName: "VietinBank iPay",
    deeplinkSupport: true,
    iosScheme: "vietinbankmobile",
    iosPackId: "id689963454",
    androidScheme: "vietinbankmobile",
    androidPackId: "com.vietinbank.ipay",
    androidAppLink: "https://play.google.com/store/apps/details?id=com.vietinbank.ipay",
    iosAppLink: "https://itunes.apple.com/vn/app/vietinbank-ipay/id689963454?mt=8",
    logoLink: "https://pay.vnpay.vn/images/bank/qr-ipay.png",
    category: "deeplink"
  },
  {
    no: 5,
    bankCode: "VNPAYEWALLET",
    appName: "VNPAY App",
    deeplinkSupport: true,
    iosScheme: "f5smartaccount",
    iosPackId: "vn.vnpay.smartacccount",
    androidScheme: "f5smartaccount",
    androidPackId: "vnpay.smartacccount",
    androidAppLink: "https://play.google.com/store/apps/details?id=vnpay.smartacccount",
    iosAppLink: "https://apps.apple.com/us/app/v%C3%AD-vnpay/id1470378562",
    logoLink: "https://pay.vnpay.vn/images/bank/qr-vnpayewallet.png",
    category: "deeplink"
  },
  {
    no: 6,
    bankCode: "VPBANK",
    appName: "VPBank NEO",
    deeplinkSupport: true,
    iosScheme: "vpbankneo://vnpay?qrContent=",
    iosPackId: "IOS_PACKID",
    androidScheme: "vpbankneo://vnpay?qrContent=",
    androidPackId: "com.vnpay.vpbankonline",
    androidAppLink: "https://play.google.com/store/apps/details?id=com.vnpay.vpbankonline",
    iosAppLink: "https://apps.apple.com/vn/app/vpbank-online/id1209349510?l=vi",
    logoLink: "https://pay.vnpay.vn/images/bank/qr-vpbank.png",
    category: "deeplink"
  },
  {
    no: 7,
    bankCode: "SCB",
    appName: "SCB Mobile Banking",
    deeplinkSupport: true,
    iosScheme: "scbmobilebanking",
    iosPackId: "id954973621",
    androidScheme: "scbmobilebanking",
    androidPackId: "com.vnpay.SCB",
    androidAppLink: "https://play.google.com/store/apps/details?id=com.vnpay.SCB",
    iosAppLink: "https://itunes.apple.com/vn/app/scb-mobile-banking/id954973621?mt=8",
    logoLink: "https://pay.vnpay.vn/images/bank/qr-scb.png",
    category: "deeplink"
  },
  {
    no: 8,
    bankCode: "IVB",
    appName: "IVB Mobile Banking",
    deeplinkSupport: true,
    iosScheme: "ivbmobilebanking",
    iosPackId: "id1096963960",
    androidScheme: "ivbmobilebanking",
    androidPackId: "com.vnpay.ivb",
    androidAppLink: "https://play.google.com/store/apps/details?id=com.vnpay.ivb",
    iosAppLink: "https://itunes.apple.com/vn/app/ivb-mobile/id1096963960?mt=8",
    logoLink: "https://pay.vnpay.vn/images/bank/qr-ivb.png",
    category: "deeplink"
  },
  {
    no: 9,
    bankCode: "VIETBANK",
    appName: "Vietbank Digital",
    deeplinkSupport: true,
    iosScheme: "vietbankmobilebanking",
    iosPackId: "vnpay.vn.vietbank",
    androidScheme: "vietbankmobilebanking",
    androidPackId: "com.vnpay.vietbank",
    androidAppLink: "https://play.google.com/store/apps/details?id=com.vnpay.vietbank",
    iosAppLink: "https://itunes.apple.com/vn/app/id1469883896?ls=1&mt=8",
    logoLink: "https://pay.vnpay.vn/images/bank/qr-vietbank.png",
    category: "deeplink"
  },
  {
    no: 10,
    bankCode: "EXIMBANKOMNI",
    appName: "Eximbank Edigi",
    deeplinkSupport: true,
    iosScheme: "com.vnpay.eximbankomnimobile",
    iosPackId: "#",
    androidScheme: "eximbankomnimobile",
    androidPackId: "com.vnpay.EximBankOmni",
    androidAppLink: "https://play.google.com/store/apps/details?id=com.vnpay.EximBankOmni",
    iosAppLink: "https://apps.apple.com/vn/app/eximbank-edigi/id1571427361",
    logoLink: "https://pay.vnpay.vn/images/bank/qr-eximbankomni.png",
    category: "deeplink"
  },
  {
    no: 11,
    bankCode: "BAOVIETBANK",
    appName: "BAOVIET Smart",
    deeplinkSupport: true,
    iosScheme: "baovietmobile",
    iosPackId: "com.vnpay.baovietbank",
    androidScheme: "baovietmobile",
    androidPackId: "com.vnpay.bvbank",
    androidAppLink: "https://play.google.com/store/apps/details?id=com.vnpay.bvbank",
    iosAppLink: "https://apps.apple.com/tt/app/baoviet-smart/id1504422967?ign-mpt=uo%3D2",
    logoLink: "https://pay.vnpay.vn/images/bank/qr-baovietbank.png",
    category: "deeplink"
  },
  {
    no: 12,
    bankCode: "HDBANK",
    appName: "HDBank",
    deeplinkSupport: true,
    iosScheme: "hdbankmobile",
    iosPackId: "id510956975",
    androidScheme: "hdbankmobile",
    androidPackId: "com.vnpay.hdbank",
    androidAppLink: "https://play.google.com/store/apps/details?id=com.vnpay.hdbank&gl=US",
    iosAppLink: "https://apps.apple.com/vn/app/hdbank/id1461658565",
    logoLink: "https://pay.vnpay.vn/images/bank/qr-hdbank.png",
    category: "deeplink"
  },
  {
    no: 13,
    bankCode: "SAIGONBANK",
    appName: "SAIGONBANK SmartBanking",
    deeplinkSupport: true,
    iosScheme: "saigonbankmobilebanking",
    iosPackId: "com.vnpay.sgbank",
    androidScheme: "Sgbmobile",
    androidPackId: "com.vnpay.sgbank",
    androidAppLink: "https://play.google.com/store/apps/details?id=com.vnpay.sgbank",
    iosAppLink: "https://apps.apple.com/vn/app/saigonbank-smart-banking/id1481832587",
    logoLink: "https://pay.vnpay.vn/images/bank/qr-saigonbank.png",
    category: "deeplink"
  },
  {
    no: 14,
    bankCode: "BIDC",
    appName: "BIDC Mobile Banking",
    deeplinkSupport: true,
    iosScheme: "bidcvnmobile",
    iosPackId: "id1043501726",
    androidScheme: "bidcvnmobile",
    androidPackId: "com.vnpay.bidc",
    androidAppLink: "https://play.google.com/store/apps/details?id=com.vnpay.bidc",
    iosAppLink: "https://apps.apple.com/hu/app/bidc-mobile-banking-viet-nam/id1043501726",
    logoLink: "https://pay.vnpay.vn/images/bank/qr-bidc.png",
    category: "deeplink"
  },
  {
    no: 15,
    bankCode: "VIETABANK",
    appName: "VIETABANK",
    deeplinkSupport: true,
    iosScheme: "vietaomni",
    iosPackId: "com.vn.vietaomni",
    androidScheme: "vietaomni",
    androidPackId: "com.vn.vietaomni",
    androidAppLink: "https://play.google.com/store/apps/details?id=com.vn.vietaomni",
    iosAppLink: "https://apps.apple.com/vn/app/vietabank/id6744814738",
    logoLink: "https://pay.vnpay.vn/images/bank/qr-vietabank.png",
    category: "deeplink"
  },
  {
    no: 16,
    bankCode: "VIB",
    appName: "MyVIB",
    deeplinkSupport: true,
    iosScheme: "vibvnpayqr9999",
    iosPackId: "com.vib.myvib2prod",
    androidScheme: "vibvnpayqr9999",
    androidPackId: "com.vib.myvib2",
    androidAppLink: "https://play.google.com/store/apps/details?id=com.vib.myvib2&hl=vi",
    iosAppLink: "https://apps.apple.com/vn/app/myvib/id1626624790",
    logoLink: "https://pay.vnpay.vn/images/bank/qr-vib.png",
    category: "deeplink"
  },
  {
    no: 17,
    bankCode: "SHINHANBANK",
    appName: "Shinhan SOL Vietnam",
    deeplinkSupport: true,
    iosScheme: "shinhanglbvnbank",
    iosPackId: "com.shinhan.global.vn.bank",
    androidScheme: "shinhanglbvnbank",
    androidPackId: "com.shinhan.global.vn.bank",
    androidAppLink: "https://play.google.com/store/apps/details?id=com.shinhan.global.vn.bank&hl=vi&gl=US",
    iosAppLink: "https://apps.apple.com/us/app/shinhan-sol-vietnam/id1071033810",
    logoLink: "https://pay.vnpay.vn/images/bank/qr-shinhanbank.png",
    category: "deeplink"
  },
  {
    no: 18,
    bankCode: "COOPBANK",
    appName: "Co-opBank Mobile Banking",
    deeplinkSupport: true,
    iosScheme: "coopbankmobile",
    iosPackId: "com.vnpay.coopbank",
    androidScheme: "coopbankmobile",
    androidPackId: "com.vnpay.coopbank",
    androidAppLink: "https://play.google.com/store/apps/details?id=com.vnpay.coopbank&gl=US",
    iosAppLink: "https://apps.apple.com/vn/app/co-opbank-mobile-banking/id1578445811?l=vi",
    logoLink: "https://pay.vnpay.vn/images/bank/qr-coopbank.png",
    category: "deeplink"
  },
  {
    no: 19,
    bankCode: "VBSP",
    appName: "VBSP SmartBanking",
    deeplinkSupport: true,
    iosScheme: "vbspmobile",
    iosPackId: "com.vnpay.NHCSXH",
    androidScheme: "vbspmobile",
    androidPackId: "com.vnpay.NHCSXH",
    androidAppLink: "https://play.google.com/store/apps/details?id=com.vnpay.NHCSXH&hl=vi&gl=US",
    iosAppLink: "https://apps.apple.com/nl/app/vbsp-smartbanking/id1606153938",
    logoLink: "https://pay.vnpay.vn/images/bank/qr-vbsp.png",
    category: "deeplink"
  },
  {
    no: 20,
    bankCode: "CBBANK",
    appName: "CBway",
    deeplinkSupport: true,
    iosScheme: "cbbank",
    iosPackId: "cbbank.vn.mobile",
    androidScheme: "cbbank",
    androidPackId: "cbbank.vn.mobile",
    androidAppLink: "https://play.google.com/store/apps/details?id=cbbank.vn.mobile",
    iosAppLink: "https://apps.apple.com/vn/app/cbway/id1531443181",
    logoLink: "https://pay.vnpay.vn/images/bank/qr-cbbank.png",
    category: "deeplink"
  },
  {
    no: 21,
    bankCode: "PGBANK",
    appName: "PGBBank App",
    deeplinkSupport: true,
    iosScheme: "pgbankmobile",
    iosPackId: "pgbankApp.pgbank.com.vn",
    androidScheme: "pgb",
    androidPackId: "pgbankApp.pgbank.com.vn",
    androidAppLink: "https://play.google.com/store/apps/details?id=pgbankApp.pgbank.com.vn",
    iosAppLink: "https://apps.apple.com/th/app/pg-bank-flexi-app/id1537765475",
    logoLink: "https://pay.vnpay.vn/images/bank/qr-pgbank.png",
    category: "deeplink"
  },
  {
    no: 22,
    bankCode: "VIDBANK",
    appName: "PB engage VN",
    deeplinkSupport: true,
    iosScheme: "publicbankmobile",
    iosPackId: "com.vnpay.publicbank",
    androidScheme: "publicbankmobile",
    androidPackId: "com.vnpay.publicbank",
    androidAppLink: "https://play.google.com/store/apps/details?id=com.vnpay.publicbank&hl=vi",
    iosAppLink: "https://apps.apple.com/us/app/id1573736472",
    logoLink: "https://pay.vnpay.vn/images/bank/qr-vidbank.png",
    category: "deeplink"
  },
  {
    no: 23,
    bankCode: "KIENLONGBANK",
    appName: "KienLongBank Plus",
    deeplinkSupport: true,
    iosScheme: "ksbank",
    iosPackId: "#",
    androidScheme: "ksbank",
    androidPackId: "com.sunshine.ksbank",
    androidAppLink: "https://play.google.com/store/apps/details?id=com.sunshine.ksbank&hl=en",
    iosAppLink: "https://apps.apple.com/vn/app/kienlongbank-mobile-banking/id1492432328",
    logoLink: "https://pay.vnpay.vn/images/bank/qr-kienlongbank.png",
    category: "deeplink"
  },
  {
    no: 24,
    bankCode: "VIETTELPAY",
    appName: "Viettel Money",
    deeplinkSupport: true,
    iosScheme: "viettelmoney://action/login?command=VnpayApp2App",
    iosPackId: "com.viettel.viettelpay",
    androidScheme: "intent://action/login?command=VnpayApp2App",
    androidPackId: "com.bplus.vtpay.activity",
    androidAppLink: "https://play.google.com/store/apps/details?id=com.bplus.vtpay&hl=vi",
    iosAppLink: "https://apps.apple.com/vn/app/viettel-money/id1344204781",
    logoLink: "https://pay.vnpay.vn/images/bank/qr-viettelpay.png",
    category: "deeplink"
  },
  {
    no: 25,
    bankCode: "VNPTPAY",
    appName: "VNPT Money",
    deeplinkSupport: true,
    iosScheme: "vnptmoneymobile",
    iosPackId: "id1294940479",
    androidScheme: "vnptmoneymobile",
    androidPackId: "vnptpay.vnptmedia.vnpt.com.vnptpay",
    androidAppLink: "https://play.google.com/store/apps/details?id=vnptpay.vnptmedia.vnpt.com.vnptpay",
    iosAppLink: "https://itunes.apple.com/vn/app/vnpt-pay/id1294940479?mt=8",
    logoLink: "https://pay.vnpay.vn/images/bank/qr-vnptpay.png",
    category: "deeplink"
  },
  {
    no: 26,
    bankCode: "VITING",
    appName: "TING",
    deeplinkSupport: true,
    iosScheme: "tingappwallet",
    iosPackId: "vn.tingapp.wallet",
    androidScheme: "tingappwallet",
    androidPackId: "vn.tingapp.wallet",
    androidAppLink: "https://play.google.com/store/apps/details?id=vn.tingapp.wallet",
    iosAppLink: "https://apps.apple.com/app/v%C3%AD-ting-qu%E1%BA%A3n-l%C3%BD-ti%E1%BB%81n-hi%E1%BB%87u-qu%E1%BA%A3/id1534262919",
    logoLink: "https://pay.vnpay.vn/images/bank/qr-viting.png",
    category: "deeplink"
  },
  {
    no: 27,
    bankCode: "VTCPAY",
    appName: "VTC Pay",
    deeplinkSupport: true,
    iosScheme: "com.mobile.vtcpay",
    iosPackId: "com.mobile.vtc.smartAgent",
    androidScheme: "vtcpay",
    androidPackId: "com.vtc.paygate.main",
    androidAppLink: "https://play.google.com/store/apps/details?id=com.vtc.paygate.main&hl=vi",
    iosAppLink: "https://apps.apple.com/vn/app/vtc365/id404108605?l=vi",
    logoLink: "https://pay.vnpay.vn/images/bank/qr-vtcpay.png",
    category: "deeplink"
  },
  {
    no: 28,
    bankCode: "PAYME",
    appName: "Ví PayME",
    deeplinkSupport: true,
    iosScheme: "payme",
    iosPackId: "com.payme.app.user",
    androidScheme: "payme",
    androidPackId: "com.payme.app.user",
    androidAppLink: "https://play.google.com/store/apps/details?id=com.payme.app.user&hl=vi&gl=US",
    iosAppLink: "https://apps.apple.com/vn/app/v%C3%AD-payme/id1492981630",
    logoLink: "https://pay.vnpay.vn/images/bank/qr-payme.png",
    category: "deeplink"
  },
  {
    no: 29,
    bankCode: "APPOTAPAY",
    appName: "Appota",
    deeplinkSupport: true,
    iosScheme: "appotapay",
    iosPackId: "com.appota.wallet",
    androidScheme: "appotapay",
    androidPackId: "com.wallet.appota",
    androidAppLink: "https://play.google.com/store/apps/details?id=com.wallet.appota",
    iosAppLink: "https://apps.apple.com/vn/app/v%C3%AD-appota-gi%E1%BA%A3i-tr%C3%AD-t%C3%ADch-%C4%91i%E1%BB%83m/id1198481412",
    logoLink: "https://pay.vnpay.vn/images/bank/qr-appotapay.png",
    category: "deeplink"
  },
  {
    no: 30,
    bankCode: "9PAY",
    appName: "Ứng Dụng 9Pay",
    deeplinkSupport: true,
    iosScheme: "ninepaymobile",
    iosPackId: "com.9payjsc.vn",
    androidScheme: "ninepaymobile",
    androidPackId: "vn.ninepay.ewallet",
    androidAppLink: "https://play.google.com/store/apps/details?id=vn.ninepay.ewallet&hl=en&gl=US",
    iosAppLink: "https://apps.apple.com/vn/app/v%C3%AD-%C4%91i%E1%BB%87n-t%E1%BB%AD-9pay/id1484320059",
    logoLink: "https://pay.vnpay.vn/images/bank/qr-9pay.png",
    category: "deeplink"
  },
  {
    no: 31,
    bankCode: "ZALOPAY",
    appName: "Zalopay",
    deeplinkSupport: true,
    iosScheme: "zalopay-vnpay",
    iosPackId: "vn.com.vng.zalopay",
    androidScheme: "zalopay-vnpay",
    androidPackId: "vn.com.vng.zalopay",
    androidAppLink: "https://play.google.com/store/apps/details?id=vn.com.vng.zalopay",
    iosAppLink: "https://apps.apple.com/vn/app/zalopay-thanh-to%C3%A1n-t%C3%ADch-th%C6%B0%E1%BB%9Fng/id1112407590",
    logoLink: "https://pay.vnpay.vn/images/bank/qr-zalopay.png",
    category: "deeplink"
  },
  {
    no: 32,
    bankCode: "ABBANK",
    appName: "ABBANK Mobile Banking",
    deeplinkSupport: false,
    logoLink: "https://pay.vnpay.vn/images/bank/qr-abbank.png",
    category: "qr-only"
  },
  {
    no: 33,
    bankCode: "SEABANK",
    appName: "Seabank SmartBanking",
    deeplinkSupport: false,
    logoLink: "https://pay.vnpay.vn/images/bank/qr-seabank.png",
    category: "qr-only"
  },
  {
    no: 34,
    bankCode: "NCB",
    appName: "NCB Smart Banking",
    deeplinkSupport: false,
    logoLink: "https://pay.vnpay.vn/images/bank/qr-ncb.png",
    category: "qr-only"
  },
  {
    no: 35,
    bankCode: "MSBANK",
    appName: "MSB mBank",
    deeplinkSupport: false,
    logoLink: "https://pay.vnpay.vn/images/bank/qr-msb.png",
    category: "qr-only"
  },
  {
    no: 36,
    bankCode: "SHB",
    appName: "SHB Mobile Banking",
    deeplinkSupport: false,
    logoLink: "https://pay.vnpay.vn/images/bank/qr-shb.png",
    category: "qr-only"
  },
  {
    no: 37,
    bankCode: "TPBANK",
    appName: "TPBANK QuickPay",
    deeplinkSupport: false,
    logoLink: "https://pay.vnpay.vn/images/bank/qr-tpbank.png",
    category: "qr-only"
  },
  {
    no: 38,
    bankCode: "MBBANK",
    appName: "MBBANK Mobile Banking",
    deeplinkSupport: false,
    logoLink: "https://pay.vnpay.vn/images/bank/qr-mbbank.png",
    category: "qr-only"
  },
  {
    no: 39,
    bankCode: "BACABANK",
    appName: "BacABank Mobile Banking",
    deeplinkSupport: false,
    logoLink: "https://pay.vnpay.vn/images/bank/qr-bacabank.png",
    category: "qr-only"
  },
  {
    no: 40,
    bankCode: "ACB",
    appName: "ACB Mobile Banking",
    deeplinkSupport: false,
    logoLink: "https://pay.vnpay.vn/images/bank/qr-acb.png",
    category: "qr-only"
  },
  {
    no: 41,
    bankCode: "OCB",
    appName: "OCB Mobile Banking",
    deeplinkSupport: false,
    logoLink: "https://pay.vnpay.vn/images/bank/qr-ocb.png",
    category: "qr-only"
  },
  {
    no: 42,
    bankCode: "WOORIBANK",
    appName: "WOORIBANK Mobile Banking",
    deeplinkSupport: false,
    logoLink: "https://pay.vnpay.vn/images/bank/qr-woori.png",
    category: "qr-only"
  },
  {
    no: 43,
    bankCode: "PVCOMBANK",
    appName: "PVCOMBANK Mobile Banking",
    deeplinkSupport: false,
    logoLink: "https://pay.vnpay.vn/images/bank/qr-pvcombank.png",
    category: "qr-only"
  },
  {
    no: 44,
    bankCode: "VIETCAPITALBANK",
    appName: "VietCapital Mobile Banking",
    deeplinkSupport: false,
    logoLink: "https://pay.vnpay.vn/images/bank/qr-vietcap.png",
    category: "qr-only"
  },
  {
    no: 45,
    bankCode: "SACOMBANK",
    appName: "Sacombank PAY",
    deeplinkSupport: false,
    logoLink: "https://pay.vnpay.vn/images/bank/qr-sacombank.png",
    category: "qr-only"
  },
  {
    no: 46,
    bankCode: "VINID",
    appName: "Ví điện tử VINID",
    deeplinkSupport: false,
    logoLink: "https://pay.vnpay.vn/images/bank/qr-vinid.png",
    category: "qr-only"
  },
  {
    no: 47,
    bankCode: "VIMASS",
    appName: "VIMASS E-wallet",
    deeplinkSupport: false,
    logoLink: "https://pay.vnpay.vn/images/bank/qr-vimass.png",
    category: "qr-only"
  },
  {
    no: 48,
    bankCode: "BAOKIM",
    appName: "Ví điện tử BAOKIM",
    deeplinkSupport: false,
    logoLink: "https://pay.vnpay.vn/images/bank/qr-baokim.png",
    category: "qr-only"
  },
  {
    no: 49,
    bankCode: "TIMOBVB",
    appName: "Ví điện tử TIMO",
    deeplinkSupport: false,
    logoLink: "https://pay.vnpay.vn/images/bank/qr-timobvb.png",
    category: "qr-only"
  },
  {
    no: 50,
    bankCode: "TECHCOMBANK",
    appName: "Techcombank Mobile",
    deeplinkSupport: false,
    logoLink: "https://pay.vnpay.vn/images/bank/qr-techcombank.png",
    category: "qr-only"
  },
  {
    no: 51,
    bankCode: "GALAXYPAY",
    appName: "Ví điện tử GalaxyPay",
    deeplinkSupport: false,
    logoLink: "https://pay.vnpay.vn/images/bank/qr-galaxypay.png",
    category: "qr-only"
  },
  {
    no: 52,
    bankCode: "NAMABANK",
    appName: "NamABank Mobile Banking",
    deeplinkSupport: false,
    logoLink: "https://pay.vnpay.vn/images/bank/qr-nab.png",
    category: "qr-only"
  },
  {
    no: 53,
    bankCode: "MOBIFONEPAY",
    appName: "Ví điện tử Mobifone Money",
    deeplinkSupport: false,
    logoLink: "https://pay.vnpay.vn/images/bank/qr-mobifonepay.png",
    category: "qr-only"
  },
  {
    no: 54,
    bankCode: "CAKEPAY",
    appName: "Ví điện tử CAKEPAY",
    deeplinkSupport: false,
    logoLink: "https://pay.vnpay.vn/images/bank/qr-cakepay.png",
    category: "qr-only"
  },
  {
    no: 55,
    bankCode: "OCBLIOBANK",
    appName: "Liobank",
    deeplinkSupport: false,
    logoLink: "https://pay.vnpay.vn/images/bank/qr-liobank.png",
    category: "qr-only"
  }
]

// Bank List
export interface Bank {
  bankCode: string
  bankName: string
  supportedMethods: string[]
  status: "active" | "maintenance" | "inactive"
}

export const bankList: Bank[] = [
  { bankCode: "NCB", bankName: "National Citizen Bank", supportedMethods: ["ATM", "QR"], status: "active" },
  { bankCode: "VIETCOMBANK", bankName: "Vietcombank", supportedMethods: ["ATM", "QR", "Token"], status: "active" },
  { bankCode: "VIETINBANK", bankName: "VietinBank", supportedMethods: ["ATM", "QR", "Token"], status: "active" },
  { bankCode: "BIDV", bankName: "BIDV", supportedMethods: ["ATM", "QR", "Token"], status: "active" },
  { bankCode: "AGRIBANK", bankName: "Agribank", supportedMethods: ["ATM", "QR"], status: "active" },
  { bankCode: "SACOMBANK", bankName: "Sacombank", supportedMethods: ["ATM", "QR", "Token"], status: "active" },
  { bankCode: "TECHCOMBANK", bankName: "Techcombank", supportedMethods: ["ATM", "QR", "Token"], status: "active" },
  { bankCode: "MBBANK", bankName: "MB Bank", supportedMethods: ["ATM", "QR", "Token"], status: "active" },
  { bankCode: "VPBANK", bankName: "VPBank", supportedMethods: ["ATM", "QR", "Token"], status: "active" },
  { bankCode: "ACB", bankName: "Asia Commercial Bank", supportedMethods: ["ATM", "QR", "Token"], status: "active" },
  { bankCode: "TPBANK", bankName: "TPBank", supportedMethods: ["ATM", "QR"], status: "active" },
  { bankCode: "HDBANK", bankName: "HD Bank", supportedMethods: ["ATM", "QR"], status: "maintenance" },
  { bankCode: "OCEANBANK", bankName: "Ocean Bank", supportedMethods: ["ATM"], status: "inactive" },
  { bankCode: "SHB", bankName: "SHB", supportedMethods: ["ATM", "QR"], status: "active" },
  { bankCode: "EXIMBANK", bankName: "Eximbank", supportedMethods: ["ATM", "QR"], status: "active" }
]

// Integration Checklist
export interface ChecklistItem {
  id: string
  category: "web" | "app"
  title: string
  description: string
}

export const checklistItems: ChecklistItem[] = [
  // Web Integration
  { id: "web-1", category: "web", title: "Configure TmnCode and Secret Key", description: "Ensure correct TmnCode for environment (sandbox vs production)" },
  { id: "web-2", category: "web", title: "Implement URL encoding", description: "All parameter values must be URL encoded using UTF-8, RFC 3986" },
  { id: "web-3", category: "web", title: "Generate correct checksum", description: "Use HMAC SHA512 with sorted parameters, exclude vnp_SecureHash and vnp_SecureHashType" },
  { id: "web-4", category: "web", title: "Handle Return URL", description: "Implement callback handling for payment result" },
  { id: "web-5", category: "web", title: "Verify callback checksum", description: "Always verify the checksum in callback before trusting payment result" },
  { id: "web-6", category: "web", title: "Implement IPN handler", description: "Server-to-server notification handler for reliable payment confirmation" },
  { id: "web-7", category: "web", title: "Handle duplicate notifications", description: "IPN may be sent multiple times, implement idempotency" },
  { id: "web-8", category: "web", title: "Use HTTPS for all URLs", description: "Return URL and IPN URL must use HTTPS in production" },
  { id: "web-9", category: "web", title: "Test with sandbox environment", description: "Complete testing before switching to production" },
  { id: "web-10", category: "web", title: "Implement error handling", description: "Handle all possible error codes appropriately" },
  
  // App SDK Integration
  { id: "app-1", category: "app", title: "Generate payment URL on server", description: "Never generate payment URL on mobile device" },
  { id: "app-2", category: "app", title: "Never store secret key in app", description: "Secret key must only exist on your backend server" },
  { id: "app-3", category: "app", title: "Integrate correct SDK version", description: "Use latest SDK for iOS/Android/React Native" },
  { id: "app-4", category: "app", title: "Handle SDK result codes", description: "Implement handlers for Success, Cancel, and Fail states" },
  { id: "app-5", category: "app", title: "Verify payment on server", description: "After SDK returns success, verify with server before confirming to user" },
  { id: "app-6", category: "app", title: "Handle app backgrounding", description: "Payment may complete while app is in background" },
  { id: "app-7", category: "app", title: "Implement deep linking", description: "Configure URL scheme for app callback" },
  { id: "app-8", category: "app", title: "Test on real devices", description: "SDK may behave differently on emulators" }
]
