
import { useEffect, useState } from "react"
import { columns } from "@/components/data-table/components/columns"
import { DataTable } from "@/components/data-table/components/data-table"
import { UserNav } from "@/components/data-table/components/user-nav"
// import { taskSchema } from "./data/schema"
import { getEntries } from "@/db"

import { Entry } from "@/components/data-table/data/schema"
import { ColumnDef } from "@tanstack/react-table"

// Simulate a database read for tasks.
// async function getTasks() {
//   const data = await fs.readFile(
//     path.join(process.cwd(), "app/(app)/examples/tasks/data/tasks.json")
//   )

//   const tasks = JSON.parse(data.toString())

//   return z.array(taskSchema).parse(tasks)
// }

export default function DataTablePage() {
  const [entries, setEntries] = useState<Entry[]>([])

  const loadEntries = async () => {
    const res = await getEntries() as Entry[]
    console.log(res)
    setEntries(res)
  }

  useEffect(() => {
    loadEntries()
  }, [])

  return (
    <>
      <div className="">
        
      </div>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your entries!
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <UserNav />
          </div>
        </div>
        <DataTable data={entries} columns={columns as ColumnDef<Entry>[]} />
      </div>
    </>
  )
}
