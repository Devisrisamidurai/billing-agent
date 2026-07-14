import { useCallback, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  deleteConversation,
  listConversations,
} from '../api/conversations'
import { useFetch } from '../hooks/useFetch'
import { dayBucket } from '../utils/format'
import UpsLogo from './UpsLogo'

const GROUP_ORDER = ['Today', 'Yesterday', 'Previous 7 days', 'Older']

function Sidebar({ mobileOpen, onCloseMobile }) {
  const navigate = useNavigate()
  const { conversationId: activeId } = useParams()
  const { data, loading, error, refetch } = useFetch(listConversations)

  const conversations = useMemo(() => data ?? [], [data])

  const grouped = useMemo(() => {
    const buckets = {}
    for (const convo of conversations) {
      const key = dayBucket(convo.updatedAt)
      ;(buckets[key] ??= []).push(convo)
    }
    return buckets
  }, [conversations])

  const handleNewChat = useCallback(() => {
    navigate('/chat', { state: { reset: Date.now() } })
    onCloseMobile?.()
  }, [navigate, onCloseMobile])

  const handleOpen = useCallback(
    (id) => {
      navigate(`/chat/${id}`)
      onCloseMobile?.()
    },
    [navigate, onCloseMobile],
  )

  const handleDelete = useCallback(
    async (e, id) => {
      e.stopPropagation()
      try {
        await deleteConversation(id)
        if (id === activeId) navigate('/chat')
        refetch()
      } catch {
        /* surfaced by the list on next refetch */
      }
    },
    [activeId, navigate, refetch],
  )

  return (
    <aside className={`sidebar${mobileOpen ? ' sidebar--open' : ''}`}>
      <div className="sidebar__brand">
        <UpsLogo size={34} />
        <span className="sidebar__brand-text">Billing&nbsp;Agent</span>
      </div>

      <button type="button" className="sidebar__new" onClick={handleNewChat}>
        <span aria-hidden="true">＋</span> New Chat
      </button>

      <nav className="sidebar__history" aria-label="Chat history">
        {loading && (
          <div className="sidebar__skeletons" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="sidebar__skeleton" />
            ))}
          </div>
        )}

        {error && !loading && (
          <p className="sidebar__empty">
            Couldn&apos;t load history.{' '}
            <button type="button" className="link-btn" onClick={refetch}>
              Retry
            </button>
          </p>
        )}

        {!loading && !error && conversations.length === 0 && (
          <p className="sidebar__empty">No conversations yet.</p>
        )}

        {!loading &&
          !error &&
          GROUP_ORDER.filter((g) => grouped[g]?.length).map((group) => (
            <div key={group} className="sidebar__group">
              <p className="sidebar__group-label">{group}</p>
              <ul className="sidebar__list">
                {grouped[group].map((convo) => (
                  <li
                    key={convo.conversationId}
                    className={`sidebar__item${
                      convo.conversationId === activeId
                        ? ' sidebar__item--active'
                        : ''
                    }`}
                    onClick={() => handleOpen(convo.conversationId)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleOpen(convo.conversationId)
                      }
                    }}
                  >
                    <span className="sidebar__item-text">
                      <span className="sidebar__item-title">{convo.title}</span>
                      <span className="sidebar__item-preview">
                        {convo.lastMessagePreview}
                      </span>
                    </span>
                    <button
                      type="button"
                      className="sidebar__delete"
                      aria-label={`Delete ${convo.title}`}
                      onClick={(e) => handleDelete(e, convo.conversationId)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </nav>
    </aside>
  )
}

export default Sidebar
