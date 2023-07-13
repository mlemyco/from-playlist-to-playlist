declare module 'react-spotify-auth';

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


type SpotifyTrack = {
    added_at: string,
    added_by: {
        external_urls: {
            spotify: string
        },
        followers: {
            href: string,
            total: number
        },
        href: string,
        id: string,
        type: string,
        uri: string
    },
    is_local: boolean,
    track: {
        album: {
            album_type: string,
            total_tracks: number,
            available_markets: [string],
            external_urls: {
                spotify: string
            },
            href: string,
            id: string,
            images: [
                {
                    url: string,
                    height: number,
                    width: number
                }
            ],
            name: string,
            release_date: string,
            release_date_precision: string,
            restrictions: {
                reason: string
            },
            type: string,
            uri: string
            copyrights: [
                {
                    text: string,
                    type: string
                }
            ],
            external_ids: {
                isrc: string,
                ean: string,
                upc: string
            },
            genres: [string],
            label: string,
            popularity: number,
            album_group: string,
            artists: [{
                external_urls: {
                    spotify: string
                },
                href: string,
                id: string,
                name: string,
                type: string,
                uri: string
            }]
        },
        artists: [
            {
                external_urls: {
                    spotify: string
                },
                followers: {
                    href: string,
                    total: number
                },
                genres: [string],
                href: string,
                id: string,
                images: [{
                    url: string,
                    height: number,
                    width: number
                }],
                name: string,
                popularity: number,
                type: string,
                uri: string
            }
        ],
        available_markets: [string],
        disc_number: number,
        duration_ms: number,
        explicit: boolean,
        external_ids: {
            isrc: string,
            ean: string,
            upc: string
        },
        external_urls: {
            spotify: string
        },
        href: string,
        id: string,
        is_playable: boolean,
        linked_from: {},
        restrictions: {
            reason: string
        },
        name: string,
        popularity: number,
        preview_url: string,
        track_number: number,
        type: string,
        uri: string,
        is_local: boolean
    }
}

type YoutubeTrack = {
    "kind": string,
    "etag": string,
    "id": string,
    "snippet": {
        "publishedAt": string,
        "channelId": string,
        "title": string,
        "description": string,
        "thumbnails": {
            (key): {
                "url": string,
                "width": number,
                "height": number
            }
        },
        "channelTitle": string,
        "videoOwnerChannelTitle": string,
        "videoOwnerChannelId": string,
        "playlistId": string,
        "position": number,
        "resourceId": {
            "kind": string,
            "videoId": string,
        }
    },
    "contentDetails": {
        "videoId": string,
        "startAt": string,
        "endAt": string,
        "note": string,
        "videoPublishedAt": string
    },
    "status": {
        "privacyStatus": string
    }
}