import axios from "axios";

export default async function (req, res) {
  try {
    const response = await axios.post("http://localhost:8000/upload", req.body);

    res.status(200).json(response.data);
  } catch (err) {
    console.log(err);
    res.status(err.status || 500).json(err);
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
