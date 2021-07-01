// import React from "react";
// import { Upload } from "antd";

// interface uploaderProps {}

// const Uploader: React.FC<uploaderProps> = () => {
//   return (
//     <div>
//       <Upload listType="picture-card">Upload</Upload>
//     </div>
//   );
// };

// export default Uploader;

import React from "react";
import { Button, Modal, Upload } from "antd";
import axios from "axios";
import Layout from "antd/lib/layout/layout";
import API from "./api";

interface uploaderProps {}

const Uploader: React.FC<uploaderProps> = () => {
  const [imgUrl, setImgUrl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  return (
    <Layout>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {imgUrl && <img src={imgUrl} alt="Image uploaded" />}
        <Button onClick={() => setOpen(true)}>Upload</Button>
        <Modal
          visible={open}
          onCancel={() => setOpen(false)}
          onOk={() => setOpen(false)}
        >
          <Upload
            name="file"
            multiple={false}
            onChange={async (val) => {
              const { file } = val;
              console.log(val);
              const formData = new FormData();
              formData.append("file", file.originFileObj, file.name);
              if (file.status === "done") {
                // Follow the network request in console to verify that third request to upload will cause internal server error
                // 1. this will work; to make it work server must set Access-Control-Allow-Origin in response header to include http://localhost:3001 (origin)
                await axios
                  .post("http://localhost:8000/upload", formData)
                  .then((res) => {
                    setImgUrl(res.data.url);
                  });

                // 2. this will work; to make it work server must set Access-Control-Allow-Origin in response header to include http://localhost:3001 (origin)
                await API.post("/upload", formData).then((res) => {
                  setImgUrl(res.data.url);
                });

                // 3. this will not work - request forwarding through API routes
                await axios.post("api/upload", formData).then((res) => {
                  setImgUrl(res.data.url);
                });
              }
            }}
            listType="picture-card"
            maxCount={1}
          >
            Upload
          </Upload>
        </Modal>
      </div>
    </Layout>
  );
};

export default Uploader;
