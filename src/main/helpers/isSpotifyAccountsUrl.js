const getIsSpotifyAccountsUrl = url =>
  url.match(/^https:\/\/accounts.spotify.com/i)

module.exports = { getIsSpotifyAccountsUrl }
