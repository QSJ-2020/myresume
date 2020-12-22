var fs=require('fs');
fs.readdir('./img',function(error,fileAry){
    console.log(JSON.stringify(fileAry));
});