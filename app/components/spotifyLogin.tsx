import React from 'react';

const authEndpoint = "https://accounts.spotify.com/authorize"
const redirectUri = "http://localhost:3000/"
const scopes =  [
    'user-read-private',
    'user-read-email',
    'user-library-read',
    'playlist-read-private',
    'playlist-modify-public',
    'playlist-modify-private',
]

const SpotifyLogin = ({ clientId }: { clientId: string | undefined }) => {
    const spotifyLoginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog-true`

    return (
        <>
            <a href={spotifyLoginUrl}>Login to Spotify</a>
        </>
    );
};

export default SpotifyLogin;
