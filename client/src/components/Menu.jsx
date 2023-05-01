import React, { useState,useEffect } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';

const Menu = ({cat}) => {

    const [post ,setPost]=useState([]);
    useEffect(() => {
      const fetchdata = async () => {
        await axios
          .get(`http://localhost:8800/api/posts`,{cat})
          .then((response) => setPost(response.data));
      };
      fetchdata();
    }, [cat]);

  return (
    <div className='menu'>
      <h1>other post</h1>
      
        {post.map((post) => (
            <div className="post" key={post.id}>
              
                <img src={post.imge} alt="" />
              
              
                <Link className="link" to={`/post/${post.id}`}>
                  <h2>{post.title}</h2>
                </Link>
                
                <button>Read more...</button>
              
            </div>
          ))}
      
    </div>
  )
}

export default Menu
