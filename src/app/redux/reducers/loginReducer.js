import { 
  LOGIN_FULFILLED, 
  LOGIN_REJECTED, 
  LOGIN_PENDING, 
  STORE_EMAIL, 
  STORE_PASSWORD, 
  LOGIN_ERROR_ALERT,
  LOGIN_CONFIRMED
} from "../types";

const defaultState = {
  email: null,
  password: null,
  info: null,
  messageId: null,
  loggedIn: false,
  fetching: false,
  fetched: false,
  error: false
}
  const loginReducer = (state = defaultState, action)=>{
      switch(action.type){
          case LOGIN_PENDING:{
            return {...state,
              fetched: false,
              error: null,
              fetching: true
            }
          }
          case LOGIN_REJECTED:{
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
          case LOGIN_ERROR_ALERT:{
            return {...state,
              error: true,
              loggedIn: false,
              fetching: false,
              fetched: true,
              messageId: action.payload
            }
          }
          case LOGIN_CONFIRMED:{
            return {
              ...state,
              loggedIn: true
            }
          }
          case LOGIN_FULFILLED:{
            return {...state,
              fetched: true,
              fetching: false,
              error: false,
              loggedIn: true,
              info: action.payload
            }
          }
          default:
            return state;
      }  
  }
  
  export default loginReducer;