import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../components/Header";

const Home = () => {
  const [post, setPost] = useState([]);
  const cat = useLocation().search;

  useEffect(() => {
    const fetchdata = async () => {
      await axios
        .get(`http://localhost:8800/api/posts${cat}`)
        .then((response) => setPost(response.data));
    };
    fetchdata();
  }, [cat]);
  
  
  return (
    <div>
      <Header />
      <div className="home">
        <div className="posts">
          {post.map((post) => (
            <div className="post" key={post.id}>
              <div className="img">
                <img src={post.imge} alt="" />
              </div>
              <div className="content">
                <Link className="link" to={`/post/${post.id}`}>
                  <h1>{post.title}</h1>
                </Link>
                <p>{post.desc}</p>
                <button>Read more...</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
