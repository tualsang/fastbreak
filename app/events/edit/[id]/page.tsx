import { getEventById } from '@/app/actions/events'
import { EventForm } from '@/components/event-form'
import { redirect } from 'next/navigation'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditEventPage({ params }: PageProps) {
  const { id } = await params
  const result = await getEventById(id)

  if (!result.success) {
    redirect('/dashboard')
  }

  return <EventForm event={result.data} mode="edit" />
}