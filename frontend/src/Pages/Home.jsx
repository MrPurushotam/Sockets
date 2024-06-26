import { Link } from "react-router-dom"

const Home = () => {
  return (
    <div>
      Hi there, Welcome to home page of chat app by Purushotam
      <br/>
      <Link to={"https://www.github.com/MrPurushotam"} target="_blank">Github</Link>
      <br/>
      <Link to={"https://www.leetcode.com/MrPurushotam"} target="_blank">Leetcode</Link>

      <br/>
      <hr/>
      <Link to={'/login'} >Login to chat</Link>
    </div>
  )
}

export default Home
