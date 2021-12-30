const resource_id = (resource_name) => {
    switch(resource_name){
        case "google": return 35;
        break;
        case "codechef": return 2;
        break;
        case "codeforces": return 1;
        break;
        case "leetcode": return 102;
        break
        case "atcoder": return 93;
        break;
        case "hackerrank": return 63;
        break;
        case "codeforcesgym": return 64;
        default: " "
    }
}
module.exports = resource_id