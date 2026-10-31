import { useEffect, useState } from 'react'
import { config } from '../config'

type ApiStatus =
  | { state: 'cargando' }
  | { state: 'ok'; version: string }
  | { state: 'error' }

const shortSha = (sha: string) => (/^[0-9a-f]{40}$/.test(sha) ? sha.slice(0, 7) : sha)

// Enlace al commit en GitHub (solo si la versión es un SHA real y conocemos el repositorio).
function CommitLink({ sha }: { sha: string }) {
  const isSha = /^[0-9a-f]{40}$/.test(sha)
  if (!isSha || config.repoUrl === '') return <code>{shortSha(sha)}</code>
  return (
    <a href={`${config.repoUrl}/commit/${sha}`} target="_blank" rel="noreferrer" title={sha}>
      <code>{shortSha(sha)}</code>
    </a>
  )
}

export default function VersionFooter() {
  const [api, setApi] = useState<ApiStatus>({ state: 'cargando' })

  useEffect(() => {
    // La versión de la API sale de su health check (anónimo, permitido por CORS).
    // Así se ve si web y API corren el mismo commit después de un despliegue.
    const controller = new AbortController()
    fetch(`${config.apiUrl}/health/live`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((body: { version?: string }) => setApi({ state: 'ok', version: body.version ?? 'desconocida' }))
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          console.warn('No se pudo obtener la versión de la API', err)
          setApi({ state: 'error' })
        }
      })
    return () => controller.abort()
  }, [])

  return (
    <footer className="footer">
      <span>
        Web <CommitLink sha={config.version} />
        {config.buildTime && <> · compilada {new Date(config.buildTime).toLocaleString()}</>}
      </span>
      <span>
        API{' '}
        {api.state === 'cargando' && <span className="muted">…</span>}
        {api.state === 'error' && <span className="footer-error">no disponible</span>}
        {api.state === 'ok' && (
          <>
            <CommitLink sha={api.version} />
            {api.version !== config.version && <span className="muted"> (distinta a la web)</span>}
          </>
        )}
      </span>
    </footer>
  )
}
