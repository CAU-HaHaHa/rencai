import axios from "axios";

export async function getStructure(
    corporation_id
) {
    var params = new URLSearchParams();
    params.append('corporation_id', corporation_id);
 
    return axios.post("http://45.76.99.155/corporation/structure/retrieve", params);
}

export async function changeStructure(
    corporation_id, structure
) {
    var params = new URLSearchParams();
    params.append('corporation_id', corporation_id);
    params.append('structure', structure);
    //return axios.post("http://127.0.0.1:5000/fans", params);
    return axios.post("http://45.76.99.155/corporation/structure/update", params);
}

export async function changeCorInfo(
    corporation_id, name, email, tel, website, location, requirementinfo
) {
    var params = new URLSearchParams();
    params.append('corporation_id', corporation_id);
    params.append('name', name);
    params.append('email', email);
    params.append('tel', tel);
    params.append('website', website);
    params.append('location', location);
    params.append('requirementinfo', requirementinfo);
 
    return axios.post("http://45.76.99.155/corporation/update", params);
}

export async function getCorInfo(
    corporation_id
) {
    var params = new URLSearchParams();
    params.append('corporation_id', corporation_id);
 
    return axios.post("http://45.76.99.155/corporation/retrieve", params);
}

export async function changeStaffInfo(
    userid, name, sex, identitycard, politicsstatus, edubackground, eduschool, tel, email, address, postcode, briefintro
) {
    var params = new URLSearchParams();
    params.append('userid', userid);
    params.append('name', name);
    params.append('sex', sex);
    params.append('identitycard', identitycard);
    params.append('politicsstatus', politicsstatus);
    params.append('edubackground', edubackground);
    params.append('eduschool', eduschool);
    params.append('tel', tel);
    params.append('email', email);
    params.append('address', address);
    params.append('postcode', postcode);
    params.append('briefintro', briefintro);
    return axios.post("http://45.76.99.155/person/update", params);
}

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
    return axios.post("http://45.76.99.155/person/login/", params);
}