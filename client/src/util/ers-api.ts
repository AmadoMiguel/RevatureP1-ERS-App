// HTTP client
import Axios from 'axios';

// 
export default Axios.create({
    baseURL : "http://localhost:3006",
    responseType:"json"
});