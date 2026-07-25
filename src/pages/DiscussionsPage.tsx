import { DiscussionThread, NewDiscussionForm } from '../components/DiscussionThread'
import { useApp } from '../context/AppContext'

export function DiscussionsPage() {
  const { discussions } = useApp()

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Discussions</h1>
        <p className="mt-1 text-sm text-stone-500">
          Share ideas, ask questions, and engage with fellow community members
        </p>
      </div>

      <div className="mb-6">
        <NewDiscussionForm />
      </div>

      <div className="space-y-4">
        {discussions.map((d) => (
          <DiscussionThread key={d.id} discussion={d} />
        ))}
      </div>
    </div>
  )
}
