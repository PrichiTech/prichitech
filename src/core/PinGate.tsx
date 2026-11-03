import { useState } from 'react'
import { useSettings, setTeacherUnlocked } from './settings'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫']

interface Props {
  onUnlock: () => void
  onCancel: () => void
}

/** Protejează zona învățătoarei. Copiii nu pot citi instrucțiunile și nu cunosc codul. */
export function PinGate({ onUnlock, onCancel }: Props) {
  const { pin } = useSettings()
  const [entered, setEntered] = useState('')
  const [wrong, setWrong] = useState(false)

  function press(key: string) {
    if (key === '⌫') {
      setEntered((value) => value.slice(0, -1))
      return
    }
    const next = entered + key
    setWrong(false)
    if (next.length < pin.length) {
      setEntered(next)
    } else if (next === pin) {
      setTeacherUnlocked(true)
      onUnlock()
    } else {
      setWrong(true)
      setEntered('')
    }
  }

  return (
    <div className="pin-gate">
      <h1>Zona învățătoarei</h1>
      <p>Introduceți codul PIN</p>
      <div className={`pin-dots${wrong ? ' ui-shake' : ''}`} aria-live="polite">
        {Array.from(pin, (_, i) => (
          <span key={i} className={i < entered.length ? 'pin-dot pin-dot--on' : 'pin-dot'} />
        ))}
      </div>
      {wrong && <p className="pin-error">Cod greșit. Încercați din nou.</p>}
      <div className="pin-pad">
        {KEYS.map((key, i) =>
          key ? (
            <button key={i} type="button" className="pin-key" onClick={() => press(key)}>
              {key}
            </button>
          ) : (
            <span key={i} />
          ),
        )}
      </div>
      <button type="button" className="pin-cancel" onClick={onCancel}>
        ⬅ Înapoi
      </button>
      {pin === '1234' && (
        <p className="pin-help">Codul implicit este 1234. Îl puteți schimba din setări.</p>
      )}
    </div>
  )
}
