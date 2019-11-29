import { 
    RESET_PENDING,
    RESET_FULLFILLED,
    RESET_REJECTED,
    STORE_EMAIL,
    RESET_MESSAGE_ALERT,
    CLEAR_ERRORS
  } from "../types";
  
  const defaultState = {
    email: null,
    messageId: null,
    reset: false,
    fetching: false,
    fetched: false,
    feedback: false
  }
    const resetReducer = (state = defaultState, action)=>{
        switch(action.type){

            case RESET_PENDING:{
              return {...state,
                fetched: false,
                feedback: false,
                fetching: true
              }
            }

            case STORE_EMAIL:{
                return{
                    ...state,
                    feedback: false,
                    messageId: null,
                    email: action.payload
                }
            }

            case RESET_MESSAGE_ALERT: {
                return {
                    ...state,
                    feedback: true,
                    messageId: action.payload
                }
            }

            case CLEAR_ERRORS:{
              return {
                ...state,
                error: false,
                messageId: null,
                feedback: false
              }
            }

            case RESET_REJECTED:{
                return {...state,
                  fetched: false,
                  feedback: true,
                  messageId: action.payload,
                  fetching: false
                }
            }

            case RESET_FULLFILLED:{
                return {...state,
                  fetched: true,
                  feedback: true,
                  messageId: action.payload,
                  fetching: false
                }
            }
            default:
              return state;
        }  
    }
    
    export default resetReducer;