import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../Layout";

const Details = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [book, setBook] = useState(null);
  const [comments, setComments] = useState(null);
  const [newComment, setNewComment] = useState("");
  const isAuthenticated = localStorage.getItem("token");

  const { id } = useParams();

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/books/${id}/comments`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/books/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch book details");
        } else {
          await fetchComments();
        }
        const data = await response.json();
        setBook(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    // Send a POST request to the backend to add the comment
    if (newComment.trim()) {
      try {
        const commentData = {
          text: newComment,
          book: id,
        };

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/comments/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(commentData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to add comment");
        }

        // The response should ideally return the newly created comment
        const addedComment = await response.json();

        // Add the new comment to the existing comments in the state
        setComments([addedComment, ...comments]);

        // Clear the input fields
        setNewComment("");
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <p className="text-center text-lg font-semibold text-red-500">
          {error}
        </p>
      </Layout>
    );
  }

  if (!book)
    return (
      <Layout>
        <p className="text-center text-lg font-semibold text-red-500">
          Book not found!
        </p>
      </Layout>
    );

  return (
    <Layout>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Responsive Flexbox: Column on small screens, Row on large screens */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
          {/* Book Cover */}
          <img
            src={book.cover}
            alt={book.title}
            className="w-full lg:w-1/3 h-80 object-cover rounded-lg shadow-lg"
          />

          {/* Book Details */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{book.title}</h1>
            <p className="mt-1 text-gray-600 text-sm">By {book.author}</p>
            <p className="text-gray-700 mt-3 leading-relaxed">
              {book.description}
            </p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-8">
          {comments && comments.length > 0 ? (
            <>
              <h2 className="text-xl font-semibold border-b pb-2">Comments</h2>
              <div className="mt-3 space-y-3">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border p-3 rounded bg-gray-100 shadow-sm"
                  >
                    <p className="text-sm font-semibold text-gray-700">
                      {comment.user}
                    </p>
                    <p className="text-gray-900">{comment.text}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p>No comments yet.</p>
          )}

          {/* Comment Form */}
          <h2 className="text-xl font-semibold my-5">Add Your Comment</h2>
          {isAuthenticated ? (
            <form onSubmit={handleCommentSubmit} className="mt-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-teal-400"
                placeholder="Add your comment..."
                rows="3"
              ></textarea>
              <button
                type="submit"
                className="mt-3 bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700 transition"
              >
                Submit Comment
              </button>
            </form>
          ) : (
            <p>Login to give a comment</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Details;
