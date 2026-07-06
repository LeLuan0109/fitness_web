import { create } from "zustand"

type TransitionMode = "enter" | "exit" | null

type TransitionState = {
  mode: TransitionMode
  isPlaying: boolean
  onComplete: (() => void) | null
  playEnter: (onComplete: () => void) => void
  playExit: (onComplete: () => void) => void
  finish: () => void
}

const transitionStore = create<TransitionState>((set, get) => ({
  mode: null,
  isPlaying: false,
  onComplete: null,

  playEnter: (onComplete) => {
    set({ mode: "enter", isPlaying: true, onComplete })
  },

  playExit: (onComplete) => {
    set({ mode: "exit", isPlaying: true, onComplete })
  },

  finish: () => {
    const callback = get().onComplete
    set({ mode: null, isPlaying: false, onComplete: null })
    callback?.()
  },
}))

export default transitionStore
