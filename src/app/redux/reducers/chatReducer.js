import {
  FETCH_ONLINE_USERS_PENDING,
  FETCH_ONLINE_USERS_FULFILLED,
  FETCH_ONLINE_USERS_ERROR,
  FETCH_MESSAGES_PENDING,
  FETCH_MESSAGES_FULFILLED,
  FETCH_MESSAGES_ERROR,
  SET_USER_TO_CHAT,
  MESSAGE_RECIEVED_DISPATCHED,
  MESSAGE_SENT_DISPATCHED
} from "../types";

const defaultState = {
  onlineUsers: {},
  selectedUser: null,
  messages: {},
  fetchingOnlineUsers: false,
  fetchedOnlineUsers: false,
  fetchingChats: false,
  fetchedChats: false,
  error: null
};
const chatReducer = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_ONLINE_USERS_PENDING: {
      return {
        ...state,
        fetchedOnlineUsers: false,
        fetchingOnlineUsers: true,
        error: null
      };
    }
    case FETCH_ONLINE_USERS_ERROR: {
      return {
        ...state,
        fetchingOnlineUsers: false,
        fetchedOnlineUsers: false,
        error: action.payload
      };
    }
    case FETCH_ONLINE_USERS_FULFILLED: {
      return {
        ...state,
        fetchedOnlineUsers: true,
        fetchingOnlineUsers: false,
        onlineUsers: action.payload
      };
    }
    case MESSAGE_RECIEVED_DISPATCHED: {
      return {
        ...state,
        messages: action.payload 
      }
    }
    case MESSAGE_SENT_DISPATCHED: {
      return {
        ...state,
        messages: action.payload
      }
    }
    case FETCH_MESSAGES_PENDING: {
      return {
        ...state,
        fetchedChats: false,
        fetchingChats: true
      };
    }
    case FETCH_MESSAGES_ERROR: {
      return {
        ...state,
        fetchingChats: false,
        fetchedChats: false,
        error: action.payload
      };
    }
    case FETCH_MESSAGES_FULFILLED: {
      return {
        ...state,
        fetchedChats: true,
        fetchingChats: false,
        messages: action.payload
      };
    }
    case SET_USER_TO_CHAT: {
      return {
        ...state,
        selectedUser: action.payload
      }
    }
    default:
      return state;
  }
};

export default chatReducer;
