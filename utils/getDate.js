const getDate = (keyWords) => {
  if(keyWords=="live") {
    var status = "Live"
var currentdate = new Date(); 
var start = currentdate.getFullYear() + "-" 
    + (currentdate.getMonth()+1) + "-" 
    + currentdate.getDate() + "T"
    + currentdate.getHours() + ":"  
    + currentdate.getMinutes() + ":" 
    + currentdate.getSeconds();
    
    var date= `start__lte=${start}%26end__gte=${start}`

}
if(keyWords=="future") {
    var status = "Future"
    var currentdate = new Date();
    var start = (currentdate.getFullYear()) + "-" 
        + (currentdate.getMonth()+1) + "-" 
        + currentdate.getDate() + "T"
        + currentdate.getHours() + ":"  
        + currentdate.getMinutes() + ":" 
        + currentdate.getSeconds();
        
        var date= `start__gte=${start}`
    
    }
    if(keyWords=="past") {
        var status = "Past"
        var currentdate = new Date();
        var year = currentdate.getFullYear()
        var month = currentdate.getMonth()
        if (month<=0) {
            year = currentdate.getFullYear() - 1
            month = 12;
        }

        var end = currentdate.getFullYear() + "-" 
            + (currentdate.getMonth()+1) + "-" 
            + currentdate.getDate() + "T"
            + currentdate.getHours() + ":"  
            + currentdate.getMinutes() + ":" 
            + currentdate.getSeconds();
       
        var start = year + "-" 
            + (month) + "-" 
            + currentdate.getDate() + "T"
            + currentdate.getHours() + ":"  
            + currentdate.getMinutes() + ":" 
            + currentdate.getSeconds();
        var date= `start__gte=${start}%26end__lte=${end}`
        }
        return { 
          date, 
          status
        }
}
module.exports = getDate