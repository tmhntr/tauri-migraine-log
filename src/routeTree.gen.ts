/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as SettingsImport } from './routes/settings'
import { Route as EditImport } from './routes/edit'
import { Route as CreateImport } from './routes/create'
import { Route as IndexImport } from './routes/index'
import { Route as EntriesIndexImport } from './routes/entries/index'

// Create/Update Routes

const SettingsRoute = SettingsImport.update({
  path: '/settings',
  getParentRoute: () => rootRoute,
} as any)

const EditRoute = EditImport.update({
  path: '/edit',
  getParentRoute: () => rootRoute,
} as any)

const CreateRoute = CreateImport.update({
  path: '/create',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const EntriesIndexRoute = EntriesIndexImport.update({
  path: '/entries/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/create': {
      id: '/create'
      path: '/create'
      fullPath: '/create'
      preLoaderRoute: typeof CreateImport
      parentRoute: typeof rootRoute
    }
    '/edit': {
      id: '/edit'
      path: '/edit'
      fullPath: '/edit'
      preLoaderRoute: typeof EditImport
      parentRoute: typeof rootRoute
    }
    '/settings': {
      id: '/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof SettingsImport
      parentRoute: typeof rootRoute
    }
    '/entries/': {
      id: '/entries/'
      path: '/entries'
      fullPath: '/entries'
      preLoaderRoute: typeof EntriesIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/create': typeof CreateRoute
  '/edit': typeof EditRoute
  '/settings': typeof SettingsRoute
  '/entries': typeof EntriesIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/create': typeof CreateRoute
  '/edit': typeof EditRoute
  '/settings': typeof SettingsRoute
  '/entries': typeof EntriesIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/create': typeof CreateRoute
  '/edit': typeof EditRoute
  '/settings': typeof SettingsRoute
  '/entries/': typeof EntriesIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/create' | '/edit' | '/settings' | '/entries'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/create' | '/edit' | '/settings' | '/entries'
  id: '__root__' | '/' | '/create' | '/edit' | '/settings' | '/entries/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  CreateRoute: typeof CreateRoute
  EditRoute: typeof EditRoute
  SettingsRoute: typeof SettingsRoute
  EntriesIndexRoute: typeof EntriesIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  CreateRoute: CreateRoute,
  EditRoute: EditRoute,
  SettingsRoute: SettingsRoute,
  EntriesIndexRoute: EntriesIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/create",
        "/edit",
        "/settings",
        "/entries/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/create": {
      "filePath": "create.tsx"
    },
    "/edit": {
      "filePath": "edit.tsx"
    },
    "/settings": {
      "filePath": "settings.tsx"
    },
    "/entries/": {
      "filePath": "entries/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
