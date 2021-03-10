import axios from "axios";

export default async function loginRequest  (
	Username, Password, Usertype
){
    var params = new URLSearchParams();
    params.append('username', Username);
    params.append('password', Password);
    params.append('usertype', Usertype);
    return axios.post("http://20.46.117.148:8001/person/login/", params
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