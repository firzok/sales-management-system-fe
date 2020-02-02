

/**
 * Ultity functions
 * -----------------------------------------------
 *      * get the base path of given url 
 * ! Important , get the base URL
 */ 
export function GetPath(path) {
    var len = path.split('/');

    if (len.length > 3)
        return '/'+ len[1] + '/' + len[2];

    return path;
};

export function getPascalCase(text){
    var result = text.replace( /([A-Z])/g, " $1" );
    var pascalText = result.charAt(0).toUpperCase() + result.slice(1);
    return pascalText;
}