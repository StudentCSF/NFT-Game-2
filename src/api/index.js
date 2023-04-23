import withCors from "config/cors"

async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return
}

export default withCors(handler)

