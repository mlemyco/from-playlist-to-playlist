import { useGoogleLogin } from '@react-oauth/google';
import React from 'react'

type Props = {
    setYoutubeUser: any
    setYoutubeLoggedIn: any
}

export default function GoogleLogin({ setYoutubeUser, setYoutubeLoggedIn }: Props) {
	const googleLogin = useGoogleLogin({
        onSuccess: (codeResponse) => {
            console.log(codeResponse);
            setYoutubeUser(codeResponse);
            setYoutubeLoggedIn(true);
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    return (
        <button onClick={() => googleLogin()}>Login to Google</button>
    )
}
