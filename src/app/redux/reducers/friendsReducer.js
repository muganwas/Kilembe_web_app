import {
  FETCH_USERS_PENDING,
  FETCH_USERS_FULFILLED,
  FETCH_USERS_ERROR,
  FETCH_FRIENDS_PENDING,
  FETCH_FRIENDS_FULFILLED,
  FETCH_FRIENDS_ERROR,
  FETCH_IN_COMING_REQUEST_ERROR,
  FETCH_IN_COMING_REQUEST_FULFILLED,
  FETCH_IN_COMING_REQUEST_PENDING,
  FETCH_OUT_GOING_REQUEST_ERROR,
  FETCH_OUT_GOING_REQUEST_FULFILLED,
  FETCH_OUT_GOING_REQUEST_PENDING,
  SELECT_USER_ERROR,
  SELECT_USER_FULFILLED,
  RESPONSE_CLASS_CHANGED
} from "../types";

const defaultState = {
  users: {},
  defaultAvatar:
    "https://firebasestorage.googleapis.com/v0/b/kilembe-school.appspot.com/o/general%2Favatar.jpg?alt=media&token=82a7c51f-b798-4ad3-a3f6-1b84572173ca",
  peopleListStyle: "people",
  general: true,
  specific: false,
  responseRequired: "fas fa-bell alert-main",
  outGoingRequests: [],
  inComingRequests: [],
  selectedUser: {},
  fetching: false,
  fetched: false,
  error: null
};
const friendsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_USERS_PENDING: {
      return {
        ...state,
        fetched: false,
        error: null,
        fetching: true
      };
    }
    case FETCH_USERS_ERROR: {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload
      };
    }
    case FETCH_USERS_FULFILLED: {
      return {
        ...state,
        fetched: true,
        fetching: false,
        error: false,
        users: action.payload
      };
    }
    case FETCH_FRIENDS_PENDING: {
      return {
        ...state,
        fetched: false,
        error: null,
        fetching: true
      };
    }
    case FETCH_FRIENDS_ERROR: {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload
      };
    }
    case FETCH_FRIENDS_FULFILLED: {
      return {
        ...state,
        fetched: true,
        fetching: false,
        error: false,
        friends: action.payload
      };
    }
    case FETCH_IN_COMING_REQUEST_PENDING: {
      return {
        ...state,
        fetched: false,
        error: null,
        fetching: true
      };
    }
    case FETCH_IN_COMING_REQUEST_ERROR: {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload
      };
    }
    case FETCH_IN_COMING_REQUEST_FULFILLED: {
      return {
        ...state,
        fetched: true,
        fetching: false,
        error: false,
        inComingRequests: action.payload
      };
    }
    case FETCH_OUT_GOING_REQUEST_PENDING: {
      return {
        ...state,
        fetched: false,
        error: null,
        fetching: true
      };
    }
    case FETCH_OUT_GOING_REQUEST_ERROR: {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload
      };
    }
    case FETCH_OUT_GOING_REQUEST_FULFILLED: {
      return {
        ...state,
        fetched: true,
        fetching: false,
        error: false,
        outGoingRequests: action.payload
      };
    }
    case SELECT_USER_ERROR: {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload
      };
    }
    case SELECT_USER_FULFILLED: {
      return {
        ...state,
        fetched: true,
        fetching: false,
        error: false,
        selectedUser: action.payload
      };
    }
    case RESPONSE_CLASS_CHANGED: {
      return {
        ...state,
        fetched: true,
        fetching: false,
        error: false,
        responseRequired: action.payload
      };
    }
    default:
      return state;
  }
};

export default friendsReducer;
