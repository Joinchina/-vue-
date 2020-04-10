export default{
    client: {},
    aliyunUpload(aliyunInfo,files,progress,isAdmin){
        return new Promise((resolve,reject)=>{
            const client = new OSS.Wrapper({
                region : aliyunInfo.region,
                accessKeyId : aliyunInfo.accessKeyId,
                accessKeySecret : aliyunInfo.accessKeySecret,
                stsToken : aliyunInfo.securityToken,
                bucket : aliyunInfo.bucket
            });
            this.client = client;
            const dir = aliyunInfo.objectDir;  // 上传路径
            aliyunInfo.fileSize = aliyunInfo.fileSize == undefined ? 0 : aliyunInfo.fileSize;
            if(files[0].type.indexOf("image") == -1 && (files[0].size > aliyunInfo.fileSize) && isAdmin != 'admin'){
                reject({status: 423});
            }else{
                if(files) {
                    for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        const timestamp = new Date().getTime();
                        const suffix = file.name.split(".").pop();
                        let filename = timestamp + '.' + suffix;
                        // let filename = encodeURI(file.name)
                        let file_name = dir + filename;
                        client.multipartUpload(file_name, file, {
                            progress: function* (percentage, cpt) {
                                typeof progress == "function" ? progress(percentage, cpt) : "";
                            }
                        }).then((results) => {
                            // 上传完成
                            resolve(results);
                        }).catch((err) => {
                            reject(err);
                        })   
                    }
                    
                }
            }
            
        })
    }
}