import { forwardRef } from "react";

const Post = forwardRef(
  ({ title, body, liked, likesCount = 0, onLike }, ref) => (
    <div
      ref={ref}
      style={{
        borderBottom: "1px solid #ccc",
        marginBottom: "16px",
        padding: "15px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>{title}</h3>
      <p style={{ margin: "0 0 15px 0", color: "#666", lineHeight: "1.5" }}>
        {body}
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          onClick={onLike}
          style={{
            backgroundColor: liked ? "#ff6b6b" : "#f8f9fa",
            color: liked ? "white" : "#333",
            border: "1px solid #dee2e6",
            padding: "8px 16px",
            borderRadius: "20px",
            cursor: "pointer",
            fontSize: "14px",
            transition: "all 0.2s ease",
          }}
        >
          {liked ? "❤️ Liked" : "🤍 Like"}
        </button>

        <span
          style={{
            color: "#666",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          {likesCount} {likesCount === 1 ? "like" : "likes"}
        </span>
      </div>
    </div>
  )
);

export default Post;
