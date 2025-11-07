import '@happy-dom/global-registrator';

import { Window as HappyWindow } from 'happy-dom'

const win = new HappyWindow()

;(globalThis as any).window = win
;(globalThis as any).document = win.document
;(globalThis as any).HTMLElement = win.HTMLElement
;(globalThis as any).Event = win.Event
;(globalThis as any).MouseEvent = win.MouseEvent
;(globalThis as any).FocusEvent = win.FocusEvent
;(globalThis as any).KeyboardEvent = win.KeyboardEvent
;(globalThis as any).navigator = win.navigator
;(globalThis as any).getComputedStyle = win.getComputedStyle.bind(win)
;(globalThis as any).requestAnimationFrame = win.requestAnimationFrame.bind(win)
;(globalThis as any).cancelAnimationFrame = win.cancelAnimationFrame.bind(win)
;(globalThis as any).self = globalThis