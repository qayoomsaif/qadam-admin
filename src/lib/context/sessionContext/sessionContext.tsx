import React, { useState, createContext, useReducer, useEffect } from 'react'
import { Action, sessionReducer } from './sessionReducer'

export type Session = {
  access_token: string
  refreshToken: string
  userData: {
    phone: string
  }
}

type Dispatch = (action: Action) => void

export type SessionState = {
  session: Session | undefined
}

const initialState = {
  session: undefined,
}

export const SessionContext = createContext<
  { state: SessionState; dispatch: Dispatch } | undefined
>(undefined)

export const SessionContextProvider = (props: {
  children: React.ReactNode
}) => {
  const [state, dispatch] = useReducer(sessionReducer, initialState)

  useEffect(() => {
    const storageSession = localStorage.getItem('qadamSession')
    if (storageSession) {
      dispatch({ type: 'LOGIN', payload: JSON.parse(storageSession) })
    }
  }, [])

  return (
    <SessionContext.Provider value={{ state, dispatch }}>
      {props.children}
    </SessionContext.Provider>
  )
}
