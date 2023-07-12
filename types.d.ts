declare module 'react-spotify-auth';

// type Playlist = {
//     name: string
// }

// type SpotifyPlaylist = {
//     collaborative: boolean,
//     description: string,
//     external_urls: {
//         spotify: string
//     },
//     href: string,
//     id: string,
//     images: [{
//         url: string,
//         height: number,
//         width: number
//     }],
//     name: string,
//     owner: {
//         external_urls: {
//             spotify: string
//         },
//         followers: {
//             href: string,
//             total: number
//         },
//         href: string,
//         id: string,
//         type: user,
//         uri: string,
//         display_name: string
//     },
//     public: false,
//     snapshot_id: string,
//     tracks: {
//         href: string,
//         total: number
//     },
//     type: string,
//     uri: string
// }

type Playlist = {
    // youtube
    kind: "youtube#playlist",
    etag: string,
    id: string,
    snippet: {
        publishedAt: string,
        channelId: string,
        title: string, // <- name of playlist
        description: string,
        thumbnails: {
            (key): {
                url: string,
                width: number,
                height: number
            }
        },
        channelTitle: string,
        defaultLanguage: string,
        localized: {
            title: string,
            description: string
        }
    },
    status: {
        privacyStatus: string
    },
    contentDetails: {
        itemCount: number
    },
    player: {
        embedHtml: string
    },
    localizations: {
        (key): {
            title: string,
            description: string
        }
    }

    // spotify
    collaborative: boolean,
    description: string,
    external_urls: {
        spotify: string
    },
    href: string,
    id: string,
    images: [{
        url: string,
        height: number,
        width: number
    }],
    name: string, // <- name of playlist
    owner: {
        external_urls: {
            spotify: string
        },
        followers: {
            href: string,
            total: number
        },
        href: string,
        id: string,
        type: user,
        uri: string,
        display_name: string
    },
    public: false,
    snapshot_id: string,
    tracks: {
        href: string,
        total: number
    },
    type: string,
    uri: string
}

type PlatformState = {
    playlists: Array<Playlist>
    platform: spotify | youtube
    inputPlaylist: Playlist | null
}

// type UserProfile = {
//     country: string
//     display_name: string
//     email: string
//     explicit_content: {
//         filter_enabled: boolean
//         filter_locked: boolean
//     }
//     external_urls: {
//         spotify: string
//     }
//     followers: {
//         href: string
//         total: number
//     }
//     href: string
//     id: string
//     images: [
//         {
//             url: string
//             height: number
//             width: number
//         }
//     ]
//     product: string
//     type: string
//     uri: string
// }

// type PlaylistsJSON = {
//     href: string,
//     limit: number,
//     next: string,
//     offset: number,
//     previous: string,
//     total: number,
//     items: [
//         {
//             collaborative: boolean,
//             description: string,
//             external_urls: {
//                 spotify: string
//             },
//             href: string,
//             id: string,
//             images: [{
//                 url: string,
//                 height: number,
//                 width: number
//             }],
//             name: string,
//             owner: {
//                 external_urls: {
//                     spotify: string
//                 },
//                 followers: {
//                     href: string,
//                     total: number
//                 },
//                 href: string,
//                 id: string,
//                 type: user,
//                 uri: string,
//                 display_name: string
//             },
//             public: false,
//             snapshot_id: string,
//             tracks: {
//                 href: string,
//                 total: number
//             },
//             type: string,
//             uri: string
//         }
//     ]
// }