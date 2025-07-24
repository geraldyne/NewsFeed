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
      dispatch(addPost({
        title: title.trim(),
        body: body.trim(),
        userId: 1 // Simulamos un usuario
      }));
      
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

  if (!isOpen) {
    return (
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          ✏️ Crear nuevo post
        </button>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: "#f8f9fa",
      padding: "20px",
      borderRadius: "8px",
      marginBottom: "20px",
      border: "1px solid #dee2e6"
    }}>
      <h3 style={{ marginTop: 0 }}>Crear nuevo post</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="title" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
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
              padding: "10px",
              border: "1px solid #ced4da",
              borderRadius: "4px",
              fontSize: "16px"
            }}
            required
          />
        </div>
        
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="body" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Contenido:
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="¿Qué quieres compartir?"
            rows="4"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ced4da",
              borderRadius: "4px",
              fontSize: "16px",
              resize: "vertical"
            }}
            required
          />
        </div>
        
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="submit"
            style={{
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            📝 Publicar
          </button>
          
          <button
            type="button"
            onClick={handleCancel}
            style={{
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            ❌ Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
