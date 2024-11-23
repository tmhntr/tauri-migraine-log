import { render } from '@testing-library/react'
import * as React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
})

export function renderWithClient(ui: React.ReactElement) {
    const testQueryClient = createTestQueryClient()
    const { rerender, ...result } = render(
        <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
    )
    return {
        ...result,
        rerender: (rerenderUi: React.ReactElement) =>
            rerender(
                <QueryClientProvider client={testQueryClient}>{rerenderUi}</QueryClientProvider>
            ),
    }
}

export function createWrapper() {
    const testQueryClient = createTestQueryClient()
    return ({ children }: {children: React.ReactNode}) => (
        <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
    )
}

// import React, {ReactElement} from 'react'
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// export const createWrapper = () => {
//   const queryClient = new QueryClient({
//     defaultOptions: {
//       queries: {
//         // ✅ turns retries off
//         retry: false,
//       },
//     },
//   })

//   return ({ children }) => (
//     <QueryClientProvider client={queryClient}>
//       {children}
//     </QueryClientProvider>
//   )
// }
