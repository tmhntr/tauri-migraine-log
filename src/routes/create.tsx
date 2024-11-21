import CreateEntryForm from '@/components/entry-form'
const Create = () => {
  return (
    <div className="my-8 mx-auto">
      <CreateEntryForm />
    </div>
  )
}

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/create')({
  component: Create,
})
