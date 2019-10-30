import { FETCH_GEN_FULFILLED, FETCH_GEN_REJECTED } from '../actions';

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