import { FETCH_GEN_FULFILLED, FETCH_GEN_REJECTED, FETCH_ID_TOKEN } from '../types';

export const dispatchedGenInfo = info => {
    if(info !== undefined && info !== null){   
      return {
            type: FETCH_GEN_FULFILLED,
            payload: { info }
        }
    }else{
        return {
            type: FETCH_GEN_REJECTED,
            payload: {
                error: "could not fetch user details"
            }
        } 
    }
}

export const dispatchChatkitTokenId = token => {
    return {
        type: FETCH_ID_TOKEN,
        payload: token
    }
}