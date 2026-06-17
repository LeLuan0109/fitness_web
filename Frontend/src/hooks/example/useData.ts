import { useState, useEffect } from "react"

// Định nghĩa kiểu dữ liệu dựa trên Columns bạn đang dùng
type PrimeContractorTable = {
  id: string
  department: string
  role: string
  name: string
  email: string
  createdAt: string
  status: "Active" | "Inactive" | "Pending"
}

// Dữ liệu giả lập
const MOCK_DATA: PrimeContractorTable[] = [
  {
    id: "1",
    department: "Engineering",
    role: "Frontend Developer",
    name: "Nguyễn Văn A",
    email: "a.nguyen@example.com",
    createdAt: "2024-01-15",
    status: "Active",
  },
  {
    id: "2",
    department: "Design",
    role: "UI/UX Designer",
    name: "Trần Thị B",
    email: "b.tran@example.com",
    createdAt: "2024-02-20",
    status: "Active",
  },
  {
    id: "3",
    department: "Marketing",
    role: "Content Creator",
    name: "Lê Văn C",
    email: "c.le@example.com",
    createdAt: "2024-03-10",
    status: "Inactive",
  },
  {
    id: "4",
    department: "Sales",
    role: "Sales Executive",
    name: "Phạm Thị D",
    email: "d.pham@example.com",
    createdAt: "2024-04-05",
    status: "Pending",
  },
  {
    id: "5",
    department: "Engineering",
    role: "Backend Developer",
    name: "Hoàng Văn E",
    email: "e.hoang@example.com",
    createdAt: "2024-05-12",
    status: "Active",
  },
]

export default function useData() {
  const [data, setData] = useState<PrimeContractorTable[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(true)

  // Giả lập Meta cho phân trang
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    totalPages: 5, // Giả sử có 5 trang
    total: 50,
  })

  useEffect(() => {
    // Giả lập gọi API mất 1 giây
    const timer = setTimeout(() => {
      setData(MOCK_DATA)
      setIsLoading(false)
      setIsFetching(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return {
    data,
    isLoading,
    isFetching,
    meta,
  }
}