import axios from "axios";

export default async function stafflizhiApply  (u_id,description){
    var params = new URLSearchParams();
    params.append('u_id',u_id);
    params.append('description',description);
    
    return axios.post("http://45.76.99.155/dangan/stflizhiadd", params
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