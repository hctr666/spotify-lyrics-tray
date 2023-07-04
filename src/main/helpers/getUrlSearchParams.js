export const getUrlSearchParams = urlString => {
  const url = new URL(urlString)
  const params = new URLSearchParams(url.searchParams)
  return params
}
