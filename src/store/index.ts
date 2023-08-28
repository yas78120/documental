// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import doc from 'src/store/apps/doc'
export const store = configureStore({
  reducer: {
    doc
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
