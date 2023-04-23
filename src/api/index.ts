export default (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).send();
  }
}
