import {
  FORBIDDEN_STATUS,
  NOT_FOUND_STATUS,
  UNAUTHORIZED_STATUS,
} from '../constants'
import errors from '../errors'
import { getAccessToken } from './page'

const getColorLyricsAPIUrl = (trackId, imageUrl) => {
  const encodedImageUrl = encodeURIComponent(imageUrl)
  return `
    https://spclient.wg.spotify.com/color-lyrics/v2/track/${trackId}/image/${encodedImageUrl}?format=json&vocalRemoval=false&market=from_token`
}

const getHeaders = accessToken => {
  return {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'app-platform': 'WebPlayer',
  }
}

export const fetchTrackLyrics = async (trackId, imageUrl) => {
  try {
    const url = getColorLyricsAPIUrl(trackId, imageUrl)
    const accessToken = getAccessToken()

    const response = await fetch(url, {
      headers: getHeaders(accessToken),
    })

    if ([NOT_FOUND_STATUS, FORBIDDEN_STATUS].includes(response.status)) {
      return null
    }

    if (response.status === UNAUTHORIZED_STATUS) {
      throw new Error(errors.INVALID_TOKEN)
    }

    const data = await response.json()

    return data
  } catch (error) {
    throw new Error(error.message)
  }
}
