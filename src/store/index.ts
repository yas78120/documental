// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import doc from 'src/store/apps/doc'
import user from 'src/store/apps/user'
export const store = configureStore({
  reducer: {
    doc: doc,
    user: user
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
