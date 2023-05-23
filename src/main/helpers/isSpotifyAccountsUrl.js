const getIsSpotifyAccountsUrl = url =>
  /^https:\/\/accounts.spotify.com/i.test(url)

module.exports = { getIsSpotifyAccountsUrl }
