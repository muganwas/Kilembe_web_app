import { 
  FETCH_GEN_PENDING, 
  FETCH_GEN_REJECTED, 
  FETCH_GEN_FULFILLED, 
  FETCH_ID_TOKEN,
  LOGOUT_CONFIRMED,
  USER_SAVED_IN_DATABASE,
  UPDATE_ONLINE_STATUS
} from '../types';
const defaultState = {
    info: {
      chatkitUser: {}
    },
    online: window.navigator.onLine,
    userInDatabase: false,
    menu: "Main-Menu",
    fetching: false,
    fetched: false,
    error: null
  }
  const genInfoReducer = (state = defaultState, action)=>{
      switch(action.type){
          case FETCH_GEN_PENDING:{
            return {
              ...state,
              fetched: false,
              error: null,
              fetching: true
            }
          }
          case FETCH_GEN_REJECTED:{
            return {
              ...state,
              fetching: false,
              fetched: false,
              error: action.payload
            }
          }
          case USER_SAVED_IN_DATABASE:{
            return {
              ...state,
              userInDatabase: true
            }
          }
          case FETCH_ID_TOKEN:{
            return {
              ...state,
              info: { ...state.info, chatkitUser: { id: action.payload } } 
            }
          }
          case LOGOUT_CONFIRMED: {
            return {
              ...defaultState
            }
          }
          case FETCH_GEN_FULFILLED:{
            return {
              ...state,
              fetched: true,
              fetching: false,
              error: false,
              info: action.payload
            }
          }
          case UPDATE_ONLINE_STATUS:{
            return {
              ...state,
              online: action.payload
            }
          }
          default:
            return state;
      }  
  }
  
  export default genInfoReducer;