var TopColors = function() {
    var colors = ["#e8554e","#f19c65","#50b7ad","#5399cd","#34bfa3","#0a7b83", "#ffb822", "#ff6348", "#00c5dc", "#e84393", "#d81b60", "#f44336","#e91e63","#9c27b0","#673ab7","#3f51b5","#2196f3", "#716aca", "#03a9f4","#00bcd4","#009688","#4caf50","#8bc34a","#cddc39","#ffc107","#ff5722","#ff5722","#795548","#9e9e9e","#607d8b"];
    var leaveColors = ["#66bb6a","#5c6bc0","#ff9800","#ec407a","#ef5350","#f19c65","#50b7ad","#5399cd","#34bfa3","#0a7b83", "#ffb822", "#ff6348", "#00c5dc", "#e84393", "#d81b60"];
    var calendarColors = ["#2196F3", "#fd8d3c", "#f06292", "#31608e", "#666666", "#b97bc3", "#ffc107","#ff5722","#ff5722","#795548","#9e9e9e","#607d8b"];
    // var extraColors = ["#3d7c8b","#39a0b7","#35c4e4","#73d1e9","#99dcef","#bce8f4"];

    var stringHash = function(name) {
        var hash = 0,
            i, chr;
        if (name.length === 0) return hash;
        for (i = 0; i < name.length; i++) {
            chr = name.charCodeAt(i);
            hash = ((hash << 5) + hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };

    var getColorWithIndex = function(index){
        const colorsSize = colors.length;
        if (index >= colorsSize) {
            index = colorsSize -1;
        } else if (index < 0) {
            index = 0;
        }
        return colors[index];
    };

    var getNumericColor = function(number) {
        var hash = Math.abs(number);
        var total = colors.length;
        var index = hash % total;
        return colors[index];
    };

    var getLeaveColor = function(index) {
        const colorsSize = leaveColors.length;
        if (index >= colorsSize) {
            index = colorsSize -1;
        } else if (index < 0) {
            index = 0;
        }
        return leaveColors[index];
    };

    var getCalendarColor = function(index) {
        const colorsSize = calendarColors.length;
        if (index >= colorsSize) {
            index = colorsSize -1;
        } else if (index < 0) {
            index = 0;
        }
        return calendarColors[index];
    };

    return {
        getColor: function(i) {
            return getColorWithIndex(i);
        },
        getLeaveColor: function(i) {
            return getLeaveColor(i);
        },
        getCalendarColor: function(i) {
            return getCalendarColor(i);
        },
        getColorFromString: function(name) {
            return getNumericColor(stringHash(name));
        },
    }
}();


var FlatColors = function() {
    var colors = [{ name: "TURQUOISE", hex: "#1abc9c", rgb: "rgb(26, 188, 156)" }, { name: "EMERALD", hex: "#2ecc71", rgb: "rgb(46, 204, 113)" }, { name: "PETER RIVER", hex: "#3498db", rgb: "rgb(52, 152, 219)" }, { name: "AMETHYST", hex: "#9b59b6", rgb: "rgb(155, 89, 182)" }, { name: "WET ASPHALT", hex: "#34495e", rgb: "rgb(52, 73, 94)" }, { name: "GREEN SEA", hex: "#16a085", rgb: "rgb(22, 160, 133)" }, { name: "NEPHRITIS", hex: "#27ae60", rgb: "rgb(39, 174, 96)" }, { name: "BELIZE HOLE", hex: "#2980b9", rgb: "rgb(41, 128, 185)" }, { name: "WISTERIA", hex: "#8e44ad", rgb: "rgb(142, 68, 173)" }, { name: "MIDNIGHT BLUE", hex: "#2c3e50", rgb: "rgb(44, 62, 80)" }, { name: "SUN FLOWER", hex: "#f1c40f", rgb: "rgb(241, 196, 15)" }, { name: "CARROT", hex: "#e67e22", rgb: "rgb(230, 126, 34)" }, { name: "ALIZARIN", hex: "#e74c3c", rgb: "rgb(231, 76, 60)" }, { name: "CONCRETE", hex: "#95a5a6", rgb: "rgb(149, 165, 166)" }, { name: "ORANGE", hex: "#f39c12", rgb: "rgb(243, 156, 18)" }, { name: "PUMPKIN", hex: "#d35400", rgb: "rgb(211, 84, 0)" }, { name: "POMEGRANATE", hex: "#c0392b", rgb: "rgb(192, 57, 43)" }, { name: "ASBESTOS", hex: "#7f8c8d", rgb: "rgb(127, 140, 141)" }];
    var stringHash = function(name) {
        var hash = 0,
            i, chr;
        if (name.length === 0) return hash;
        for (i = 0; i < name.length; i++) {
            chr = name.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    var getNumericColor = function(number) {
        var hash = Math.abs(number);
        var total = colors.length;
        var color = colors[hash % total].hex;
        return color;
    }

    var getRandomColor = function (){
        return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
    }

    var stringToColour = function(name) {
        var hash = 0;
        if(name.length !== 0 || name != "undefined")
        {
            for (var i = 0; i < name.length; i++) {
                hash = name.charCodeAt(i) + ((hash << 5) - hash);
            }
        }

        var colour = '#';
        for (var i = 0; i < 3; i++) {
            var value = (hash >> (i * 8)) & 0xFF;
            colour += ('00' + value.toString(16)).substr(-2);
        }
        return colour;
    }

    return {
        getColor: function(name) {
            return getNumericColor(stringHash(name));
        },

        getNumericColor: function(number) {
            return getNumericColor(number);
        },

        getRandomColor: function() {
            return getRandomColor();
        },
        getStringToColour: function (name) {
            return stringToColour(name);
        }
    }

}();
