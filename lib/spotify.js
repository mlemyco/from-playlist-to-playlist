import SpotifyWebApi from 'spotify-web-api-js';
import { useRouter } from 'next/router'

export const spotifyApi = new SpotifyWebApi();

export const getParamsFromUrl = () => {
    // const router = useRouter()
    // const accessToken = router.query.accessToken
    // console.log(accessToken)
    // return accessToken
    return window.location.hash
        .substring(1)
        .split('&')
        .reduce((initial, item) => {
            let parts = item.split("=")
            initial[parts[0]] = decodeURIComponent(parts[1])

            console.log(initial)
            return initial
        }, {})
}

export function setAccessToken(token) {
    spotifyApi.setAccessToken(token);
}