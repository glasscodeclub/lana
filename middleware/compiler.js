const fetch=require('node-fetch')
async function callApi(sourceCode,language){
    try{
        let data={
            "clientId":process.env.hacker_rank_client_id,
            "clientSecret":process.env.hacker_rank_clientSecret,
            "script":sourceCode,
            "language":language,
            "versionIndex":"0"
        };
        
        let url="https://api.jdoodle.com/v1/execute"
      let res= await fetch(url,{
            method:"post",
            body:JSON.stringify(data),
            headers:{
                'Content-Type':'application/json'
            }
        })
        let result=await res.json();
        console.log(result);
        let output="🤖 Output of the code:\n"+result.output
        return output;
    }catch(e){
        console.log(e);
        return "error in compliling";
    }

}
// let code=`print("hello")`
//     callApi(code,"python3")
     
module.exports=callApi;

