import { addEntry, getEntry } from "@/db"
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Entry } from "@/types";
import CreateEntryForm from "@/components/CreateEntryForm";
const Create = () => {

  return (
    <div className="flex flex-col">
      <div>Create</div>
      <CreateEntryForm />
    </div>
  )
}


import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/create')({
  component: Create,
})