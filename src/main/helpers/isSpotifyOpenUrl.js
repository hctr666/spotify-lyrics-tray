const getIsSpotifyOpenUrl = url => /^https:\/\/open.spotify.com/i.test(url)

module.exports = { getIsSpotifyOpenUrl }
