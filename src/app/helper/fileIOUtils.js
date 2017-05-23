const fs = require('fs')

module.exports={

    writeMDToFile: function(folderPath, title, markdown){
        try{
            const filePath = `${folderPath}/${title}.md`
            fs.writeFileSync(filePath, markdown);
            return true;
        }catch(err){
            return false;
        }
    },
    readMarkdownFile: function(filePath){
        try{
            let str=fs.readFileSync(filePath, 'utf8');
            let lines = str.split('\n');
            if(lines.length>1){
                lines = lines.filter(function(val, index, arr){
                    if(val==="" && arr[index+1]===""){
                        return true;
                    }else{
                        return val!==""
                    }

                });
                str= lines.join('\n');
            }
            return str
        }catch(err){
            return null;
        }
    }

}


