export function dispatchedGenInfo(info) {
    if(info !== undefined && info !== null){   
      return {
            type: "FETCH_GEN_FULFILLED",
            payload: { info }
        }
    }else{
        return {
            type: "FETCH_GEN_REJECTED",
            payload: {
                error: "could not fetch user details"
            }
        } 
    }
}