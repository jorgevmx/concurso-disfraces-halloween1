import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  updateDoc,
  doc
} from "firebase/firestore";
import { db } from "./firebase";

export default function ConcursoDisfraces() {
  const [participantes, setParticipantes] = useState([]);
  const [empleado, setEmpleado] = useState("");
  const [celular, setCelular] = useState("");

  useEffect(() => {
    cargarParticipantes();
  }, []);

  const cargarParticipantes = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, "participantes")
      );

      const datos = querySnapshot.docs.map((documento) => ({
        id: documento.id,
        ...documento.data(),
      }));

      setParticipantes(datos);
    } catch (error) {
      console.error(error);
    }
  };

  const votar = async (id) => {
    if (!empleado || !celular) {
      alert(
        "Ingresa tu número de empleado y los últimos 4 dígitos del celular."
      );
      return;
    }

    if (celular.length !== 4) {
      alert(
        "Los últimos 4 dígitos del celular deben contener exactamente 4 números."
      );
      return;
    }

    try {
      const existeVoto = query(
        collection(db, "votos"),
        where("empleado", "==", empleado),
        where("celular", "==", celular)
      );

      const resultado = await getDocs(existeVoto);

      if (!resultado.empty) {
        alert("❌ Ya registraste un voto.");
        return;
      }

      const participante = participantes.find(
        (p) => p.id === id
      );

      await addDoc(collection(db, "votos"), {
        empleado,
        celular,
        participanteId: id,
        fecha: new Date()
      });

      await updateDoc(
        doc(db, "participantes", id),
        {
          votos: (participante.votos || 0) + 1
        }
      );

      await cargarParticipantes();

      alert("✅ Voto registrado correctamente");

      setEmpleado("");
      setCelular("");

    } catch (error) {
      console.error(error);
      alert("❌ Error al registrar el voto");
    }
  };

  const ranking = [...participantes].sort(
    (a, b) => (b.votos || 0) - (a.votos || 0)
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, #000000, #2b0b45, #ff6600)",
        color: "white",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#ff8800",
            fontSize: "60px",
          }}
        >
          🎃 Concurso de Disfraces 🎃
        </h1>

        <p
          style={{
            textAlign: "center",
            fontSize: "24px",
          }}
        >
          👻 Vota por el disfraz más terrorífico 👻
        </p>

        <div
          style={{
            background: "rgba(0,0,0,0.5)",
            padding: "20px",
            borderRadius: "15px",
            marginBottom: "25px",
          }}
        >
          <h2>🪪 Identificación para votar</h2>

          <input
            type="text"
            placeholder="Número de empleado"
            value={empleado}
            onChange={(e) => setEmpleado(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "8px",
              border: "none",
            }}
          />

          <input
            type="text"
            placeholder="Últimos 4 dígitos del celular"
            value={celular}
            maxLength={4}
            onChange={(e) => setCelular(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div>
            <h2>👻 Participantes</h2>

            {participantes.map((p) => (
              <div
                key={p.id}
                style={{
                  background: "rgba(0,0,0,0.5)",
                  padding: "15px",
                  borderRadius: "15px",
                  marginBottom: "15px",
                }}
              >
                <img
                  src={p.foto}
                  alt={p.nombre}
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />

                <h3>{p.nombre}</h3>

                <p>{p.descripcion}</p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>
                    🦇 {p.votos || 0} votos
                  </span>

                  <button
                    onClick={() => votar(p.id)}
                    style={{
                      padding: "10px 15px",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer",
                      background: "green",
                      color: "white",
                    }}
                  >
                    🗳️ Votar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h2>🏆 Ranking Embrujado</h2>

            <div
              style={{
                background: "rgba(0,0,0,0.5)",
                padding: "15px",
                borderRadius: "15px",
              }}
            >
              {ranking.map((p, index) => (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0",
                  }}
                >
                  <span>
                    {index === 0
                      ? "🥇"
                      : index === 1
                      ? "🥈"
                      : index === 2
                      ? "🥉"
                      : "🎃"}{" "}
                    {p.nombre}
                  </span>

                  <span>
                    {p.votos || 0} votos
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}