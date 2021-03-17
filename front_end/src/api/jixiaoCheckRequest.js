import axios from "axios";

export default async function jixiaoCheckRequest  (uid){
    var params = new URLSearchParams();
    params.append('uid',uid);
    return axios.post("http://45.76.99.155/staff/jixiaoCheck", params
        
    );
}