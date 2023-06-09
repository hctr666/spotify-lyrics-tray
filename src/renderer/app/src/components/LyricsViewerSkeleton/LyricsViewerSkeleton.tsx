import ContentLoader from 'react-content-loader'

const GAP = 32
const widths = [270, 250, 120, 280, 180]

const getRandomWidth = () => widths[Math.floor(Math.random() * widths.length)]

const initialRect = {
  y: 0,
  x: 0,
  rx: 5,
  ry: 5,
  height: 10,
  width: getRandomWidth(),
}

export const LyricsViewerSkeleton = () => {
  const rects = [...Array(10).keys()].reduce(
    acc => {
      const last = acc[acc.length - 1]
      return [...acc, { ...last, y: last.y + GAP, width: getRandomWidth() }]
    },
    [initialRect]
  )

  return (
    <ContentLoader
      viewBox='0 0 300 285'
      backgroundOpacity={0.12}
      foregroundOpacity={0.2}
      style={{ overflow: 'hidden', padding: '2rem 2rem' }}
    >
      {rects.map(rectProps => (
        <rect key={`rect-${rectProps.y}`} {...rectProps} />
      ))}
    </ContentLoader>
  )
}
