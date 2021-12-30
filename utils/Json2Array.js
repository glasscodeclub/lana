const Json2Array = (json) => {
    var ans = ""
    var result = [];
    for(var i in json)
    result.push([`${i} : ${json[i]}`]);
  
    for(i=0;i<result.length;i++){
        ans+= result[i] + `\n`
    }
    return ans
  }
  module.exports = Json2Array