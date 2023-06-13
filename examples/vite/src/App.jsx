import "@code-hike/mdx/styles"
import Content from "./hello.mdx"

function App() {
  return (
    <div style={{ maxWidth: 768, margin: "0 auto", fontFamily: "sans-serif" }}>
      <Content loremPlaceholder="AHA!" ipsumPlaceholder="AHA!" />
    </div>
  )
}

export default App
