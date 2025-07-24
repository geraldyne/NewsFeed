import { useState } from "react";
import { useDispatch } from "react-redux";
import { addPost } from "../features/posts/postSlice";

const PostForm = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title.trim() && body.trim()) {
      dispatch(
        addPost({
          title: title.trim(),
          body: body.trim(),
          userId: 1, // Simulamos un usuario
        })
      );

      // Limpiar el formulario
      setTitle("");
      setBody("");
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setBody("");
    setIsOpen(false);
  };

  return (
    <>
      {/* Botón flotante en esquina inferior derecha */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "60px",
          height: "60px",
          backgroundColor: "#1a1a1a",
          color: "white",
          border: "none",
          borderRadius: "50%",
          cursor: "pointer",
          fontSize: "24px",
          boxShadow: "0 4px 20px rgba(156, 163, 175, 0.3)",
          zIndex: 1000,
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = "#1a1a1a";
          e.target.style.transform = "scale(1.1)";
          e.target.style.boxShadow = "0 6px 25px rgba(156, 163, 175, 0.3)";
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = "#1a1a1a";
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = "0 4px 20px rgba(156, 163, 175, 0.3)";
        }}
        title="Crear nuevo post"
      >
        +
      </button>

      {/* Modal */}
      {isOpen && (
        <>
          {/* Overlay de fondo */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              zIndex: 1001,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
            onClick={handleCancel}
          >
            {/* Contenido del modal */}
            <div
              style={{
                backgroundColor: "#1a1a1a",
                padding: "30px",
                borderRadius: "16px",
                border: "1px solid #333333",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.8)",
                width: "100%",
                maxWidth: "500px",
                maxHeight: "90vh",
                overflow: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    color: "#ffffff",
                    fontSize: "22px",
                    fontWeight: "600",
                  }}
                >
                  Crear nuevo post
                </h3>
                <button
                  onClick={handleCancel}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#888888",
                    fontSize: "24px",
                    cursor: "pointer",
                    padding: "5px",
                    borderRadius: "50%",
                    width: "35px",
                    height: "35px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#333333";
                    e.target.style.color = "#ffffff";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#888888";
                  }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "20px" }}>
                  <label
                    htmlFor="title"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "bold",
                      color: "#e0e0e0",
                      fontSize: "14px",
                    }}
                  >
                    Título:
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Escribe el título de tu post..."
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #444444",
                      borderRadius: "8px",
                      fontSize: "16px",
                      backgroundColor: "#2a2a2a",
                      color: "#ffffff",
                      outline: "none",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#4a90e2";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#444444";
                    }}
                    required
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    htmlFor="body"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "bold",
                      color: "#e0e0e0",
                      fontSize: "14px",
                    }}
                  >
                    Contenido:
                  </label>
                  <textarea
                    id="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="¿Qué quieres compartir?"
                    rows="5"
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #444444",
                      borderRadius: "8px",
                      fontSize: "16px",
                      resize: "vertical",
                      backgroundColor: "#2a2a2a",
                      color: "#ffffff",
                      outline: "none",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#4a90e2";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#444444";
                    }}
                    required
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    type="button"
                    onClick={handleCancel}
                    style={{
                      backgroundColor: "#757575",
                      color: "white",
                      border: "none",
                      padding: "12px 20px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "16px",
                      fontWeight: "500",
                      transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#616161";
                      e.target.style.transform = "translateY(-1px)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "#757575";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    style={{
                      backgroundColor: "#4caf50",
                      color: "white",
                      border: "none",
                      padding: "12px 20px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "16px",
                      fontWeight: "500",
                      transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#45a049";
                      e.target.style.transform = "translateY(-1px)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "#4caf50";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    Publicar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PostForm;
