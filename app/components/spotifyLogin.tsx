import React from 'react';

const authEndpoint = "https://accounts.spotify.com/authorize"
const redirectUri = "http://localhost:3000/"
const SPOTIFY_CLIENT_ID = "fe857598d4c34d3ca6482dcc931e6a4f"
const scopes =  [
    'user-read-private',
    'user-read-email',
    'user-library-read',
    'playlist-read-private',
    'playlist-modify-public',
    'playlist-modify-private',
]

const SpotifyLogin = ({ clientId }: { clientId: string }) => {
    const spotifyLoginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog-true`
    console.log(spotifyLoginUrl)

    return (
        <>
            {/* <SpotifyAuth
                redirectUri="http://localhost:3000/"
                clientID="fe857598d4c34d3ca6482dcc931e6a4f"
                scopes={[
                    'user-read-email',
                    'user-library-read',
                    'playlist-read-private',
                    'playlist-modify-public',
                    'playlist-modify-private',
                ]}
                onSuccess={onSuccess}
                onFailure={onFailure}
            /> */}
            <a href={spotifyLoginUrl}>Login to Spotify</a>
        </>
    );
};

// export { spotifyLoginUrl }
export default SpotifyLogin;
