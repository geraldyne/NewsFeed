import { forwardRef } from "react";

const Post = forwardRef(
  ({ title, body, liked, likesCount = 0, author = "Usuario", onLike }, ref) => (
    <div
      ref={ref}
      style={{
        borderBottom: "1px solid #333333",
        marginBottom: "16px",
        padding: "20px",
        backgroundColor: "#1a1a1a",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        border: "1px solid #333333",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "12px",
        }}
      >
        <h3
          style={{
            margin: "0",
            color: "#ffffff",
            fontSize: "18px",
            fontWeight: "600",
          }}
        >
          {title}
        </h3>
        <span
          style={{
            color: "#888888",
            fontSize: "12px",
            fontWeight: "500",
          }}
        >
          por {author}
        </span>
      </div>
      <p
        style={{
          margin: "0 0 18px 0",
          color: "#e0e0e0",
          lineHeight: "1.6",
          fontSize: "15px",
        }}
      >
        {body}
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          onClick={onLike}
          style={{
            backgroundColor: liked ? "#ff4757" : "#2a2a2a",
            color: liked ? "white" : "#e0e0e0",
            border: `1px solid ${liked ? "#ff4757" : "#444444"}`,
            padding: "10px 18px",
            borderRadius: "25px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => {
            if (!liked) {
              e.target.style.backgroundColor = "#3a3a3a";
              e.target.style.borderColor = "#555555";
            }
          }}
          onMouseOut={(e) => {
            if (!liked) {
              e.target.style.backgroundColor = "#2a2a2a";
              e.target.style.borderColor = "#444444";
            }
          }}
        >
          {liked ? "❤️ Liked" : "🤍 Like"}
        </button>

        <span
          style={{
            color: "#b0b0b0",
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
