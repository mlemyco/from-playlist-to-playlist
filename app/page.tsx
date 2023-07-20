'use client';

require('dotenv').config()

import React, { useEffect, useState } from 'react';
import Platform from './components/platform'
import SpotifyWebApi from 'spotify-web-api-js';
import SpotifyLogin from './components/spotifyLogin';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleLogin from './components/googleLogin';
import YoutubeAPI from '@/lib/youtube';

const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
const YOUTUBE_CLIENT_ID = process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID

console.log(SPOTIFY_CLIENT_ID)
console.log(YOUTUBE_CLIENT_ID)

const spotify = new SpotifyWebApi();
const youtube = new YoutubeAPI();

const getParamsFromUrl = () => {
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
			youtube.setAccessToken(youtubeUser.access_token)

			// Get current user's youtube channel
			youtube.getCurrentChannel().then((response) => {
				const actualUserChannel = response.data.items[0].snippet
				console.log("current user's channel:", actualUserChannel.title)

				setYoutubeProfile(actualUserChannel)
				console.log("youtube profile:", youtubeProfile)
			})

			// Get current user's playlists
			youtube.getPlaylists().then((response) => {
				const playlists = response.data.items

				if (rightState.platform == "youtube") {
					const newState = {
						...rightState,
						playlists: playlists,
					}
					setRightState(newState)
				} else {
					const newState = {
						...leftState,
						playlists: playlists,
					}
					setLeftState(newState)
				}
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
			spotify.getUserPlaylists(undefined, { limit: 50 }).then((actualPlaylists) => {
				console.log("actual playlists:", actualPlaylists.items)

				if (leftState.platform == "spotify") {
					const newState = {
						...leftState,
						playlists: actualPlaylists.items,
					}
					setLeftState(newState)
				}
			})
		} else {
			setSpotifyLoggedIn(false)
			setSpotifyUser(null)
		}
	}, [spotifyAccessToken]);




	const transferSpotifySongs = () => {
		const spotifyPlaylistId = leftState.inputPlaylist.id
		
		// Get spotify songs
		spotify.getPlaylistTracks(spotifyPlaylistId).then((response) => {
			const tracks = response.items
			console.log("spotify tracks:", tracks)
	
			tracks.forEach((track: any) => {
				const artist: string = track.track.artists[0].name
				const songName: string = track.track.name
				const songQuery: string = artist.concat("%20", songName)
	
				// search youtube for first result
				youtube.searchYoutube(songQuery).then((searchResult) => {
					if (!searchResult) return
					
					// add to youtube playlist
					youtube.addToYoutube(rightState.inputPlaylist.id, searchResult.id.videoId)
				})
			})
		})
	}

	const addToSpotify = async (playlistId: string, trackUri: string) => {
		spotify.getPlaylistTracks(playlistId).then((response) => {
			const tracks = response.items

			// If song already exists in playlist, don't add
			for (const track of tracks) {
				if (track.track.uri == trackUri) {
					console.log("song already exists, don't add")
					return
				}
			}

			console.log("adding:", trackUri)
			spotify.addTracksToPlaylist(playlistId, [trackUri])
		})
	}

	const transferYoutubeSongs = () => {
		const youtubePlaylistId = leftState.inputPlaylist.id
		const spotifyPlaylistId = rightState.inputPlaylist.id

		// get youtube songs
		youtube.getYoutubeSongs(youtubePlaylistId).then((videos) => {
			console.log("youtube videos:", videos)

			for (const video of videos) {
				const videoTitle = video.snippet.title

				// search spotify for first result
				spotify.search(videoTitle, ["track"]).then((response) => {

					const searchResultUri = response.tracks!.items[0].uri

					// add to spotify playlist
					addToSpotify(spotifyPlaylistId, searchResultUri)
				})
			}
		})
	}

	const handleTransfer = (button: HTMLButtonElement) => {
		clickBounce(button)

		if (leftState.inputPlaylist == null || leftState.inputPlaylist == null) {
			console.log("Please select a playlist.")
			return
		}

		if (leftState.platform == "spotify") {
			// from spotify to youtube
			transferSpotifySongs()
		} else {
			// from youtube to spotify
			transferYoutubeSongs()
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
		<GoogleOAuthProvider clientId={YOUTUBE_CLIENT_ID!}>
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
							<SpotifyLogin clientId={SPOTIFY_CLIENT_ID} />
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
