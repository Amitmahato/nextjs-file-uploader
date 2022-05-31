import React from "react";
import { Button, message, Modal, Spin, Upload } from "antd";
import axios from "axios";
import Layout from "antd/lib/layout/layout";
import API from "./api";
import Image from "next/image";

interface uploaderProps {}

const Uploader: React.FC<uploaderProps> = () => {
  const [imgUrl, setImgUrl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
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
        {imgUrl && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50%",
              width: "50%",
              marginBottom: 20,
            }}
          >
            <Image
              height="100%"
              width="100%"
              src={imgUrl}
              alt="Image uploaded"
            />
          </div>
        )}
        <div>
          <Button
            style={{ marginRight: 10 }}
            onClick={async () => {
              await API.get("/ping").then((res) => {
                message.success("Ping Response : " + res.data?.message);
              });
            }}
          >
            Ping
          </Button>
          <Button onClick={() => setOpen(true)}>Upload</Button>
        </div>
        <Modal
          visible={open}
          onCancel={() => setOpen(false)}
          onOk={() => setOpen(false)}
        >
          <Upload
            disabled={loading}
            name="file"
            multiple={false}
            onChange={async (val) => {
              setLoading(true);
              const { file } = val;
              const formData = new FormData();
              formData.append("file", file.originFileObj, file.name);
              if (file.status === "done") {
                // Follow the network request in console to verify that third request to upload will cause internal server error
                // 1. this will work; to make it work server must set Access-Control-Allow-Origin in response header to include http://localhost:3000 (origin)
                // await axios
                //   .post("http://localhost:8000/upload", formData)
                //   .then((res) => {
                //     setImgUrl(res.data.url);
                //     setOpen(false);
                //     setLoading(false);
                //   })
                //   .catch((err) => {
                //     console.log("Error : ", err);
                //     setLoading(false);
                //   });

                // // 2. this will work; to make it work server must set Access-Control-Allow-Origin in response header to include http://localhost:3000 (origin)
                await API.post("/upload", formData).then((res) => {
                  setImgUrl(res.data.url);
                  setOpen(false);
                  setLoading(false);
                });

                // // 3. this will not work - request forwarding through API routes
                // await axios.post("api/upload", formData).then((res) => {
                //   setImgUrl(res.data.url);
                //   setOpen(false);
                //   setLoading(false);
                // });
              } else if (file.status === "removed") {
                setLoading(false);
              }
            }}
            listType="picture-card"
            maxCount={1}
          >
            {loading ? <Spin spinning={loading} size="large" /> : "Upload"}
          </Upload>
        </Modal>
      </div>
    </Layout>
  );
};

export default Uploader;
