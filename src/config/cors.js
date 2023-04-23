import cors from "vercel-cors"

export default cors({
  origin: 'https://nft-game-2-client.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'UPDATE', 'DELETE']
});