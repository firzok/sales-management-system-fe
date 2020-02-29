import { ACTIVE_USER } from '../actions'

export default function (state = {}, action) {
    switch (action.type) {
        case ACTIVE_USER:
            console.log("HELLOO");
            debugger;
            var tempState = action.payload.data;
            if (Array.isArray(tempState)) {
                tempState = { "message": "Something Went Wrong" }
            }
            return tempState;
        default:
            return state;
    }
}