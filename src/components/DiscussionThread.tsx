import { useState } from 'react'
import { Heart, MessageCircle, Send } from 'lucide-react'
import { formatDate, useApp } from '../context/AppContext'
import type { Discussion } from '../types'
import { Avatar } from './Avatar'

export function DiscussionThread({ discussion }: { discussion: Discussion }) {
  const { user, toggleDiscussionLike, addReply } = useApp()
  const [replyText, setReplyText] = useState('')
  const [showReplyForm, setShowReplyForm] = useState(false)
  const liked = discussion.likedBy.includes(user.id)

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return
    addReply(discussion.id, replyText.trim())
    setReplyText('')
    setShowReplyForm(false)
  }

  return (
    <article className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <Avatar initials={discussion.authorAvatar} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-stone-900">{discussion.title}</h3>
            <span className="text-xs text-stone-400">{formatDate(discussion.createdAt)}</span>
          </div>
          <p className="mt-0.5 text-xs text-stone-500">by {discussion.author}</p>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">{discussion.content}</p>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {discussion.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-4 border-t border-stone-100 pt-3">
            <button
              type="button"
              onClick={() => toggleDiscussionLike(discussion.id)}
              className={`flex items-center gap-1.5 text-sm transition ${
                liked ? 'text-rose-600' : 'text-stone-500 hover:text-rose-600'
              }`}
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
              {discussion.likes}
            </button>
            <button
              type="button"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-1.5 text-sm text-stone-500 transition hover:text-emerald-600"
            >
              <MessageCircle className="h-4 w-4" />
              {discussion.replies.length} replies
            </button>
          </div>

          {discussion.replies.length > 0 && (
            <div className="mt-4 space-y-3 border-l-2 border-stone-100 pl-4">
              {discussion.replies.map((reply) => (
                <div key={reply.id} className="flex gap-2">
                  <Avatar initials={reply.authorAvatar} size="sm" />
                  <div>
                    <p className="text-xs font-medium text-stone-700">
                      {reply.author}{' '}
                      <span className="font-normal text-stone-400">
                        · {formatDate(reply.createdAt)}
                      </span>
                    </p>
                    <p className="mt-0.5 text-sm text-stone-600">{reply.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showReplyForm && (
            <form onSubmit={handleReply} className="mt-4 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
              />
              <button
                type="submit"
                className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                <Send className="h-4 w-4" />
                Reply
              </button>
            </form>
          )}
        </div>
      </div>
    </article>
  )
}

export function NewDiscussionForm() {
  const { addDiscussion } = useApp()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    addDiscussion(
      title.trim(),
      content.trim(),
      tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    )
    setTitle('')
    setContent('')
    setTags('')
    setOpen(false)
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border-2 border-dashed border-stone-200 bg-white p-4 text-sm font-medium text-stone-500 transition hover:border-emerald-300 hover:text-emerald-600"
      >
        + Start a new discussion
      </button>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
    >
      <h3 className="mb-4 font-semibold text-stone-900">New Discussion</h3>
      <div className="space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Discussion title"
          className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows={3}
          className="w-full resize-none rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
          required
        />
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma separated, e.g. careers, mentorship)"
          className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
        />
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Post Discussion
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
