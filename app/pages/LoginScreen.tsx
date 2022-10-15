import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { View, TextInput, StyleSheet, Text, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Snackbar from 'react-native-snackbar'
import validator from 'validator'
import _ from 'lodash'

import { LoginScreenProps } from 'pages/types'

interface IUser {
  login: string
  password: string
}

const LoginScreen = () => {
  const users = useRef<Array<IUser>>([
    { login: 'yura.malyshko10@gmail.com', password: '12345678' },
    { login: 'user@mail.com', password: 'qwertyuiop' },
  ]).current

  const navigation = useNavigation<LoginScreenProps['navigation']>()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [emailWarn, setEmailWarn] = useState(false)

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setPassword('')
      setEmail('')
    })

    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (emailWarn) {
      setEmailWarn(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email])

  const validateHandler = useCallback(() => {
    if (!validator.isEmail(email)) {
      setEmailWarn(true)
      return
    }

    const userIndex = _.findIndex(users, { login: email })

    if (userIndex === -1) {
      Snackbar.show({
        text: 'This email is not registered',
        duration: Snackbar.LENGTH_SHORT,
      })
    } else if (users[userIndex].password === password) {
      navigation.navigate('HomeScreen')
    } else if (users[userIndex].password !== password) {
      Snackbar.show({
        text: 'Wrong password',
        duration: Snackbar.LENGTH_SHORT,
      })
    }
  }, [email, navigation, password, users])

  const btnComponent = useMemo(() => {
    let backColor
    if (email.length > 0 && password.length > 0) {
      backColor = 'black'
    } else {
      backColor = 'lightgrey'
    }
    return (
      <Pressable
        onPress={validateHandler}
        style={[styles.confirmBtn, { backgroundColor: backColor }]}
      >
        <Text style={styles.confirmText}>Login</Text>
      </Pressable>
    )
  }, [email.length, password.length, validateHandler])

  const emailWarnComponent = useMemo(() => {
    let text = ''
    if (emailWarn) {
      console.log('asdasdasd')
      text = 'Incorrect email'
    }
    return (
      <View style={styles.warnContainer}>
        <Text style={styles.warnText}>{text}</Text>
      </View>
    )
  }, [emailWarn])

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Email</Text>
      </View>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        keyboardType='email-address'
        autoCapitalize='none'
        cursorColor={'black'}
      />
      {emailWarnComponent}

      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Password</Text>
      </View>

      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        autoCapitalize='none'
        cursorColor={'black'}
        secureTextEntry
      />

      {btnComponent}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', justifyContent: 'center' },
  titleContainer: {
    marginLeft: 15,
    marginTop: 25,
  },
  titleText: {
    fontWeight: '400',
    fontSize: 12,
    color: 'grey',
  },
  input: {
    fontWeight: '400',
    fontSize: 16,
    color: 'black',
    marginHorizontal: 15,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
    marginBottom: 15,
  },
  confirmBtn: {
    marginHorizontal: 15,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 99,
    marginTop: 50,
  },
  confirmText: { fontWeight: '600', fontSize: 16, color: 'white' },
  warnContainer: {
    marginLeft: 15,
  },
  warnText: {
    fontWeight: '400',
    fontSize: 12,
    color: 'red',
  },
})

export default LoginScreen
