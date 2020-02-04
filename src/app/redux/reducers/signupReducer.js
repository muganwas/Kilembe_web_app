import { 
    SIGNUP_FULFILLED, 
    SIGNUP_REJECTED, 
    SIGNUP_PENDING, 
    STORE_EMAIL, 
    STORE_PASSWORD, 
    SIGNUP_ERROR_ALERT,
    SIGNUP_CONFIRMED,
    PASSWORDS_MATCH,
    LOGOUT_CONFIRMED,
    PASSWORDS_MATCH_ERROR,
    CLEAR_ERRORS
  } from "../types";
  
  const defaultState = {
    email: null,
    password: null,
    passwordsMatch: null,
    info: null,
    messageId: null,
    signedUp: false,
    fetching: false,
    fetched: false,
    error: false
  }
    const signupReducer = (state = defaultState, action)=>{
        switch(action.type){
            case SIGNUP_PENDING:{
              return {...state,
                fetched: false,
                error: null,
                fetching: true
              }
            }
            case SIGNUP_REJECTED:{
              return {...state,
                fetching: false,
                fetched: false,
                info: null,
                messageId: action.payload,
                error: true
              }
            }

            case STORE_EMAIL:{
              return {...state,
                email: action.payload,
                error: false
              }
            }
  
            case STORE_PASSWORD:{
              return {...state,
                password: action.payload,
                error: false
              }
            }

            case PASSWORDS_MATCH:{
              return {...state,
                passwordsMatch: true,
                error: false
              }
            }

            case PASSWORDS_MATCH_ERROR:{
              return {...state,
                passwordsMatch: false,
                messageId: action.payload,
                error: true
              }
            }

            case SIGNUP_ERROR_ALERT:{
              return {...state,
                error: true,
                signedUp: false,
                fetching: false,
                fetched: true,
                messageId: action.payload
              }
            }
            
            case SIGNUP_CONFIRMED:{
              return {
                ...state,
                signedUp: true
              }
            }

            case CLEAR_ERRORS:{
              return {
                ...state,
                error: false,
                messageId: null
              }
            }

            case LOGOUT_CONFIRMED: {
              return {
                ...defaultState
              }
            }

            case SIGNUP_FULFILLED:{
              return {...state,
                fetched: true,
                fetching: false,
                error: false,
                signedUp: true,
                info: action.payload
              }
            }
            default:
              return state;
        }  
    }
    
    export default signupReducer;