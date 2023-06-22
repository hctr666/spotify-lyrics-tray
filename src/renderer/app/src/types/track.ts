export interface AlbumImage {
  url: string
}

export interface Artist {
  name: string
}

export interface Album {
  name: string
  images: AlbumImage[]
}

export interface Track {
  id: string
  name: string
  album: Album
  artists: Artist[]
}

export interface DisplayTrack {
  title?: string
  artistName?: string
  imageUrl?: string
}

export interface TrackContextValue {
  displayTrack: DisplayTrack
  isLoading?: boolean
  error?: string
}
