import { Button } from "@/components/shared/ui/button"
import { Skeleton } from "@/components/shared/ui/skeleton"
import { ROUTES } from "@/constants/routes"
import { useGetDashboardData } from "@/hooks/queries/dashboard/useGetDashboardData"
import { PageLayout } from "@/layouts/PageLayout"
import authStore from "@/stores/auth.store"
import { ScoredMenuSuggestion, ScoredPlanSuggestion } from "@/types/dashboard.type"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  CirclePlay,
  Dumbbell,
  Flame,
  HeartPulse,
  Maximize2,
  Milestone,
  MoveHorizontal,
  ScanLine,
  ShieldCheck,
  Soup,
  Sparkles,
  Star,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { generatePath, useNavigate } from "react-router-dom"

gsap.registerPlugin(ScrollTrigger)

const getBMIStatus = (bmi: number) => {
  if (bmi < 18.5) {
    return {
      label: "Gầy",
      className: "border-[#6B86C7]/25 bg-[#EEF3FF] text-[#405C9D]",
      dotClassName: "bg-[#6B86C7]",
    }
  }

  if (bmi < 25) {
    return {
      label: "Cân bằng",
      className: "border-[#86A873]/25 bg-[#F2F7EE] text-[#587443]",
      dotClassName: "bg-[#86A873]",
    }
  }

  if (bmi < 30) {
    return {
      label: "Thừa cân",
      className: "border-[#B88455]/25 bg-[#FBF3EA] text-[#8C6239]",
      dotClassName: "bg-[#B88455]",
    }
  }

  return {
    label: "Béo phì",
    className: "border-[#B35F4A]/25 bg-[#FFF0ED] text-[#9C4433]",
    dotClassName: "bg-[#B35F4A]",
  }
}

const heroSlides = [
  {
    url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    label: "Phân Tích Tư Thế",
    meta: "THEO DÕI AI THEO THỜI GIAN THỰC",
    desc: "Độ sâu Squat · Lệch đầu gối · Góc cột sống trung tính — phân tích từng khung hình.",
  },
  {
    url: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80",
    label: "Chỉ Số Sinh Tồn",
    meta: "HRV · BPM · VO₂ MAX",
    desc: "Điểm phục hồi, vùng gắng sức, xu hướng bù nước qua các tuần.",
  },
  {
    url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    label: "Lộ Trình Thích Ứng",
    meta: "LỘ TRÌNH HÀNG TUẦN",
    desc: "Quá tải lũy tiến, tuần xả cơ, ngày linh hoạt — được tinh chỉnh hàng tuần.",
  },
]

const featureCards: {
  icon: LucideIcon
  title: string
  subtitle: string
  content: string
  tag: string
  tags: string[]
}[] = [
  {
    icon: ScanLine,
    title: "Hệ Thống Chỉnh Dáng Thông Minh",
    subtitle: "AI CHỈNH DÁNG TẬP",
    content:
      "Chỉnh sửa tư thế chuẩn xác theo thời gian thực. Công nghệ AI tracking qua camera phân tích góc độ cơ thể khi tập, đưa ra phản hồi tức thì để phòng tránh chấn thương.",
    tag: "01",
    tags: ["Tư thế", "Thời gian thực", "Camera Vision"],
  },
  {
    icon: HeartPulse,
    title: "Trình Phân Tích Chỉ Số Sinh Học",
    subtitle: "CHỈ SỐ SỨC KHỎE CƠ THỂ",
    content:
      "Đo lường sâu các chỉ số cơ thể. Theo dõi sát sao BMI, khối lượng cơ, độ biến thiên nhịp tim (HRV) và mức nước thông qua bảng điều khiển trực quan sinh động.",
    tag: "02",
    tags: ["BMI", "HRV", "Độ bù nước", "Khối lượng cơ"],
  },
  {
    icon: Milestone,
    title: "Lộ Trình Tập Luyện Thích Ứng",
    subtitle: "LỘ TRÌNH TẬP LUYỆN",
    content:
      "Xây dựng kế hoạch cá nhân hóa vượt trội. Từ người mới bắt đầu đến vận động viên nâng cao, nhận lịch trình chi tiết tự động cải tiến theo phong độ của bạn.",
    tag: "03",
    tags: ["Lịch tuần", "Thích ứng linh hoạt", "Tăng tiến"],
  },
]

const beginnerExercises = [
  {
    name: "Squat (Gánh đùi)",
    url: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80",
    difficulty: "Cơ bản",
    muscle: "Cơ đùi trước · Cơ mông",
    sets: "3 × 12 lần",
    focus: "Chú ý hướng đầu gối theo mũi chân, độ sâu vòng hông, mở rộng khớp háng.",
  },
  {
    name: "Push-up (Chống đẩy)",
    url: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=600&q=80",
    difficulty: "Cơ bản",
    muscle: "Cơ ngực · Cơ tay sau",
    sets: "3 × 10 lần",
    focus: "Khép cùi chỏ góc 45 độ, gồng chặt cơ trọng tâm (core), xuống sâu hết biên độ.",
  },
  {
    name: "Plank (Gồng bụng)",
    url: "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=600&q=80",
    difficulty: "Cơ bản",
    muscle: "Cơ bụng · Cơ vai",
    sets: "3 × 30 giây",
    focus: "Giữ cột sống thẳng tự nhiên, không võng hông, điều hòa nhịp thở đều đặn.",
  },
  {
    name: "Deadlift (Kéo tạ)",
    url: "https://images.unsplash.com/photo-1605296867304-46d5465a25f1?auto=format&fit=crop&w=600&q=80",
    difficulty: "Trung cấp",
    muscle: "Chuỗi cơ phía sau (Lưng/Mông)",
    sets: "4 × 8 lần",
    focus: "Chuyển động bản lề hông (hip hinge), giữ đường đi thanh đòn sát chân, gồng cơ xô.",
  },
  {
    name: "Lunge (Bước chùng chân)",
    url: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=600&q=80",
    difficulty: "Cơ bản",
    muscle: "Cơ đùi trước · Cơ mông",
    sets: "3 × 10 lần",
    focus: "Căn chỉnh khớp gối vuông góc, bước khoảng cách vừa đủ, giữ thăng bằng cơ thể.",
  },
  {
    name: "Glute Bridge (Cầu mông)",
    url: "https://images.unsplash.com/photo-1620188467120-5042ed1eb5da?auto=format&fit=crop&w=600&q=80",
    difficulty: "Cơ bản",
    muscle: "Cơ mông · Cơ đùi sau",
    sets: "3 × 15 lần",
    focus: "Cuộn xương chậu nhẹ, siết chặt và mở rộng hết biên độ hông ở đỉnh động tác.",
  },
]

