import { UserForm, UserLocationForm } from '@/components/SettingsForm'
import { createFileRoute } from '@tanstack/react-router'

const SettingsPage = () => {
  return (
    <div>
      <h1>Settings</h1>
      <div>
        <h2>User Information</h2>
        <UserForm />
      </div>
      <div>
        <h2>Location Information</h2>
        <UserLocationForm />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})
