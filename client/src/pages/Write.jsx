import React, { useState } from "react";
import Header from "../components/Header";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import moment from "moment";

const Write = () => {
  const state = useLocation().state;

  const [title, setTitle] = useState(state?.title || "");
  const [desc, setDesc] = useState(state?.desc || "");
  const [file, setFile] = useState();
  const [cat, setCat] = useState(state?.cat || "");

  const upload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post("http://localhost:8800/upload", formData);
    return res.data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imgUrl =await upload();
    state
      ? await axios
          .put(`http://localhost:8800/api/posts/${state.id}`, {
            title,
            desc,
            img: file ? imgUrl : "",
            cat,
          })
          .then((res) => alert(res.data))
      : await axios
          .post(`http://localhost:8800/api/posts`, {
            title,
            desc,
            img: file ? imgUrl : "",
            cat,
            date:moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
          })
          .then((res) => alert(res.data));
  };

  return (
    <div>
      <Header />
      <div className="add">
        <div className="content">
          <input
            type="text"
            placeholder="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="editcontainer">
            <ReactQuill
              className="editor"
              theme="snow"
              value={desc}
              onChange={setDesc}
            />
          </div>
        </div>

        <div className="menu">
          <div className="item">
            <h1>Publish</h1>
            <span>
              <b>status:</b>draft
            </span>
            <span>
              <b>visibility:</b>public
            </span>
            <input
              type="file"
              id="file"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <div className="buttons">
              <button onClick={handleSubmit}>Publish</button>
              <button>update</button>
            </div>
          </div>
          <div className="item">
            <h1>Category</h1>
            <input
              type="text"
              value={cat}
              onChange={(e) => setCat(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Write;
