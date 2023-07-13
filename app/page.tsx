'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAnimate } from 'framer-motion';
import Platform from './components/platform'
import SpotifyWebApi from 'spotify-web-api-js';
import SpotifyLogin from './components/spotifyLogin';
// import YoutubeLogin from './components/youtubeLogin'
import { CredentialResponse, GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import GoogleLogin from './components/googleLogin';
import axios from 'axios';

const SPOTIFY_CLIENT_ID = ""
const YOUTUBE_CLIENT_ID = ""
const YOUTUBE_API_KEY = ""

const spotify = new SpotifyWebApi();


// var spotifyPlaylists = [
// 	{ name: "*w*" }, 
// 	{ name: "da moosik" }, 
// ];

// var youtubePlaylists = [
// 	{ name: "close ur eyes" }, 
// 	{ name: "in a dream" }
// ];

const getParamsFromUrl = () => {
	// const router = useRouter()
	// const accessToken = router.query.accessToken
	// console.log(accessToken)
	// return accessToken
	return window.location.hash
		.substring(1)
		.split('&')
		.reduce((initial: any, item) => {
			let parts = item.split("=")
			initial[parts[0]] = decodeURIComponent(parts[1])

			console.log(initial)
			return initial
		}, {})
}

export default function Home() {
	const [spotifyAccessToken, setSpotifyAccessToken] = useState('')
	const [spotifyRefreshToken, setSpotifyRefreshToken] = useState('')
	const [spotifyLoggedIn, setSpotifyLoggedIn] = useState(false)
	const [spotifyUser, setSpotifyUser] = useState<any>()

	const [youtubeAccessToken, setYoutubeAccessToken] = useState('')
	const [youtubeLoggedIn, setYoutubeLoggedIn] = useState(false)
	const [youtubeUser, setYoutubeUser] = useState<any>()
	const [youtubeProfile, setYoutubeProfile] = useState<any>()

	// const [spotifyPlaylists, setSpotifyPlaylists] = useState<any>()
	// const [youtubePlaylists, setYoutubePlaylists] = useState<any>()

	const [leftState, setLeftState] = useState<any>({
		playlists: [],
		platform: "spotify",
		inputPlaylist: null,
	})
	const [rightState, setRightState] = useState<any>({
		playlists: [],
		platform: "youtube",
		inputPlaylist: null,
	})

	// YOUTUBE ---------------------------------------------------------

	useEffect(() => {
		if (youtubeUser) {
			// Get current user's youtube channel
			axios.get(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&mine=true&key=${YOUTUBE_API_KEY}`, {
				headers: {
					Authorization: `Bearer ${youtubeUser.access_token}`,
					Accept: 'application/json'
				}
			}).then((response) => {
				const actualUserChannel = response.data.items[0].snippet
				console.log("current user's channel:", actualUserChannel.title)

				setYoutubeProfile(actualUserChannel)
				console.log("youtube profile:", youtubeProfile)
			})

			// Get current user's playlists
			axios.get(`https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&maxResults=25&mine=true&key=${YOUTUBE_API_KEY}`, {
				headers: {
					Authorization: `Bearer ${youtubeUser.access_token}`,
					Accept: 'application/json'
				}
			}).then((response) => {
				const playlists = response.data.items

				const newState = {
					...rightState,
					playlists: playlists,
				}
				setRightState(newState)
			}).catch((err) => console.log(err))
		}
	}, [youtubeUser])


	// SPOTIFY ---------------------------------------------------------
	// Set accessToken and refreshToken from URL returned from Server Auth
	useEffect(() => {
		const params: any = getParamsFromUrl()
		console.log("params:", params)

		if (params) {
			const accessToken = params.access_token
			const refreshToken = params.refresh_token
			console.log("accesstoken:", accessToken)
			setSpotifyAccessToken(accessToken)
			setSpotifyRefreshToken(refreshToken)
		}
	}, [spotifyLoggedIn])

	// Get playlist data from Spotify endpoint once accessToken is set
	useEffect(() => {
		if (spotifyAccessToken) {
			spotify.setAccessToken(spotifyAccessToken)
			setSpotifyLoggedIn(true)

			spotify.getMe().then((user) => {
				console.log("user:", user)
				setSpotifyUser(user)
			})
			spotify.getUserPlaylists().then((actualPlaylists) => {
				console.log("actual playlists:", actualPlaylists.items)

				const newState = {
					...leftState,
					playlists: actualPlaylists.items,
				}
				setLeftState(newState)
			})
		} else {
			setSpotifyLoggedIn(false)
			setSpotifyUser(null)
		}
	}, [spotifyAccessToken]);



	const getYoutubeSongs = (playlistId: string) => {
		return axios.get(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=id%2Csnippet&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}`, {
			headers: {
				Authorization: `Bearer ${youtubeUser.access_token}`,
				Accept: 'application/json'
			}
		}).then((response) => {
			const tracks = response.data.items

			console.log("youtube tracks:", tracks)

			return tracks
		}).catch((err) => console.log(err))
	}

	const checkYoutubeIfVidExists = async (playlistId: string, videoId: string) => {
		return getYoutubeSongs(playlistId).then((tracks) => {
			tracks.forEach((track: YoutubeTrack) => {
				const otherVideoId = track.snippet.resourceId.videoId
				console.log("checking track:", otherVideoId)

				// if the video is already in the playlist, don't add
				if (videoId == otherVideoId) {
					console.log("video exists!")
					return true
				}
			})
			return false
		})
	}

	const addToYoutube = async (playlistId: string, videoId: string) => {
		console.log("checking against", videoId)

		// TODO: exists does not equal false even if console.logged(video exists) (line 174)
		const exists = await checkYoutubeIfVidExists(playlistId, videoId)
		console.log("exists:", exists)
		if (exists) return

		// TODO: if the youtube id is already in the youtube playlist, dont add
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
				Authorization: `Bearer ${youtubeUser.access_token}`,
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		}).then((response) => {
			console.log("added song:", response)
		})
	}

	const searchYoutube = async (songInfo: string) => {
		const songQuery = songInfo.replaceAll(" ", "%20")

		return axios.get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${songQuery}&type=video&key=${YOUTUBE_API_KEY}`, {
			headers: {
				Authorization: `Bearer ${youtubeUser.access_token}`,
				Accept: 'application/json'
			}
		}).then((response) => {
			const searchResult = response.data.items[0]

			console.log("youtube search result:", searchResult)

			return searchResult
		}).catch((err) => console.log(err))
	}

	const transferSpotifySongs = () => {
		const spotifyPlaylistId = leftState.inputPlaylist.id
		
		spotify.getPlaylistTracks(spotifyPlaylistId).then((response) => {
			const tracks = response.items
			console.log("spotify tracks:", tracks)

			tracks.forEach((track: any) => {
				const artist: string = track.track.artists[0].name
				const songName: string = track.track.name
				const songInfo: string = artist.concat(" ", songName)

				searchYoutube(songInfo).then((searchResult) => {
					addToYoutube(rightState.inputPlaylist.id, searchResult.id.videoId)
				})
			})
		})
	}

	const handleTransfer = (button: HTMLButtonElement) => {
		clickBounce(button)

		if (leftState.platform == "spotify") { // direction = 's2y'
			// from spotify
			transferSpotifySongs()

			// to youtube
			const youtubePlaylistId = rightState.inputPlaylist.id
			// getYoutubeSongs(youtubePlaylistId)

		} else { // direction = 'y2s'
			// from youtube
			const youtubePlaylistId = leftState.inputPlaylist.id
			getYoutubeSongs(youtubePlaylistId)

			// to spotify
			// const spotifyPlaylistId = rightState.inputPlaylist.id
			// transferSpotifySongs(spotifyPlaylistId)
		}
	}


	const clickBounce = (button: HTMLButtonElement) => {
		button.classList.remove('clickBounce')
		void button.offsetWidth;
		button.classList.add('clickBounce')
	}

	const handleSwitch = (button: HTMLButtonElement) => {
		const tempLeftState = leftState
		setLeftState(rightState)
		setRightState(tempLeftState)

		clickBounce(button)
	}

	return (
		<GoogleOAuthProvider clientId={YOUTUBE_CLIENT_ID}>
			<main className='min-h-screen flex flex-col justify-center items-center p-5'>
				{/* title */}
				<div className="text-center">
					<h1 className='text-7xl font-extralight'>From <span className='font-extrabold text-gradient'>Playlist</span> To <span className='font-extrabold text-gradient'>Playlist</span></h1>
					<p className='text-gray-600 mt-3 text-sm'>Developed by MyCo Le</p>
				</div>

				{/* transfer playlists */}
				<div className="grid grid-cols-1 lg:grid-cols-3 justify-center items-center pt-3 lg:py-5">
					{/* from playlist */}
					<Platform currentState={leftState} setState={setLeftState}>
					</Platform>

					{/* switch button */}
					<div className="">
						<button className='bg-gradient rounded-full p-6 h-0 w-1/12 pb-1/12 flex justify-center items-center mx-auto' title='Switch the direction of the transfer' onClick={(e) => { handleSwitch(e.currentTarget) }}>
							<i className="fa-solid fa-repeat text-xl"></i>
						</button>

						{/* <i className="fa-solid fa-arrow-right text-2xl text-gray-600"></i> */}
					</div>

					{/* to playlist */}
					<Platform currentState={rightState} setState={setRightState}>
					</Platform>
				</div>

				{/* transfer button */}
				<div className="row-start-5 flex flex-col justify-center items-center">
					<button className='bg-gradient rounded-full px-8 py-4 font-bold text-xl text-center mb-3' onClick={(e) => { handleTransfer(e.currentTarget) }}>Transfer!</button>

					<div className="text-gray-600 text-center flex flex-col">
						{spotifyLoggedIn && spotifyUser ? (
							<div>Logged in as {spotifyUser.display_name}</div>
						) : (
							<SpotifyLogin />
						)}

						{youtubeLoggedIn && youtubeProfile ? (
							<div>Logged in as {youtubeProfile.title}</div>
						) : (
							<GoogleLogin setYoutubeUser={setYoutubeUser} setYoutubeLoggedIn={setYoutubeLoggedIn} />
						)}
					</div>
				</div>
			</main>
		</GoogleOAuthProvider>
	)
}
