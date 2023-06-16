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
