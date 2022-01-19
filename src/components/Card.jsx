import axios from "axios";
import { useEffect, useState } from "react";

export const Card = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState();
  const savedPostsInLocalStorage = JSON.parse(localStorage.getItem("posts"));

  useEffect(() => {
    (async function () {
      if (savedPostsInLocalStorage?.length > 0) {
        setPosts(savedPostsInLocalStorage);
      } else {
        try {
          setLoading(true);
          const { data } = await axios.get(
            "https://api.nasa.gov/planetary/apod?api_key=q54UDDMuZowyEVMm0lmIIVeikVv8h6wc8JPOKVeV&count=10"
          );
          setPosts(data);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, []);

  const likeHandler = (index) => {
    const postToBeUpdated = posts[index];
    const updatedPost = {
      ...postToBeUpdated,
      liked: postToBeUpdated.liked ? false : true,
    };
    setPosts((prev) =>
      prev.map((item) =>
        item.title === postToBeUpdated.title ? updatedPost : item
      )
    );
    localStorage.setItem(
      "posts",
      JSON.stringify(
        posts.map((item) =>
          item.title === postToBeUpdated.title ? updatedPost : item
        )
      )
    );
  };

  return (
    <div className="container">
      {loading && <span className="loader">Loading..</span>}
      {posts?.map((item, index) => {
        const { date, url, title, explanation, copyright } = item;
        return (
          <div className="post">
            <span className="title">{title}</span>
            <span className="copyright">
              Brought to you by {copyright ? copyright : "NASA"}
            </span>
            <img src={url} alt={title} className="img"></img>
            <div className="details">
              <span className="explanation">
                {explanation?.slice(0, 60)}...
              </span>
              <span className="date">{date}</span>
              <button className="like" onClick={() => likeHandler(index)}>
                {item.liked ? "Unlike" : "Like"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
