import axios from 'axios'
import { baseApiUrl, baseFootballApiUrl } from "@/global";
import unirest from "unirest";

const success = res => res
const error = err => {
    if (err.response && 401 === err.response.status) {
        window.location = '/'
    } else {
        return Promise.reject(err)
    }
}

axios.interceptors.request.use(
    async config => {
        const url = config.url.split('/')
        const MAX_REQUESTS_PER_DAY = 90

        //Here theres no how to use axios
        try {
            const requestsPerDay = await unirest
                .post(`${baseApiUrl}/getRequestsPerDay/${url[2]}`)
                .then((requestsPerDay => {
                    return requestsPerDay
                }))
                .catch(err => {
                    console.log(err)

                    return false
                })

            if (requestsPerDay.body && requestsPerDay.body.requests > MAX_REQUESTS_PER_DAY && baseFootballApiUrl.includes(url[2])) {
                console.error('Max requests reached')

                return false
            }

            await unirest
                .post(`${baseApiUrl}/requestsPerDay/${url[2]}`)
                .then(() => {
                    return true
                })
                .catch(err => {
                    console.log(err)
                })
        } catch (err) {
            console.error(err)
        }

        return config;
    },
    error => {
        // console.log
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(success, error)