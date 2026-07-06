import { useEffect } from "react"

export function CoreformCursor() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return

    const dot = document.querySelector<HTMLElement>(".cursor-dot")
    const ring = document.querySelector<HTMLElement>(".cursor-ring")
    if (!dot || !ring) return

    let mx = 0
    let my = 0
    let rx = 0
    let ry = 0
    let visible = false
    let frameId = 0

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      if (!visible) {
        dot.classList.add("is-visible")
        ring.classList.add("is-visible")
        visible = true
      }
      dot.style.transform = `translate(${mx - 3}px, ${my - 3}px)`
    }

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (target?.closest("a,button,[data-cursor-hover]")) {
        ring.style.width = "60px"
        ring.style.height = "60px"
        ring.style.borderColor = "rgba(140,98,57,0.6)"
      } else {
        ring.style.width = "32px"
        ring.style.height = "32px"
        ring.style.borderColor = "rgba(74,53,37,0.4)"
      }
    }

    const onLeave = () => {
      dot.classList.remove("is-visible")
      ring.classList.remove("is-visible")
      visible = false
    }

    const tick = () => {
      rx += (mx - rx) * 0.18
      ry += (my - ry) * 0.18
      ring.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`
      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseover", onOver)
    document.addEventListener("mouseleave", onLeave)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseover", onOver)
      document.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  return (
    <>
      <div className="cursor-ring" aria-hidden="true" />
      <div className="cursor-dot" aria-hidden="true" />
    </>
  )
}
