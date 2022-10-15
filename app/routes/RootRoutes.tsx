import React, { useEffect } from 'react'
import { StyleSheet, Pressable } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack'
import { useNetInfo } from '@react-native-community/netinfo'

import Snackbar from 'react-native-snackbar'

import LoginScreen from 'pages/LoginScreen'
import HomeScreen from 'pages/HomeScreen'

import { RootStackParamList } from 'pages/types'

import Icon from 'react-native-vector-icons/MaterialIcons'

const RootStack = createStackNavigator<RootStackParamList>()

const RootRoutes = () => {
  const netInfo = useNetInfo()

  useEffect(() => {
    if (!netInfo.isConnected) {
      Snackbar.show({
        text: 'No internet',
        duration: Snackbar.LENGTH_INDEFINITE,
      })
    } else {
      Snackbar.dismiss()
    }
  }, [netInfo])

  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}
      >
        <RootStack.Screen
          name='LoginScreen'
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name='HomeScreen'
          component={HomeScreen}
          options={({ navigation }) => {
            return {
              headerStyle: { height: 56 },
              title: 'Posts',
              headerTitleAlign: 'center',
              headerLeft: () => null,
              // headerRightContainerStyle: { width: 150, backgroundColor: 'yellow' },
              headerRight: () => (
                <Pressable
                  style={styles.rightBtn}
                  onPress={() => {
                    navigation.goBack()
                  }}
                >
                  <Icon name='logout' size={26} color='black' />
                </Pressable>
              ),
            }
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  rightBtn: {
    // backgroundColor: 'red',
    height: 56,
    width: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIcon: {},
})

export default RootRoutes
