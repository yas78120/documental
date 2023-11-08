// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import doc from 'src/store/apps/doc'
import docType from 'src/store/apps/docType'
import user from 'src/store/apps/user'
import workflow from 'src/store/apps/workflow'
export const store = configureStore({
  reducer: {
    doc,
    user,
    workflow,
    docType
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