const manifestoText =
  "Chuyển động không đơn thuần là một nhiệm vụ. Đó là ngôn ngữ cơ thể bạn lên tiếng khi nó chân thật nhất. Chúng tôi tạo ra COREFORM để lắng nghe — đọc vị những điểm ngập ngừng nhỏ nhất trong động tác squat, sự bất đối xứng khi bạn plank, hay nhịp tim trôi chậm dần qua từng tuần. Mỗi chỉ số là một câu thoại. Mỗi buổi tập là một lát cắt. Cùng nhau, chúng tạo nên câu chuyện của sự bứt phá và trưởng thành vững chắc."

const formatMetric = (value: number, maximumFractionDigits = 0) =>
  new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits,
    minimumFractionDigits: maximumFractionDigits,
  }).format(value)

function SectionEyebrow({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <div
      className={`mb-6 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.25em] ${light ? "text-sand" : "text-clay"}`}
    >
      <span className={`h-px w-8 ${light ? "bg-sand" : "bg-clay"}`} />
      {children}
    </div>
  )
}

function HeroSection({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  const [slide, setSlide] = useState(0)
  const textRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t1 = window.setTimeout(() => textRef.current?.classList.add("is-in"), 200)
    const t2 = window.setTimeout(() => sliderRef.current?.classList.add("is-in"), 400)
    const interval = window.setInterval(() => {
      setSlide((s) => (s + 1) % heroSlides.length)
    }, 5200)

    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearInterval(interval)
    }
  }, [])

  return (
    <section id="top" className="relative flex min-h-[calc(100vh-4rem)] items-center px-6 pb-16 pt-12 lg:px-12">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        <div ref={textRef} className="hero-text">
          <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-sand bg-white/50 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-clay backdrop-blur-sm">
            <Sparkles className="size-3.5" />
            Huấn Luyện Viên AI Cá Nhân Của Bạn
          </div>
          <h1 className="font-display mb-8 text-5xl font-medium leading-[1.05] tracking-tight text-earth md:text-6xl lg:text-[4.5rem]">
            Chuẩn Hóa Tư Thế.
            <br />
            Theo Dõi Chỉ Số.
            <br />
            <span className="italic-display text-clay">Bứt Phá</span> Giới Hạn.
          </h1>
          <p className="mb-10 max-w-xl text-lg leading-relaxed text-earth/70">
            Một hệ thống thông minh toàn diện giúp phân tích các chỉ số sức khỏe của bạn, lập lộ trình tập luyện cá
            nhân hóa và tinh chỉnh tư thế theo thời gian thực.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button
              className="group h-auto rounded-full bg-earth px-7 py-4 text-sm font-medium text-cream transition-all duration-300 hover:scale-[1.03] hover:bg-clay"
              onClick={() => navigate(ROUTES.WORKOUTS.SAMPLE_LIST)}
            >
              Bắt đầu đánh giá miễn phí
              <span className="ml-3 flex size-6 items-center justify-center rounded-full bg-cream/20 transition group-hover:bg-cream/30">
                <ArrowRight className="size-3" />
              </span>
            </Button>
            <Button
              variant="outline"
              className="group h-auto rounded-full border-earth/20 px-7 py-4 text-sm font-medium text-earth transition-all duration-300 hover:border-earth hover:bg-earth hover:text-cream"
              onClick={() => navigate(ROUTES.EXERCISES.LIST)}
            >
              <span className="mr-3 flex size-6 items-center justify-center rounded-full bg-earth/10 transition group-hover:bg-cream/20">
                <CirclePlay className="size-2.5" />
              </span>
              Xem Bản Demo
            </Button>
          </div>
          <div className="mt-14 flex flex-wrap items-center gap-8 border-t border-sand/60 pt-8 text-xs text-earth/50">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-3.5" /> Tuân thủ HIPAA
            </div>
            <div className="flex items-center gap-2">
              <Users className="size-3.5" /> 50k+ Vận Động Viên
            </div>
            <div className="flex items-center gap-2">
              <Star className="size-3.5" /> Đánh giá 4.9 / 5
            </div>
          </div>
        </div>

        <div
          ref={sliderRef}
          className="hero-slider relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-sand-light shadow-2xl shadow-earth/20"
        >
          {heroSlides.map((s, i) => (
            <div
              key={s.label}
              className="absolute inset-0"
              style={{
                opacity: i === slide ? 1 : 0,
                transition: "opacity 1500ms cubic-bezier(.22,1,.36,1)",
              }}
            >
              <img
                src={s.url}
                className="h-full w-full object-cover"
                style={{
                  transform: i === slide ? "scale(1.08)" : "scale(1)",
                  transition: "transform 6000ms linear",
                }}
                alt={s.label}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-earth/85 via-earth/30 to-transparent" />

              <div className="absolute left-6 top-6 size-7 border-l-2 border-t-2 border-cream/50" />
              <div className="absolute right-6 top-6 size-7 border-r-2 border-t-2 border-cream/50" />
              <div className="absolute bottom-6 left-6 size-7 border-b-2 border-l-2 border-cream/50" />
              <div className="absolute bottom-6 right-6 size-7 border-b-2 border-r-2 border-cream/50" />

              <div className="absolute left-12 right-12 top-7 flex items-start justify-between text-cream">
                <div className="text-[10px] font-medium tracking-[0.3em] opacity-80">{s.meta}</div>
                <div className="flex size-10 items-center justify-center rounded-full border border-cream/30 bg-cream/10 backdrop-blur-sm">
                  <Maximize2 className="size-3.5" />
                </div>
              </div>

              <div className="absolute bottom-24 left-12 right-12 text-cream">
                <div className="font-display mb-2 text-3xl">{s.label}</div>
                <div className="max-w-xs text-sm leading-relaxed text-cream/70">{s.desc}</div>
              </div>
            </div>
          ))}

          <div className="absolute bottom-7 left-12 right-12 z-10 flex items-center justify-between">
            <div className="frame-counter font-mono text-[10px] tracking-[0.3em] text-cream/70">
              {String(slide + 1).padStart(2, "0")} — {String(heroSlides.length).padStart(2, "0")}
            </div>
            <div className="flex gap-2">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSlide(i)}
                  className={`h-1 rounded-full transition-all duration-500 ${i === slide ? "w-8 bg-cream" : "w-4 bg-cream/40 hover:bg-cream/60"}`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-earth/40 lg:flex">
        <span>Cuộn xuống</span>
        <div className="relative h-12 w-px overflow-hidden bg-earth/15">
          <div className="scroll-line absolute left-0 top-0 h-1/2 w-full bg-clay" />
        </div>
      </div>
    </section>
  )
}

