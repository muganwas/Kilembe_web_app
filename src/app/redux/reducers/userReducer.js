import { 
  FETCH_USER_DB_INFO_PENDING,
  FETCH_USER_DB_INFO_FULFILLED,
  FETCH_USER_DB_INFO_ERROR,
  LOGOUT_CONFIRMED
} from "../types";

const defaultState = {
  userInfo: null,
  fetching: false,
  fetched: false,
  error: null
}
  const userReducer = (state = defaultState, action) => {
    switch(action.type){
      case FETCH_USER_DB_INFO_PENDING: {
        return {
          ...state,
          fetched: false,
          fetching: true
        }
      }
      case FETCH_USER_DB_INFO_FULFILLED: {
        return {
          ...state,
          userInfo: action.payload,
          fetched: true,
          fetching: false
        }
      }
      case FETCH_USER_DB_INFO_ERROR: {
        return {
          ...state,
          error: action.payload,
          fetched: false,
          fetching: false
        }
      }
      case LOGOUT_CONFIRMED: {
        return {
          ...defaultState
        }
      }
      default:
        return state;
    }  
  }
  
  export default userReducer;