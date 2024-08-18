import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Notes";
import "../styles/Home.css";
function Home() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState([]);
  const [title, setTitle] = useState([]);

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    api
      .get("/api/notes/")
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
        console.log(data);
      })
      .catch((err) => alert("Error al obtener las notas: " + err.message));
  };

  const deleteNote = (id) => {
    api
      .delete(`api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) {
          alert("La nota a sido borrada!");
          setNotes(notes.filter(note => note.id !== id)); // Filtra la nota eliminada del estado
        } else {
          alert("Hubo un error al borrar la nota.");
          getNotes();
        }
      })
      .catch((error) => alert(error));
  };

  const createNote = (e) => {
    e.preventDefault();
    api
      .post("/api/notes/", { content, title })
      .then((res) => {
        if (res.status === 201) {
          alert("La nota se ha creado correctamente!");
          setNotes([...notes, res.data]); // Agrega la nueva nota al estado
        } else {
          alert("Hubo un error al crear la nota.");
          getNotes();
        }
      })
      .catch((error) => alert(error));
  };

  return <div>
        <div>
            <h2>Notas</h2>
            {notes.map((note) => (
              <Note note={note} onDelete={deleteNote} key={note.id}/>
            ))}
        </div>
        <h2>Crear una nota</h2>
        <form onSubmit={createNote}>
           <label htmlFor="title">Titulo:</label>
           <br/>
           <input
            type="text"
            id="title"
            name="title"
            required
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            />
            <label htmlFor="content">Idea:</label>
            <br/>
            <textarea
            id="content"
            name="content"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            />
            <br/>
            <input type="submit" value="Crear"/>
        </form>
  </div>;
}

export default Home;
