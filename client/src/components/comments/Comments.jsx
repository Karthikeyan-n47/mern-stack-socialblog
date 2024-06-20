import { useEffect, useState } from "react";
import "./comments.css";
// import { context } from "../../context/Context";
import axios from "../../axios";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [updateMode, setUpdateMode] = useState(false);
  const [message, setMessage] = useState("");
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const { user } = useSelector((state) => state.user);
  // const { user } = useContext(context);
  const postId = useLocation().pathname.split("/")[2];
  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await axios.get(`/comments/${postId}`);
        setComments(res.data);
        setError("");
      } catch (err) {
        setError(err.message);
        // console.log(err.message);
      }
    };
    getComments();
  }, [postId]);
  const handleDelete = async (comment, i) => {
    try {
      await axios.delete(`/comments/${comment._id}`);
      setComments(comments.map((c, index) => (index === i ? null : c)));
      setError("");
      // window.location.reload();
    } catch (err) {
      // console.log(err.message);
      setError(err.message);
    }
  };
  const handleUpdate = async (comment, e, i) => {
    e.preventDefault();
    try {
      const updatedComment = await axios.put(`/comments/${comment._id}`, {
        message,
      });
      setUpdateMode(false);
      setComments(
        comments.map((c, index) => (index === i ? updatedComment.data : c))
      );
      setError("");
      // window.location.reload();
    } catch (err) {
      // console.log(err.message);
      setError(err.message);
    }
  };
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const createdComment = await axios.post(`/comments/${postId}`, {
        message: newComment,
      });
      setComments([...comments, createdComment.data]);
      // setNewComment("");
      // window.location.reload();
      setError("");
    } catch (err) {
      // console.log(err.message);
      setError(err.message);
    }
  };
  return (
    <div className="comments">
      <div className="commentsTitle">Comments:</div>
      <div className="commentsContainer">
        {comments?.map((comment, i) => {
          if (comment) {
            return (
              <div className="commentWrapper" key={i}>
                <div className="commentTop">
                  <div className="commentTopLeft">
                    <span className="commentUserImg">
                      <img src={comment?.user?.profilePic} alt="" />
                    </span>
                    <span className="commentUsername">
                      @{comment?.user?.username}
                    </span>
                    <span className="commentCreatedTime">
                      {new Date(comment?.createdAt).toDateString()}
                    </span>
                  </div>

                  {comment?.user?._id === user?._id && (
                    <div className="commentTopRight">
                      <i
                        className="commentTopRightIcon editIcon fa-solid fa-pen-to-square"
                        onClick={(e) => setUpdateMode(true)}
                      ></i>
                      <i
                        className="commentTopRightIcon deleteIcon fa-solid fa-trash-can"
                        onClick={(e) => handleDelete(comment, i)}
                      ></i>
                    </div>
                  )}
                </div>
                <div className="commentMessage">
                  {updateMode ? (
                    <form
                      className="commentUpdateForm"
                      onSubmit={(e) => handleUpdate(comment, e, i)}
                    >
                      <input
                        type="text"
                        className="commentUpdateInput"
                        placeholder={comment.message}
                        // value={comment.message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                      <button className="commentUpdateButton" type="submit">
                        Update
                      </button>
                    </form>
                  ) : (
                    comment?.message
                  )}
                </div>
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>
      <div className="commentCreateContainer">
        {user && (
          <form className="commentCreateForm" onSubmit={handleCreate}>
            <input
              type="text"
              className="commentCreateInput"
              placeholder="Enter your comment here..."
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button className="commentCreateButton" type="submit">
              Post
            </button>
          </form>
        )}
      </div>
      {error && <span className="updateError">Uh oh! {error}</span>}
    </div>
  );
}
