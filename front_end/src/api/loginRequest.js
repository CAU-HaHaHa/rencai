import axios from "axios";

export async function hrRegister(
    name, username, password, realName, sex, idCard
) {
    var params = new URLSearchParams();
    params.append('name', name);
    params.append('username', username);
    params.append('password', password);
    params.append('realName', realName);
    params.append('sex', sex);
    params.append('idCard', idCard);
    return axios.post("http://45.76.99.155/hr/create", params);
}

export async function corporationRegister(
    name, registeredCapital, legalRepresentative, telephone, email, webAddress, address
) {
    var params = new URLSearchParams();
    params.append('name', name);
    params.append('registeredCapital', registeredCapital);
    params.append('legalRepresentative', legalRepresentative);
    params.append('telephone', telephone);
    params.append('email', email);
    params.append('webAddress', webAddress);
    params.append('address', address);
    return axios.post("http://45.76.99.155/corporation/create", params);
}

export async function staffRegister(
    username, password, telephone, email
) {
    var params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    params.append('telephone', telephone);
    params.append('email', email);
    return axios.post("http://45.76.99.155/person/create", params);
}

export async function loginRequest  (
	Username, Password, Usertype
){
    var params = new URLSearchParams();
    params.append('username', Username);
    params.append('password', Password);
    params.append('usertype', Usertype);
    return axios.post("http://45.76.99.155/person/login/", params
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