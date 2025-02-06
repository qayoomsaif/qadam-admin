import { SessionState } from './sessionContext'

export type LoginAction = {
  type: 'LOGIN'
  payload: {
    access_token: string
    refreshToken: string
    userData: {
      phone: string
    }
  }
}

export type LogoutAction = {
  type: 'LOGOUT'
}

export type Action = LoginAction | LogoutAction

export const sessionReducer = (state: SessionState, action: Action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        session: action.payload,
      }
    case 'LOGOUT':
      return {
        session: undefined,
      }
    default:
      throw new Error('Unhandled action type')
  }
}
