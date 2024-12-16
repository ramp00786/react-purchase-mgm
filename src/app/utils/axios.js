import axios from 'axios';


// const API_URL = 'http://localhost/tulsiram_work/DWN/learn-react/Purchase-Management-System/core_php'; // Replace with your backend URL
const API_URL = 'http://react-purchase-manager.infy.uk';
const AUTH_TOKEN = 'cvfqxymXb7rZHOWXHhjsDXFI7vRUyfusKVqk9MmBpRqSxDRiL9JtYkgMmK1OLq9U';

// Create Axios instance
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Authorization': AUTH_TOKEN,
        'Content-Type': 'application/json',
    },
});


export default axiosInstance;
