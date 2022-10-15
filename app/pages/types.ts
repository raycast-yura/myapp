import type { StackScreenProps } from '@react-navigation/stack'

export type RootStackParamList = {
  LoginScreen: undefined
  HomeScreen: undefined
}

export type LoginScreenProps = StackScreenProps<RootStackParamList, 'LoginScreen'>
export type HomeScreenProps = StackScreenProps<RootStackParamList, 'HomeScreen'>
