'use client';

import Image from 'next/image'
import Platform from './components/platform'
import { useState } from 'react';

var yt_playlists = [
	{ "name": "*w*" }, 
	{ "name": "da moosik" }, 
];

var spotify_playlists = [
	{ "name": "close ur eyes" }, 
	{ "name": "in a dream" }
];

export default function Home() {
	const clickBounce = (button: HTMLButtonElement) => {
		button.classList.remove('clickBounce')
		void button.offsetWidth;
		button.classList.add('clickBounce')
	}

	const [direction, setDirection] = useState('s2y')
	const [youtubeInputValue, setYoutubeInputValue] = useState('')
	const [spotifyInputValue, setSpotifyInputValue] = useState('')

	const switchDirection = (button: HTMLButtonElement) => {
		// if (direction == 's2y') {
		// 	let temp = spotifyInputValue
		// 	console.log("temp: ", temp)
		// 	setSpotifyInputValue(youtubeInputValue)
		// 	setYoutubeInputValue(temp)
		// 	setDirection('y2s')
		// } else {
		// 	let temp = youtubeInputValue
		// 	setYoutubeInputValue(spotifyInputValue)
		// 	setSpotifyInputValue(temp)
		// 	setDirection('s2y')
		// }
		direction == 's2y' ? setDirection('y2s') : setDirection('s2y')
		clickBounce(button)
	}

	return (
		<>
			<main className='h-screen justify-center items-center grid grid-rows-6'>
				{/* title */}
				<div className="row-start-2 text-center">
					<h1 className='text-7xl font-extralight'>From <span className='font-extrabold text-gradient'>Playlist</span> To <span className='font-extrabold text-gradient'>Playlist</span></h1>
					<p className='text-gray-600 mt-3 text-sm'>Developed by MyCo Le.</p>
				</div>

				{/* transfer playlists */}
				<div className="grid gap-4 grid-cols-5 grid-rows-1 row-start-3">
					{/* from playlist */}
					<div className="col-start-2" id='spotify'>
						{direction == 's2y' ? (
							<Platform playlists={spotify_playlists} platform='spotify' inputValue={spotifyInputValue} />
						) : (
							<Platform playlists={yt_playlists} platform='youtube' inputValue={youtubeInputValue} />
						)}
					</div>

					{/* switch button */}
					<div className="col-start-3 flex justify-center items-center">
						<div className="grid grid-rows-5 h-full justify-center items-center text-center">
							<button className='bg-gradient rounded-full p-6 h-0 w-1/12 pb-1/12 flex justify-center items-center row-start-3 mx-auto' title='Switch the direction of the transfer' onClick={(e) => {switchDirection(e.currentTarget)}}>
								<i className="fa-solid fa-repeat text-xl"></i>
							</button>
							
							<p className='row-start-5'><i className="fa-solid fa-arrow-right text-2xl text-gray-600"></i></p>
						</div>
					</div>
					
					{/* to playlist */}
					<div className="col-start-4" id='youtube'>
						{direction == 's2y' ? (
							<Platform playlists={yt_playlists} platform='youtube' inputValue={youtubeInputValue} />
						) : (
							<Platform playlists={spotify_playlists} platform='spotify' inputValue={spotifyInputValue} />
						)}
					</div>
				</div>
				
				{/* transfer button */}
				<div className="row-start-5 flex justify-center items-center">
					<button className='bg-gradient rounded-full px-8 py-4 font-bold text-xl text-center' onClick={(e) => {clickBounce(e.currentTarget)}}>Transfer!</button>
				</div>
			</main>
		</>
	)
}
