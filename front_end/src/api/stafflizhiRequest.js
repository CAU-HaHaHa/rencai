import axios from "axios";

export default async function stafflizhiRequest  (u_id){
    var params = new URLSearchParams();
    params.append('u_id',u_id);
    return axios.post("http://45.76.99.155/dangan/stflizhi", params
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