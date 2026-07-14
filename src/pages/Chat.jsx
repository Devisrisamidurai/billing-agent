import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { clarify, simulate } from '../api/simulate'
import { getConversationMessages } from '../api/conversations'
import ResultCard from '../components/ResultCard'
import './chat.css'

// The demo tenant contract. Real deployments would resolve this from the
// authenticated user's active contract.
const CONTRACT_ID = 'CTR-001'

let localIdSeq = 0
const nextId = () => `local-${Date.now()}-${localIdSeq++}`

function ChatView({ routeId }) {
  const navigate = useNavigate()
  const location = useLocation()

  const [conversationId, setConversationId] = useState(routeId ?? null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState(location.state?.prompt ?? '')
  const [pending, setPending] = useState(false)
  const [clarification, setClarification] = useState(null)
  const [lastQuery, setLastQuery] = useState('')  // Track last query for clarification context
  const [error, setError] = useState(null)
  const [historyLoading, setHistoryLoading] = useState(Boolean(routeId))

  const threadRef = useRef(null)

  // Load an existing conversation's messages when opened from history.
  // State is reset via the component `key`, so no synchronous resets here.
  useEffect(() => {
    if (!routeId) return undefined
    let active = true
    getConversationMessages(routeId)
      .then((data) => {
        if (!active) return
        setMessages(
          (data ?? []).map((m) => ({
            id: m.messageId,
            role: m.role === 'ASSISTANT' ? 'assistant' : 'user',
            content: m.content,
          })),
        )
      })
      .catch(() => active && setError('Could not load this conversation.'))
      .finally(() => active && setHistoryLoading(false))
    return () => {
      active = false
    }
  }, [routeId])

  // Clear the one-shot navigation state after seeding the composer.
  useEffect(() => {
    if (location.state?.prompt) {
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location, navigate])

  // Keep the thread scrolled to the latest message.
  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight })
  }, [messages, pending])

  const applyResponse = useCallback(
    (response) => {
      // Adopt the server conversation id (first turn of a new chat).
      if (response.conversationId && response.conversationId !== conversationId) {
        setConversationId(response.conversationId)
        // Don't navigate to /chat/{id} — no conversation persistence yet.
        // This prevents remount which would clear messages.
      }

      if (response.status === 'NEEDS_CLARIFICATION') {
        setClarification({
          conversationId: response.conversationId,
          questions: response.clarificationQuestions ?? [],
        })
        return
      }

      if (response.status === 'ERROR') {
        setError(response.errorMessage || 'Something went wrong.')
        return
      }

      // SUCCESS
      setClarification(null)
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: 'assistant',
          content: response.result?.explanation,
          result: response.result,
          disclaimer: response.disclaimer,
        },
      ])
    },
    [conversationId, routeId, navigate],
  )

  const send = useCallback(
    async (text) => {
      const query = text.trim()
      if (!query || pending) return
      setError(null)
      setInput('')
      setLastQuery(query)  // Track for clarification context
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: 'user', content: query },
      ])
      setPending(true)
      try {
        const response = await simulate({
          contractId: CONTRACT_ID,
          naturalLanguageQuery: query,
          conversationId: conversationId ?? undefined,
        })
        applyResponse(response)
      } catch {
        setError('Request failed. Please try again.')
      } finally {
        setPending(false)
      }
    },
    [pending, conversationId, applyResponse],
  )

  const answerClarification = useCallback(
    async (field, value) => {
      if (pending) return
      setError(null)
      setClarification(null)
      // Combine original question + clarification answer for full context
      const combined = lastQuery ? `${lastQuery} — ${value}` : value
      send(combined)
    },
    [pending, send, lastQuery],
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    send(input)
  }

  const isEmpty = messages.length === 0 && !pending && !historyLoading

  return (
    <div className="chat">
      <div className="chat__thread" ref={threadRef}>
        {historyLoading && (
          <p className="chat__status">Loading conversation…</p>
        )}

        {isEmpty && (
          <div className="chat__welcome">
            <h1>Ask about your shipping costs</h1>
            <p>
              Try “What if I ship 35 packages a week instead of 20?” Results are
              projections, not quotes.
            </p>
            <div className="chat__suggestions">
              {[
                'What if I ship 35 packages/week instead of 20?',
                'How much would switching to 2-Day service cost?',
                'What accessorial fees are driving my bill up?',
              ].map((s) => (
                <button
                  key={s}
                  type="button"
                  className="chat__suggestion"
                  onClick={() => send(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`bubble bubble--${m.role}`}>
            {m.result ? (
              <ResultCard result={m.result} disclaimer={m.disclaimer} />
            ) : (
              <p className="bubble__text">{m.content}</p>
            )}
          </div>
        ))}

        {clarification && (
          <div className="bubble bubble--assistant">
            {clarification.questions.map((q) => (
              <div key={q.field} className="clarify">
                <p className="clarify__question">{q.question}</p>
                <div className="clarify__chips">
                  {q.suggestedOptions?.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className="clarify__chip"
                      onClick={() => answerClarification(q.field, opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {pending && (
          <div className="bubble bubble--assistant">
            <div className="typing" aria-label="Assistant is typing">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="chat__error" role="alert">
          {error}
        </div>
      )}

      <form className="chat__composer" onSubmit={handleSubmit}>
        <textarea
          className="chat__input"
          placeholder="Ask a what-if question about your shipping costs…"
          value={input}
          rows={1}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              send(input)
            }
          }}
        />
        <button
          type="submit"
          className="chat__send"
          disabled={pending || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  )
}

// Remount ChatView per conversation so its local state resets cleanly.
function Chat() {
  const { conversationId: routeId } = useParams()
  const location = useLocation()
  const resetKey = location.state?.reset || ''
  return <ChatView key={`${routeId ?? 'new'}-${resetKey}`} routeId={routeId} />
}

export default Chat
