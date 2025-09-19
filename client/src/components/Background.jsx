import { Squares } from "../components/squares-background"

export function Background() {
  return (
    <div className="fixed inset-0 -z-10">
      <Squares
        direction="diagonal"
        speed={0.5}
        squareSize={40}
        borderColor="#333"
        hoverFillColor="#222"
      />
    </div>
  )
}
