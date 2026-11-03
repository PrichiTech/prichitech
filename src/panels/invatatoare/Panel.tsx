import { useState } from 'react'
import {
  clearResults,
  updateSettings,
  useResults,
  useSettings,
  type Difficulty,
  type GameModule,
  type PanelProps,
  type SoundMode,
} from '@/core'
import styles from './Panel.module.css'

const SOUND_OPTIONS: { value: SoundMode; label: string; help: string }[] = [
  { value: 'pornit', label: '🔊 Pornit', help: 'Efecte sonore și instrucțiuni rostite automat.' },
  {
    value: 'clasa',
    label: '🏫 Mod clasă',
    help: 'Fără efecte sonore. Instrucțiunea se aude doar dacă copilul apasă 🔊.',
  },
  { value: 'oprit', label: '🔇 Oprit', help: 'Liniște totală; rămân vibrațiile și animațiile.' },
]

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string }[] = [
  { value: 1, label: 'Ușor' },
  { value: 2, label: 'Mediu' },
  { value: 3, label: 'Greu' },
]

function Choice<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div className={styles.choice} role="radiogroup">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          className={option.value === value ? styles.choiceOn : styles.choiceOff}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

function SettingsSection({ games }: { games: readonly GameModule[] }) {
  const settings = useSettings()
  const [newPin, setNewPin] = useState('')
  const soundHelp = SOUND_OPTIONS.find((option) => option.value === settings.sound)?.help

  function toggleGame(id: string) {
    const disabled = settings.disabledGames.includes(id)
      ? settings.disabledGames.filter((gameId) => gameId !== id)
      : [...settings.disabledGames, id]
    updateSettings({ disabledGames: disabled })
  }

  return (
    <>
      <section className={styles.card}>
        <h2>Sunet</h2>
        <Choice
          options={SOUND_OPTIONS}
          value={settings.sound}
          onChange={(sound) => updateSettings({ sound })}
        />
        <p className={styles.help}>{soundHelp}</p>
      </section>

      <section className={styles.card}>
        <h2>Dificultate</h2>
        <Choice
          options={DIFFICULTY_OPTIONS}
          value={settings.difficulty}
          onChange={(difficulty) => updateSettings({ difficulty })}
        />
      </section>

      <section className={styles.card}>
        <h2>Jocuri afișate copiilor</h2>
        <ul className={styles.gameList}>
          {games.map((game) => (
            <li key={game.id}>
              <label>
                <input
                  type="checkbox"
                  checked={!settings.disabledGames.includes(game.id)}
                  onChange={() => toggleGame(game.id)}
                />
                <span aria-hidden>{game.icon}</span> {game.title}
                <small> · {game.category}</small>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.card}>
        <h2>Cod PIN</h2>
        <form
          className={styles.pinForm}
          onSubmit={(event) => {
            event.preventDefault()
            if (/^\d{4}$/.test(newPin)) {
              updateSettings({ pin: newPin })
              setNewPin('')
            }
          }}
        >
          <input
            inputMode="numeric"
            pattern="\d{4}"
            maxLength={4}
            placeholder="4 cifre"
            value={newPin}
            onChange={(event) => setNewPin(event.target.value.replace(/\D/g, ''))}
          />
          <button type="submit" disabled={newPin.length !== 4}>
            Schimbă PIN-ul
          </button>
        </form>
      </section>
    </>
  )
}

function formatDuration(ms: number) {
  const seconds = Math.round(ms / 1000)
  return seconds < 60 ? `${seconds} s` : `${Math.floor(seconds / 60)} min ${seconds % 60} s`
}

function ResultsSection({ games }: { games: readonly GameModule[] }) {
  const results = useResults()
  const titleOf = (id: string) => games.find((game) => game.id === id)?.title ?? id

  const summary = games
    .map((game) => {
      const own = results.filter((result) => result.gameId === game.id)
      const average = own.reduce((sum, result) => sum + result.stars, 0) / (own.length || 1)
      return { game, plays: own.length, average }
    })
    .filter((row) => row.plays > 0)

  return (
    <section className={`${styles.card} ${styles.wide}`}>
      <h2>Rezultate pe această tabletă</h2>
      {results.length === 0 ? (
        <p className={styles.help}>Încă nu s-a jucat nimic.</p>
      ) : (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Joc</th>
                <th>Jocuri terminate</th>
                <th>Media stelelor</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((row) => (
                <tr key={row.game.id}>
                  <td>
                    {row.game.icon} {row.game.title}
                  </td>
                  <td>{row.plays}</td>
                  <td>
                    {'★'.repeat(Math.round(row.average))} ({row.average.toFixed(1)})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Ultimele jocuri</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Când</th>
                <th>Joc</th>
                <th>Dificultate</th>
                <th>Stele</th>
                <th>Greșeli</th>
                <th>Durată</th>
              </tr>
            </thead>
            <tbody>
              {results.slice(0, 20).map((result) => (
                <tr key={result.at}>
                  <td>{new Date(result.at).toLocaleString('ro-RO')}</td>
                  <td>{titleOf(result.gameId)}</td>
                  <td>{DIFFICULTY_OPTIONS[result.difficulty - 1]?.label}</td>
                  <td>{'★'.repeat(result.stars)}</td>
                  <td>{result.mistakes}</td>
                  <td>{formatDuration(result.durationMs)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            className={styles.danger}
            onClick={() => {
              if (window.confirm('Ștergeți toate rezultatele de pe această tabletă?'))
                clearResults()
            }}
          >
            Șterge rezultatele
          </button>
        </>
      )}
    </section>
  )
}

export function TeacherPanel({ games }: PanelProps) {
  return (
    <div className={styles.grid}>
      <SettingsSection games={games} />
      <ResultsSection games={games} />
    </div>
  )
}
