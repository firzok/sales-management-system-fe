import {LEAVE_TYPES} from '../actions'

var TopColors = window.TopColors;
export default function (state=null, action) {
    switch(action.type) {
        case LEAVE_TYPES:
            var tempState = action.payload.data;
            var countTempState = Object.keys(tempState).length;
            var colorsLeaveTypes = countTempState ? {}:null; 
            var i=0;
            for(var key in tempState){
                var k = tempState[key].toLowerCase().replace(/\s+/g, '');
                colorsLeaveTypes[k] = TopColors.getCalendarColor(i++);
            }
            return colorsLeaveTypes;
        default:
            return state;
    }
}