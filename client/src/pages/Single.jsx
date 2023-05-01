import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Menu from "../components/Menu";
import axios from "axios";
import { AuthContext } from "../context/authContext";

const Single = () => {
  const [post, setPost] = useState();
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const navigate =useNavigate();
  

  useEffect(() => {
    const fetchdata = async () => {
      await axios
        .get(`http://localhost:8800/api/posts/${id}`)
        .then((response) => setPost(response.data));
    };
    fetchdata();
  }, [id]);

  

  const handleDelete = async () => {
    
    await axios.delete(`http://localhost:8800/api/posts/${id}`).then((res)=>alert(res.data));
    navigate('/');

  };

  return (
    <div>
      <Header />
      <div className="single">
        <div className="content">
          <img src={post?.imge} alt="" />
          <div className="user">
            {post?.userImage && <img src={post?.userImage} alt="" />}
            <div className="info">
              <span>{post?.username}</span>
              <p> 2 days ago</p>
            </div>
            {currentUser?.id === post?.uid && (
              <div className="edit">
                <Link to={`/write?edit=`} state={post}>
                  <img src="" alt="edit" />
                </Link>
                
                  <button onClick={handleDelete}>
                    <img src="" alt="delete" />
                  </button>
                
              </div>
            )}
          </div>
          <h1>{post?.title}</h1>
          <p>{post?.desc}</p>
        </div>
        <Menu cat={post?.cat}/>
      </div>
    </div>
  );
};

export default Single;
