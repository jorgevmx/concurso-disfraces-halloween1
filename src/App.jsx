import { useState } from "react";

export default function ConcursoDisfraces() {
  const [participantes, setParticipantes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [foto, setFoto] = useState("");
  const [yaVoto, setYaVoto] = useState(
    localStorage.getItem("yaVoto") === "true"
  );

  const cargarFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setFoto(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const registrar = () => {
    if (!nombre || !foto) {
      alert("Debes ingresar un nombre y una foto.");
      return;
    }

    const nuevoParticipante = {
      id: Date.now(),
      nombre,
      descripcion,
      foto,
      votos: 0,
    };

    setParticipantes([...participantes, nuevoParticipante]);

    setNombre("");
    setDescripcion("");
    setFoto("");
  };

  const votar = (id) => {
    if (yaVoto) {
      alert("Ya has emitido tu voto.");
      return;
    }

    setParticipantes(
      participantes.map((p) =>
        p.id === id
          ? { ...p, votos: p.votos + 1 }
          : p
      )
    );

    setYaVoto(true);
    localStorage.setItem("yaVoto", "true");

    alert("✅ Tu voto ha sido registrado.");
  };

  const reiniciarVoto = () => {
    localStorage.removeItem("yaVoto");
    setYaVoto(false);

    alert("🔄 Se reinició el estado de votación.");
  };

  const ranking = [...participantes].sort(
    (a, b) => b.votos - a.votos
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
          👻 Registra tu disfraz y vota por el más terrorífico 👻
        </p>

        <div
          style={{
            background: "rgba(0,0,0,0.5)",
            padding: "20px",
            borderRadius: "20px",
            marginBottom: "30px",
          }}
        >
          <h2 style={{ textAlign: "center" }}>
            🕸️ Registro de Participantes
          </h2>

          <input
            type="text"
            placeholder="Nombre del participante"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "10px",
            }}
          />

          <textarea
            placeholder="Descripción del disfraz"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "10px",
            }}
          />

          <input
            type="file"
            accept="image/*"
            onChange={cargarFoto}
          />

          {foto && (
            <div style={{ marginTop: "10px" }}>
              <img
                src={foto}
                alt="Preview"
                style={{
                  width: "180px",
                  borderRadius: "10px",
                }}
              />
            </div>
          )}

          <br />

          <button
            onClick={registrar}
            style={{
              marginTop: "10px",
              background: "#ff6600",
              color: "white",
              border: "none",
              padding: "12px 20px",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            🎃 Registrar Disfraz
          </button>
        </div>

        {yaVoto && (
          <div
            style={{
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            <h3 style={{ color: "#00ff88" }}>
              ✅ Ya registraste tu voto.
            </h3>

            <button
              onClick={reiniciarVoto}
              style={{
                background: "#cc0000",
                color: "white",
                border: "none",
                padding: "10px 15px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              🔄 Reiniciar Voto
            </button>
          </div>
        )}

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
                    maxHeight: "280px",
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
                  <span>🦇 {p.votos} votos</span>

                  <button
                    onClick={() => votar(p.id)}
                    disabled={yaVoto}
                    style={{
                      padding: "10px 15px",
                      border: "none",
                      borderRadius: "10px",
                      cursor: yaVoto
                        ? "not-allowed"
                        : "pointer",
                      background: yaVoto
                        ? "#666"
                        : "green",
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
              {ranking.length === 0 ? (
                <p>No hay participantes registrados.</p>
              ) : (
                ranking.map((p, index) => (
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

                    <span>{p.votos} votos</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}