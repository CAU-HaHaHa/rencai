import axios from "axios";

// 0 拒绝离职 只删除离职表中的信息 1 同意离职 删除离职表、职工表的信息，添加工作经历
export default async function lizhideleteRequest  (u_id,flag){
    var params = new URLSearchParams();
    params.append('u_id',u_id);
    params.append('flag',flag); 
    return axios.post("http://45.76.99.155/dangan/hrlizhi/delete", params
        // {
        //     headers:{
		// 		'Content-type': 'application/x-www-form-urlencoded'
		// 	},
        //     data: params
        //     // {
        //     //     username: Username,
        //     //     password: Password,
        //     //     usertype: Usertype,
        //     // },
        // }
        
    );
}