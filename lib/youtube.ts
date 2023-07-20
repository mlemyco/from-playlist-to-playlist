import axios from "axios"

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

export default class YoutubeAPI {
    accessToken: string;

    constructor() {
        this.accessToken = ""
    }

    setAccessToken(access_token: string) {
        this.accessToken = access_token
    }

    async getCurrentChannel() {
        return axios.get(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&mine=true&key=${YOUTUBE_API_KEY}`, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                Accept: 'application/json'
            }
        })
    }
    
    async getPlaylists() {
        return axios.get(`https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&maxResults=25&mine=true&key=${YOUTUBE_API_KEY}`, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                Accept: 'application/json'
            }
        })
    }
    
    
    async getYoutubeSongs(playlistId: string) {
        return axios.get(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=id%2Csnippet&playlistId=${playlistId}&maxResults=50&key=${YOUTUBE_API_KEY}`, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                Accept: 'application/json'
            }
        }).then((response) => {
            const videos = response.data.items
    
            console.log("youtube videos:", videos)
    
            return videos
        }).catch((err) => console.log(err))
    }
    
    async addToYoutube(playlistId: string, videoId: string) {
        this.getYoutubeSongs(playlistId).then((videos) => {
            console.log("checking against", videoId)
    
            if (!videos) {
                console.log("Playlist is empty.")
                return
            }
    
            console.log("videos:", videos)
    
            for (const video of videos) {
                const otherVideoId = video.snippet.resourceId.videoId
                console.log("checking track:", otherVideoId)
    
                // if the video is already in the playlist, don't add
                if (videoId == otherVideoId) {
                    console.log("video exists, don't add")
                    return
                }
            }
    
            // If the youtube id is already in the youtube playlist, dont add
            axios.post(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&key=${YOUTUBE_API_KEY}`, {
                "snippet": {
                    "playlistId": playlistId,
                    "resourceId": {
                        "kind": "youtube#video",
                        "videoId": videoId
                    }
                }
            }, {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                console.log("added song:", response)
            })
        })
    }
    
    async searchYoutube(songQuery: string) {    
        return axios.get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${songQuery}&type=video&key=${YOUTUBE_API_KEY}`, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                Accept: 'application/json'
            }
        }).then((response) => {
            const searchResult = response.data.items[0]
    
            console.log("youtube search result:", searchResult)
    
            return searchResult
        }).catch((err) => console.log(err))
    }
}