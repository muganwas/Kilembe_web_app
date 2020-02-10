import {
  FETCH_ONLINE_USERS_PENDING,
  FETCH_ONLINE_USERS_FULFILLED,
  FETCH_ONLINE_USERS_ERROR,
  FETCH_MESSAGES_PENDING,
  FETCH_MESSAGES_FULFILLED,
  FETCH_MESSAGES_ERROR,
} from "../types";

const defaultState = {
  onlineUsers: null,
  messages: null,
  fetching: false,
  fetched: false,
  error: null
};
const chatReducer = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_ONLINE_USERS_PENDING: {
      return {
        ...state,
        fetched: false,
        error: null,
        fetching: true
      };
    }
    case FETCH_ONLINE_USERS_ERROR: {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload
      };
    }
    case FETCH_ONLINE_USERS_FULFILLED: {
      return {
        ...state,
        fetched: true,
        fetching: false,
        error: false,
        onlineUsers: action.payload
      };
    }
    case FETCH_MESSAGES_PENDING: {
      return {
        ...state,
        fetched: false,
        error: null,
        fetching: true
      };
    }
    case FETCH_MESSAGES_ERROR: {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload
      };
    }
    case FETCH_MESSAGES_FULFILLED: {
      return {
        ...state,
        fetched: true,
        fetching: false,
        error: false,
        messages: action.payload
      };
    }
    default:
      return state;
  }
};

export default chatReducer;
