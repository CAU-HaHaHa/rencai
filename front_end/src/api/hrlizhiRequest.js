import axios from "axios";

export default async function hrlizhiRequest  (co_id){
    var params = new URLSearchParams();
    params.append('co_id',co_id);
    return axios.post("http://45.76.99.155/dangan/hrlizhi", params
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