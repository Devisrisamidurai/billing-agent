import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Minimal data-fetching hook: runs `fetcher` once on mount and exposes
 * { data, loading, error, refetch }. Keeps the dependency surface small
 * (no external query library). `refetch` re-runs the latest fetcher.
 */
export function useFetch(fetcher) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const fetcherRef = useRef(fetcher)

  // Keep the latest fetcher without reading the ref during render.
  useEffect(() => {
    fetcherRef.current = fetcher
  })

  // Event-driven reload (retry buttons). Safe to setState here.
  const refetch = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }))
    return fetcherRef
      .current()
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => setState({ data: null, loading: false, error }))
  }, [])

  // Initial load. State already starts as loading, so no sync setState here.
  useEffect(() => {
    let active = true
    fetcherRef
      .current()
      .then((data) => active && setState({ data, loading: false, error: null }))
      .catch((error) => active && setState({ data: null, loading: false, error }))
    return () => {
      active = false
    }
  }, [])

  return { ...state, refetch }
}
