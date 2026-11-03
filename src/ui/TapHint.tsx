import type { ReactNode } from 'react'

/**
 * Instrucțiune vizuală: o mânuță care arată „atinge aici”.
 * Înlocuiește textul pe care copiii nu îl pot citi și sunetul care deranjează în clasă.
 *
 *   <TapHint show={!touched}><button>...</button></TapHint>
 */
export function TapHint({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <div className="ui-taphint">
      {children}
      {show && (
        <span className="ui-taphint-hand" aria-hidden>
          👆
        </span>
      )}
    </div>
  )
}