function BodyDashboardSection({
  metrics,
  weightGap,
  estimatedWeeksToGoal,
  paceWarning,
}: {
  metrics: {
    label: string
    value: string
    helper: string
    tag: string
    tagClassName: string
    tagDotClassName: string
    icon: LucideIcon
    progress: number
  }[]
  weightGap?: number | null
  estimatedWeeksToGoal?: number | null
  paceWarning?: string | null
}) {
  return (
    <section id="vitals" className="relative border-y border-sand/30 bg-white px-6 py-32 lg:px-12 lg:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 flex flex-wrap items-end justify-between gap-8">
          <div>
            <SectionEyebrow>Chỉ Số Cơ Thể</SectionEyebrow>
            <h2 className="font-display max-w-3xl text-5xl font-medium leading-[1.05] tracking-tight text-earth md:text-6xl lg:text-7xl">
              Số liệu rõ ràng
              <br />
              trước khi bạn <span className="italic-display text-clay">bước vào</span> buổi tập.
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-earth/60">
            BMI, TDEE và calo mục tiêu được đặt ngay trong trang chủ để quyết định hôm nay nên tập, ăn và phục hồi thế
            nào.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
          {metrics.map((metric) => {
            const MetricIcon = metric.icon

            return (
              <article
                key={metric.label}
                className="group rounded-3xl border border-sand/60 bg-cream p-8 transition-all duration-500 hover:-translate-y-1 hover:border-clay/40 hover:shadow-xl hover:shadow-earth/5 lg:p-10"
              >
                <div className="mb-12 flex items-start justify-between">
                  <div className="flex size-14 items-center justify-center rounded-2xl border border-earth/10 bg-earth/5 text-earth transition-all duration-500 group-hover:border-earth group-hover:bg-earth group-hover:text-cream">
                    <MetricIcon className="size-6" />
                  </div>
                  <div
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium ${metric.tagClassName}`}
                  >
                    <span className={`size-2 rounded-full ${metric.tagDotClassName}`} />
                    {metric.tag}
                  </div>
                </div>
                <p className="text-sm font-medium text-earth/60">{metric.label}</p>
                <p className="font-display mt-2 text-4xl tracking-tight text-earth">{metric.value}</p>
                <p className="mt-3 min-h-10 text-sm leading-relaxed text-earth/65">{metric.helper}</p>
                <div className="mt-8 h-1 overflow-hidden rounded-full bg-sand-light">
                  <div
                    className="h-full rounded-full bg-clay transition-all duration-700"
                    style={{ width: `${metric.progress}%` }}
                  />
                </div>
              </article>
            )
          })}
        </div>

        {paceWarning && (
          <div className="mt-8 rounded-2xl border border-[#B35F4A]/25 bg-[#FFF0ED] px-6 py-4 text-sm leading-relaxed text-[#9C4433]">
            {paceWarning}
          </div>
        )}
        {!paceWarning && weightGap != null && Math.abs(weightGap) > 0.1 && estimatedWeeksToGoal != null && (
          <div className="mt-8 rounded-2xl border border-sand/60 bg-cream px-6 py-4 text-sm leading-relaxed text-earth/70">
            Cần {weightGap > 0 ? "giảm" : "tăng"} khoảng <strong>{Math.abs(weightGap)}kg</strong> để đạt cân mục
            tiêu — ước tính <strong>{estimatedWeeksToGoal} tuần</strong> với tốc độ an toàn (~0.5kg/tuần).
          </div>
        )}
      </div>
    </section>
  )
}

function ScoreBadge({ score }: { score: number }) {
  const className =
    score >= 70
      ? "border-[#86A873]/25 bg-[#F2F7EE] text-[#587443]"
      : score >= 40
        ? "border-[#B88455]/25 bg-[#FBF3EA] text-[#8C6239]"
        : "border-[#B35F4A]/25 bg-[#FFF0ED] text-[#9C4433]"

  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium ${className}`}>
      {score} điểm khớp
    </span>
  )
}

function RecommendationsSection({
  navigate,
  usedFallback,
  planSuggestions,
  menuSuggestions,
}: {
  navigate: ReturnType<typeof useNavigate>
  usedFallback?: boolean
  planSuggestions: ScoredPlanSuggestion[]
  menuSuggestions: ScoredMenuSuggestion[]
}) {
  if (planSuggestions.length === 0 && menuSuggestions.length === 0) return null

  return (
    <section className="relative border-b border-sand/30 bg-cream px-6 py-32 lg:px-12 lg:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16">
          <SectionEyebrow>Đề Xuất Cho Bạn</SectionEyebrow>
          <h2 className="font-display max-w-3xl text-5xl font-medium leading-[1.05] tracking-tight text-earth md:text-6xl lg:text-7xl">
            Kế hoạch & thực đơn
            <br />
            <span className="italic-display text-clay">sát với bạn nhất.</span>
          </h2>
          {usedFallback && (
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-earth/50">
              Kho chưa có tổ hợp khớp đúng mục tiêu của bạn — danh sách dưới đây đã được nới điều kiện để luôn có gợi
              ý.
            </p>
          )}
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <Dumbbell className="size-5 text-clay" />
              <h3 className="font-display text-2xl text-earth">Kế hoạch tập</h3>
            </div>
            <div className="space-y-4">
              {planSuggestions.map((s) => (
                <article
                  key={s.plan.id}
                  className="group rounded-3xl border border-sand/60 bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:border-clay/40 hover:shadow-xl hover:shadow-earth/5"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h4 className="font-display text-xl leading-tight text-earth">{s.plan.name}</h4>
                    <ScoreBadge score={s.matchScore} />
                  </div>
                  {s.plan.description && (
                    <p className="mb-4 text-sm leading-relaxed text-earth/60">{s.plan.description}</p>
                  )}
                  <ul className="mb-5 space-y-1.5 text-sm text-earth/70">
                    {s.reasons.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                  <Button
                    variant="outline"
                    className="h-auto rounded-full border-earth/20 px-5 py-2.5 text-sm font-medium text-earth transition-all duration-300 hover:border-earth hover:bg-earth hover:text-cream"
                    onClick={() => navigate(generatePath(ROUTES.WORKOUTS.DETAIL, { id: String(s.plan.id) }))}
                  >
                    Xem chi tiết
                    <ArrowRight className="size-3.5" />
                  </Button>
                </article>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-6 flex items-center gap-3">
              <Soup className="size-5 text-clay" />
              <h3 className="font-display text-2xl text-earth">Thực đơn</h3>
            </div>
            <div className="space-y-4">
              {menuSuggestions.map((s) => (
                <article
                  key={s.menu.id}
                  className="group rounded-3xl border border-sand/60 bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:border-clay/40 hover:shadow-xl hover:shadow-earth/5"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h4 className="font-display text-xl leading-tight text-earth">{s.menu.name}</h4>
                    <ScoreBadge score={s.matchScore} />
                  </div>
                  {s.menu.description && (
                    <p className="mb-4 text-sm leading-relaxed text-earth/60">{s.menu.description}</p>
                  )}
                  <ul className="mb-5 space-y-1.5 text-sm text-earth/70">
                    {s.reasons.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                  <Button
                    variant="outline"
                    className="h-auto rounded-full border-earth/20 px-5 py-2.5 text-sm font-medium text-earth transition-all duration-300 hover:border-earth hover:bg-earth hover:text-cream"
                    onClick={() => navigate(generatePath(ROUTES.NUTRITION.SAMPLE_DETAIL, { id: String(s.menu.id) }))}
                  >
                    Xem chi tiết
                    <ArrowRight className="size-3.5" />
                  </Button>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ManifestoSection() {
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const words = manifestoText.split(/\s+/)
    el.innerHTML = words.map((w) => `<span class="word">${w}</span>`).join(" ")

    const ctx = gsap.context(() => {
      gsap.to(el.querySelectorAll(".word"), {
        opacity: 1,
        filter: "blur(0px)",
        stagger: 0.04,
        ease: "sine.out",
        scrollTrigger: {
          trigger: el,
          start: "top 78%",
          end: "center 55%",
          scrub: true,
        },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section className="relative bg-cream px-6 py-32 lg:px-12 lg:py-40">
      <div className="mx-auto max-w-4xl">
        <SectionEyebrow>Triết Lý Của Chúng Tôi</SectionEyebrow>
        <p ref={ref} className="manifesto font-display text-2xl leading-[1.4] text-earth md:text-3xl lg:text-[2.5rem]" />

        <div className="mt-20 grid gap-10 border-t border-sand/40 pt-12 md:grid-cols-3">
          {[
            { num: "50,000+", label: "Hội viên đã luyện tập", sub: "Trên khắp 32 quốc gia" },
            { num: "12.4M", label: "Buổi tập được phân tích", sub: "Sửa dáng chuẩn xác theo thời gian thực" },
            { num: "94%", label: "Độ chính xác tư thế", sub: "Được chứng thực bởi các chuyên gia & HLV chuyên nghiệp" },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-display mb-2 text-4xl tracking-tight text-earth">{s.num}</div>
              <div className="mb-1 text-sm font-medium text-earth">{s.label}</div>
              <div className="text-xs text-earth/50">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturesSection({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("is-in")
        })
      },
      { threshold: 0.18 },
    )
    sectionRef.current?.querySelectorAll(".feature-card").forEach((c) => obs.observe(c))
    return () => obs.disconnect()
  }, [])

  return (
    <section id="features" ref={sectionRef} className="relative border-t border-sand/30 bg-cream px-6 py-32 lg:px-12 lg:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 flex flex-wrap items-end justify-between gap-8">
          <div>
            <SectionEyebrow>Hệ Thống COREFORM</SectionEyebrow>
            <h2 className="font-display max-w-3xl text-5xl font-medium leading-[1.05] tracking-tight text-earth md:text-6xl lg:text-7xl">
              Ba trụ cột.
              <br />
              Một quy trình <span className="italic-display text-clay">thông minh</span> gắn kết.
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-earth/60">
            Mỗi mô-đun sinh ra để loại bỏ hoàn toàn những hoài nghi — bạn nên làm gì tiếp theo, làm sao để tập an toàn
            và cơ thể đang muốn nói gì với bạn.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
          {featureCards.map((f) => {
            const FeatureIcon = f.icon

            return (
              <article
                key={f.title}
                className="feature-card group cursor-pointer rounded-3xl border border-sand/60 bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:border-clay/40 hover:shadow-xl hover:shadow-earth/5 lg:p-10"
                onClick={() => navigate(ROUTES.EXERCISES.LIST)}
                onKeyDown={(e) => e.key === "Enter" && navigate(ROUTES.EXERCISES.LIST)}
                role="button"
                tabIndex={0}
              >
                <div className="mb-12 flex items-start justify-between">
                  <div className="flex size-14 items-center justify-center rounded-2xl border border-earth/10 bg-earth/5 text-earth transition-all duration-500 group-hover:border-earth group-hover:bg-earth group-hover:text-cream">
                    <FeatureIcon className="size-6" />
                  </div>
                  <span className="font-display font-mono text-sm text-earth/30">{f.tag}</span>
                </div>
                <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-clay">{f.subtitle}</div>
                <h3 className="font-display mb-5 text-2xl leading-tight text-earth">{f.title}</h3>
                <p className="mb-8 text-sm leading-relaxed text-earth/65">{f.content}</p>
                <div className="mb-6 flex flex-wrap gap-2">
                  {f.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-sand/40 bg-sand-light/60 px-3 py-1 text-[11px] text-earth/60"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-sand/40 pt-6 text-xs text-earth/40 transition-colors duration-500 group-hover:text-clay">
                  <span className="font-medium">Tìm hiểu thêm</span>
                  <ArrowUpRight className="size-3.5" />
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function BeginnerGuideSection({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia("(max-width: 1023px)").matches) return

    const viewport = viewportRef.current
    const cards = cardsRef.current
    const progress = progressRef.current
    if (!viewport || !cards) return

    let scrollWidth = 0
    let lastY = window.scrollY
    let skewTimeout: ReturnType<typeof setTimeout>

    const recalc = () => {
      scrollWidth = Math.max(0, cards.scrollWidth - window.innerWidth)
      viewport.style.height = `${window.innerHeight + scrollWidth}px`
    }

    recalc()
    window.addEventListener("resize", recalc)

    const onScroll = () => {
      const top = viewport.getBoundingClientRect().top

      if (top <= 0 && top >= -scrollWidth) {
        const p = -top / scrollWidth
        cards.style.transform = `translate3d(${-p * scrollWidth}px, 0, 0)`
        if (progress) progress.style.width = `${p * 100}%`

        const v = window.scrollY - lastY
        lastY = window.scrollY
        const skew = Math.max(-8, Math.min(8, v * 0.35))
        cards.querySelectorAll(".pin-card .scale-wrap").forEach((c) => {
          ;(c as HTMLElement).style.transform = `skewX(${skew}deg)`
        })
        clearTimeout(skewTimeout)
        skewTimeout = setTimeout(() => {
          cards.querySelectorAll(".pin-card .scale-wrap").forEach((c) => {
            ;(c as HTMLElement).style.transform = "skewX(0deg)"
          })
        }, 200)
      } else if (top > 0) {
        cards.style.transform = "translate3d(0, 0, 0)"
        if (progress) progress.style.width = "0%"
      } else if (top < -scrollWidth) {
        cards.style.transform = `translate3d(${-scrollWidth}px, 0, 0)`
        if (progress) progress.style.width = "100%"
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      window.removeEventListener("resize", recalc)
      window.removeEventListener("scroll", onScroll)
      clearTimeout(skewTimeout)
    }
  }, [])

  return (
    <section id="journey" className="relative overflow-hidden bg-earth text-cream">
      <div ref={viewportRef} className="pin-viewport relative">
        <div className="pin-track">
          <div className="pointer-events-none absolute left-6 top-24 z-10 max-w-2xl lg:left-12 lg:top-32">
            <SectionEyebrow light>Nền Tảng Cốt Lõi · Hướng Dẫn Bài Tập Cơ Bản</SectionEyebrow>
            <h2 className="font-display text-5xl font-medium leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Sáu chuyển động.
              <br />
              Dành cho <span className="italic-display text-sand-dark">mọi</span> khởi đầu vững chắc.
            </h2>
          </div>

          <div ref={cardsRef} className="pin-cards mt-64">
            {beginnerExercises.map((ex, i) => (
              <article key={ex.name} className="pin-card w-[300px] md:w-[360px]">
                <div className="scale-wrap">
                  <button
                    type="button"
                    className="group w-full cursor-pointer overflow-hidden rounded-3xl border border-cream/10 bg-cream/5 text-left backdrop-blur-sm transition-all duration-500 hover:bg-cream/10"
                    onClick={() => navigate(ROUTES.EXERCISES.LIST)}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={ex.url}
                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        alt={ex.name}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-earth via-earth/50 to-transparent" />

                      <div className="absolute left-4 top-4 size-5 border-l border-t border-cream/40" />
                      <div className="absolute right-4 top-4 size-5 border-r border-t border-cream/40" />
                      <div className="absolute bottom-4 left-4 size-5 border-b border-l border-cream/40" />
                      <div className="absolute bottom-4 right-4 size-5 border-b border-r border-cream/40" />

                      <div className="absolute left-5 right-5 top-5 flex items-start justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-cream/70">
                          BÀI TẬP.0{i + 1}
                        </span>
                        <span className="rounded-full border border-cream/20 bg-cream/10 px-2.5 py-1 text-[10px] text-cream backdrop-blur-sm">
                          {ex.difficulty}
                        </span>
                      </div>
                      <div className="absolute bottom-5 left-5 right-5">
                        <div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-sand">{ex.muscle}</div>
                        <h3 className="font-display text-3xl leading-none text-cream">{ex.name}</h3>
                      </div>
                    </div>
                    <div className="space-y-5 p-6">
                      <div className="grid grid-cols-2 gap-4 border-b border-cream/10 pb-5">
                        <div>
                          <div className="mb-1 text-[10px] uppercase tracking-[0.15em] text-sand/60">Khối Lượng</div>
                          <div className="font-display text-lg text-cream">{ex.sets}</div>
                        </div>
                        <div>
                          <div className="mb-1 text-[10px] uppercase tracking-[0.15em] text-sand/60">Cấp Độ</div>
                          <div className="font-display text-lg text-cream">{ex.difficulty}</div>
                        </div>
                      </div>
                      <div>
                        <div className="mb-2 text-[10px] uppercase tracking-[0.15em] text-sand/60">AI Chỉ Dẫn Kỹ Thuật</div>
                        <p className="text-sm leading-relaxed text-cream/70">{ex.focus}</p>
                      </div>
                      <div className="flex items-center justify-between pt-4 text-xs">
                        <span className="font-medium text-cream/50">Xem video hướng dẫn</span>
                        <span className="flex size-9 items-center justify-center rounded-full border border-cream/30 transition-all duration-300 group-hover:border-sand group-hover:bg-sand group-hover:text-earth">
                          <ArrowRight className="size-3" />
                        </span>
                      </div>
                    </div>
                  </button>
                </div>
              </article>
            ))}

            <article className="pin-card w-[300px] md:w-[360px]">
              <div className="scale-wrap h-full">
                <div className="flex min-h-[500px] flex-col justify-between rounded-3xl bg-clay p-8 text-cream md:p-10">
                  <div>
                    <div className="mb-8 flex size-12 items-center justify-center rounded-2xl bg-cream/15">
                      <ArrowUpRight className="size-6" />
                    </div>
                    <div className="mb-4 text-[10px] uppercase tracking-[0.25em] opacity-70">Tiếp Theo</div>
                    <h3 className="font-display mb-4 text-3xl leading-tight">
                      Xây dựng lộ trình hoàn chỉnh sau khi đánh giá.
                    </h3>
                    <p className="text-sm leading-relaxed text-cream/70">
                      Mười hai tuần. Bốn mươi tám buổi tập. Một quỹ đạo chuyển động được tinh chỉnh chuẩn xác theo tín
                      hiệu từ chính cơ thể bạn.
                    </p>
                  </div>
                  <Button
                    className="mt-8 h-auto self-start rounded-full bg-cream px-6 py-3 text-sm font-medium text-earth transition-all duration-300 hover:bg-earth hover:text-cream"
                    onClick={() => navigate(ROUTES.WORKOUTS.SAMPLE_LIST)}
                  >
                    Bắt Đầu Đánh Giá
                    <ArrowRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            </article>

            <div className="w-12 shrink-0" />
          </div>

          <div className="pin-progress">
            <div ref={progressRef} className="pin-progress-fill" />
          </div>

          <div className="absolute bottom-12 left-6 hidden items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-cream/40 lg:flex lg:left-12">
            <MoveHorizontal className="size-3" /> Cuộn chuột ngang để xem thêm
          </div>
          <div className="absolute bottom-12 right-6 hidden text-[10px] uppercase tracking-[0.25em] text-cream/40 lg:right-12 lg:block">
            06 Động Tác · 01 Mục Tiêu
          </div>
        </div>
      </div>
    </section>
  )
}

function PricingSection({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  const plans = [
    {
      name: "Starter",
      price: "Miễn Phí",
      period: "trọn đời",
      desc: "Dành cho người mới bắt đầu khám phá",
      features: [
        "Phân tích tư thế — 3 bài tập",
        "Theo dõi chỉ số cơ bản",
        "Báo cáo tổng hợp hàng tuần",
        "Tham gia cộng đồng giao lưu",
      ],
      cta: "Bắt Đầu Miễn Phí",
      featured: false,
      route: ROUTES.WORKOUTS.SAMPLE_LIST,
    },
    {
      name: "Practice",
      price: "$19",
      period: "mỗi tháng",
      desc: "Dành cho người tập luyện nghiêm túc",
      features: [
        "Phân tích tư thế không giới hạn",
        "Bảng chỉ số sinh học chuyên sâu",
        "Lộ trình tuần tự động thích ứng",
        "Theo dõi HRV & lượng nước cơ thể",
        "Quyền ưu tiên trong cộng đồng",
      ],
      cta: "Trải Nghiệm 14 Ngày Miễn Phí",
      featured: true,
      route: ROUTES.WORKOUTS.MY_LIST,
    },
    {
      name: "Studio",
      price: "$49",
      period: "mỗi tháng",
      desc: "Dành cho Huấn luyện viên & Studio",
      features: [
        "Bao gồm mọi tính năng gói Practice",
        "Quản lý tới 10 hồ sơ khách hàng",
        "Tùy chỉnh giáo án tập luyện riêng",
        "Xuất báo cáo gắn thương hiệu cá nhân",
        "Hỗ trợ tích hợp cổng API",
      ],
      cta: "Liên Hệ Đội Ngũ Kinh Doanh",
      featured: false,
      route: ROUTES.COMMUNITY.FEED,
    },
  ]

  return (
    <section id="pricing" className="relative border-t border-sand/30 bg-cream px-6 py-32 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 text-center">
          <div className="mb-6 flex items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.25em] text-clay">
            <span className="h-px w-8 bg-clay" />
            Bảng Giá
            <span className="h-px w-8 bg-clay" />
          </div>
          <h2 className="font-display text-5xl font-medium leading-[1.05] tracking-tight text-earth md:text-6xl lg:text-7xl">
            Lựa chọn mức độ <span className="italic-display text-clay">cam kết</span> của bạn.
          </h2>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3 lg:gap-8">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-3xl p-8 transition-all duration-500 hover:-translate-y-1 lg:p-10 ${
                p.featured
                  ? "border border-earth bg-earth text-cream"
                  : "border border-sand/60 bg-white text-earth hover:border-clay/40"
              }`}
            >
              <div className="mb-2 flex items-baseline justify-between">
                <h3 className="font-display text-2xl">{p.name}</h3>
                {p.featured && (
                  <span className="rounded-full bg-clay px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-cream">
                    Phổ Biến
                  </span>
                )}
              </div>
              <p className={`mb-6 text-sm ${p.featured ? "text-cream/60" : "text-earth/60"}`}>{p.desc}</p>
              <div className="mb-8 flex items-baseline gap-2 border-b border-current/10 pb-8">
                <span className="font-display text-5xl tracking-tight">{p.price}</span>
                <span className={`text-sm ${p.featured ? "text-cream/60" : "text-earth/50"}`}>{p.period}</span>
              </div>
              <ul className="mb-10 space-y-3">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className={`flex items-start gap-3 text-sm ${p.featured ? "text-cream/80" : "text-earth/70"}`}
                  >
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-clay" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className={`h-auto w-full rounded-full py-3.5 text-sm font-medium transition-all duration-300 hover:scale-[1.02] ${
                  p.featured
                    ? "bg-clay text-cream hover:bg-cream hover:text-earth"
                    : "bg-earth text-cream hover:bg-clay"
                }`}
                onClick={() => navigate(p.route)}
              >
                {p.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CommunityFooter({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  return (
    <footer id="community" className="relative border-t border-sand/40 bg-cream px-6 pb-10 pt-20 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="font-display mb-5 flex items-center gap-2.5 text-3xl font-bold text-earth">
              <span className="flex size-8 items-center justify-center rounded-full bg-earth">
                <span className="size-3 rounded-full bg-clay" />
              </span>
              COREFORM
            </div>
            <p className="mb-6 max-w-md text-sm leading-relaxed text-earth/60">
              Trí tuệ tập luyện chuẩn cấp độ Studio. Chúng tôi lắng nghe ngôn ngữ của cơ thể bạn lên tiếng — và chuyển
              hóa nó thành một thói quen bền vững theo thời gian.
            </p>
          </div>
          <div>
            <div className="mb-5 text-[11px] font-medium uppercase tracking-[0.2em] text-clay">Sản phẩm</div>
            <ul className="space-y-3 text-sm text-earth/70">
              <li>
                <button type="button" className="transition hover:text-clay" onClick={() => navigate(ROUTES.EXERCISES.LIST)}>
                  Tính năng
                </button>
              </li>
              <li>
                <button type="button" className="transition hover:text-clay" onClick={() => navigate(ROUTES.WORKOUTS.SAMPLE_LIST)}>
                  Hành trình
                </button>
              </li>
              <li>
                <button type="button" className="transition hover:text-clay" onClick={() => navigate(ROUTES.NUTRITION.SAMPLE)}>
                  Thực đơn
                </button>
              </li>
              <li>
                <button type="button" className="transition hover:text-clay" onClick={() => navigate(ROUTES.HISTORY)}>
                  Nhật ký tập
                </button>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-5 text-[11px] font-medium uppercase tracking-[0.2em] text-clay">Luyện tập</div>
            <ul className="space-y-3 text-sm text-earth/70">
              <li>
                <button type="button" className="transition hover:text-clay" onClick={() => navigate(ROUTES.WORKOUTS.MY_LIST)}>
                  Kế hoạch của tôi
                </button>
              </li>
              <li>
                <button type="button" className="transition hover:text-clay" onClick={() => navigate(ROUTES.WORKOUTS.SAMPLE_LIST)}>
                  Kế hoạch mẫu
                </button>
              </li>
              <li>
                <button type="button" className="transition hover:text-clay" onClick={() => navigate(ROUTES.NUTRITION.MY_MEALS)}>
                  Thực đơn của tôi
                </button>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-5 text-[11px] font-medium uppercase tracking-[0.2em] text-clay">Cộng đồng</div>
            <ul className="space-y-3 text-sm text-earth/70">
              <li>
                <button type="button" className="transition hover:text-clay" onClick={() => navigate(ROUTES.COMMUNITY.FEED)}>
                  Bảng feed
                </button>
              </li>
              <li>
                <button type="button" className="transition hover:text-clay" onClick={() => navigate(ROUTES.COMMUNITY.MY_POSTS)}>
                  Bài viết của tôi
                </button>
              </li>
              <li>
                <button type="button" className="transition hover:text-clay" onClick={() => navigate(ROUTES.PROFILE)}>
                  Hồ sơ cá nhân
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-sand/40 pt-8 text-xs text-earth/50">
          <div>© 2025 COREFORM Studio. Bảo lưu mọi quyền.</div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-clay" />
            <span>Hệ thống đang vận hành ổn định · v3.2.1</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export function Dashboard() {
  const navigate = useNavigate()
  const auth = authStore.use.auth()
  const { data, isLoading, isError } = useGetDashboardData(auth.id)

  const dashboardMetrics = useMemo(() => {
    if (!data) return []

    const bmiStatus = getBMIStatus(data.bmi)
    const calorieDelta = data.targetCalories - data.tdee

    return [
      {
        label: "Chỉ số BMI",
        value: formatMetric(data.bmi, 1),
        helper: "Đánh giá nhanh tỷ lệ cơ thể",
        tag: bmiStatus.label,
        tagClassName: bmiStatus.className,
        tagDotClassName: bmiStatus.dotClassName,
        icon: Activity,
        progress: Math.min(Math.max((data.bmi / 35) * 100, 12), 100),
      },
      {
        label: "TDEE",
        value: formatMetric(data.tdee),
        helper: "Calo tiêu thụ hằng ngày",
        tag: "Daily burn",
        tagClassName: "border-sand bg-sand-light/60 text-clay",
        tagDotClassName: "bg-clay",
        icon: Flame,
        progress: 72,
      },
      {
        label: "Calo mục tiêu",
        value: formatMetric(data.targetCalories),
        helper: "Calo nên nạp mỗi ngày",
        tag: `${calorieDelta > 0 ? "+" : ""}${formatMetric(calorieDelta)} so với TDEE`,
        tagClassName:
          calorieDelta >= 0
            ? "border-[#86A873]/25 bg-[#F2F7EE] text-[#587443]"
            : "border-[#B35F4A]/25 bg-[#FFF0ED] text-[#9C4433]",
        tagDotClassName: calorieDelta >= 0 ? "bg-[#86A873]" : "bg-[#B35F4A]",
        icon: Target,
        progress: calorieDelta >= 0 ? 82 : 58,
      },
    ]
  }, [data])

  if (isLoading) {
    return (
      <PageLayout title="COREFORM — Chuẩn Hóa Tư Thế" variant="landing">
        <main className="relative min-h-screen bg-cream text-earth">
          <div className="dashboard-noise" aria-hidden="true" />
          <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1fr_0.92fr] lg:px-12 lg:py-24">
            <div className="flex flex-col justify-center space-y-7">
              <Skeleton className="h-8 w-64 rounded-full bg-sand-light" />
              <Skeleton className="h-28 w-full max-w-2xl bg-sand-light" />
              <Skeleton className="h-20 w-full max-w-xl bg-sand-light/80" />
              <div className="flex gap-3">
                <Skeleton className="h-12 w-44 rounded-full bg-sand" />
                <Skeleton className="h-12 w-36 rounded-full bg-sand-light" />
              </div>
            </div>
            <Skeleton className="min-h-[520px] rounded-[2rem] bg-sand-light" />
          </section>
        </main>
      </PageLayout>
    )
  }

  if (isError || !data) {
    return (
      <PageLayout title="COREFORM — Chuẩn Hóa Tư Thế" variant="landing">
        <main className="relative flex min-h-[70vh] items-center justify-center bg-cream px-4 text-earth">
          <div className="dashboard-noise" aria-hidden="true" />
          <section className="max-w-xl rounded-3xl border border-sand bg-white p-8 text-center shadow-xl shadow-earth/5">
            <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-2xl bg-earth/5 text-clay">
              <Activity className="size-6" />
            </div>
            <h1 className="font-display text-2xl font-medium">Không thể tải dữ liệu</h1>
            <p className="mt-3 text-sm leading-6 text-earth/65">
              Vui lòng thử lại sau để xem dashboard sức khỏe của bạn.
            </p>
          </section>
        </main>
      </PageLayout>
    )
  }

  return (
    <PageLayout title="COREFORM — Chuẩn Hóa Tư Thế. Theo Dõi Chỉ Số. Bứt Phá Giới Hạn." variant="landing">
      <main className="relative min-h-screen overflow-x-hidden bg-cream text-earth">
        <div className="dashboard-noise" aria-hidden="true" />
        <HeroSection navigate={navigate} />
        <BodyDashboardSection
          metrics={dashboardMetrics}
          weightGap={data.weightGap}
          estimatedWeeksToGoal={data.estimatedWeeksToGoal}
          paceWarning={data.paceWarning}
        />
        <RecommendationsSection
          navigate={navigate}
          usedFallback={data.usedFallback}
          planSuggestions={data.workoutPlanSuggestions ?? []}
          menuSuggestions={data.menuSuggestions ?? []}
        />
        <ManifestoSection />
        <FeaturesSection navigate={navigate} />
        <BeginnerGuideSection navigate={navigate} />
        <PricingSection navigate={navigate} />
        <CommunityFooter navigate={navigate} />
      </main>
    </PageLayout>
  )
}
