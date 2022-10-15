import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { Provider } from 'react-redux'

import {} from '@gorhom/bottom-sheet'

import RootRoutes from 'routes/RootRoutes'
import { store } from 'store/store'

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <RootRoutes />
      </Provider>
    </GestureHandlerRootView>
  )
}

export default App
