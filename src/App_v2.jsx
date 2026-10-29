import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc
} from "firebase/firestore";
import { db } from "./firebase";

export default function ConcursoDisfracesV2() {
  const [pantalla, setPantalla] = useState("registro");
  const [participantes, setParticipantes] = useState([]);

  const MOSTRAR_RESULTADOS = true;
const MOSTRAR_VOTOS = false;
const VOTACION_ABIERTA = true;

  useEffect(() => {
    cargarParticipantes();
  }, []);

  const cargarParticipantes = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "participantes")
      );

      const datos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setParticipantes(datos);

    } catch (error) {
      console.error(error);
    }
  };

  const adultos = participantes.filter(
    (p) => p.categoria === "Adultos"
  );

  const ninos = participantes.filter(
    (p) => p.categoria === "Niños"
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
            fontSize: "50px",
          }}
        >
          🎃 Concurso de Disfraces SKF 🎃
        </h1>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "25px",
            flexWrap: "wrap",
          }}
        >
<button
  onClick={() => setPantalla("registro")}
  style={{
    background: "#ff8800",
    color: "white",
    border: "none",
    padding: "15px 25px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    boxShadow: "0 0 10px rgba(255,136,0,0.4)",
  }}
>
  🎃 Registrar Disfraz
</button>
<button
  onClick={() => setPantalla("adultos")}
  style={{
    background: "#ff8800",
    color: "white",
    border: "none",
    padding: "15px 25px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    boxShadow: "0 0 10px rgba(255,136,0,0.4)",
  }}
>
  🎃 Votar Adultos
</button>

<button
  onClick={() => setPantalla("ninos")}
  style={{
    background: "#ff8800",
    color: "white",
    border: "none",
    padding: "15px 25px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    boxShadow: "0 0 10px rgba(255,136,0,0.4)",
  }}
>
  👻 Votar Niños
</button>
{MOSTRAR_RESULTADOS && (
  <button onClick={() => setPantalla("resultados")}>
    🏆 Resultados
  </button>
)}        </div>
{!MOSTRAR_RESULTADOS && (
  <div
    style={{
      background: "rgba(255,140,0,0.15)",
      padding: "15px",
      borderRadius: "10px",
      marginBottom: "20px",
      textAlign: "center",
    }}
  >
    🎃 Los resultados serán publicados al finalizar el concurso.
  </div>
)}

        {pantalla === "registro" && (
          <RegistroDisfraz
            recargar={cargarParticipantes}
          />
        )}

        {pantalla === "adultos" && (
<ListadoParticipantes
  titulo="👨 Disfraces Adultos"
  participantes={adultos}
  cargarParticipantes={cargarParticipantes}
  mostrarVotos={MOSTRAR_VOTOS}
  votacionAbierta={VOTACION_ABIERTA}
/>        )}

        {pantalla === "ninos" && (
<ListadoParticipantes
  titulo="🧒 Disfraces Niños"
  participantes={ninos}
  cargarParticipantes={cargarParticipantes}
  mostrarVotos={MOSTRAR_VOTOS}
  votacionAbierta={VOTACION_ABIERTA}
/>        )}

{pantalla === "resultados" &&
  MOSTRAR_RESULTADOS && (
    <Resultados
      adultos={adultos}
      ninos={ninos}
    />
)}      </div>
    </div>
  );
}

function RegistroDisfraz({ recargar }) {
  const [nombre, setNombre] = useState("");
  const [disfraz, setDisfraz] = useState("");
  const [categoria, setCategoria] =
    useState("Adultos");
  const [foto, setFoto] = useState("");

  const cargarFoto = (e) => {
    const archivo = e.target.files[0];

    if (!archivo) return;

    const reader = new FileReader();

    reader.onload = () => {
      const imagen = new Image();

      imagen.onload = () => {
        const canvas =
          document.createElement("canvas");

        const maxWidth = 800;

        const escala =
          maxWidth / imagen.width;

        canvas.width = maxWidth;

        canvas.height =
          imagen.height * escala;

        const ctx =
          canvas.getContext("2d");

        ctx.drawImage(
          imagen,
          0,
          0,
          canvas.width,
          canvas.height
        );

        const base64 =
          canvas.toDataURL(
            "image/jpeg",
            0.7
          );

        setFoto(base64);
      };

      imagen.src = reader.result;
    };

    reader.readAsDataURL(archivo);
  };

  const registrar = async () => {
    if (
      !nombre ||
      !disfraz ||
      !foto
    ) {
      alert(
        "Completa todos los datos."
      );

      return;
    }

    try {
        const disfrazExistente = query(
    collection(db, "participantes"),
    where("nombre", "==", nombre),
    where("disfraz", "==", disfraz)
  );

  const resultado = await getDocs(
    disfrazExistente
  );

  if (!resultado.empty) {
    alert(
      "❌ Este disfraz ya fue registrado."
    );
    return;
  }
      await addDoc(
        collection(db, "participantes"),
        {
          nombre,
          disfraz,
          categoria,
          foto,
          votos: 0,
          fecha: new Date(),
        }
      );

      alert(
        "✅ Disfraz registrado correctamente"
      );

      setNombre("");
      setDisfraz("");
      setFoto("");

      recargar();

    } catch (error) {
      console.error(error);

      alert(
        "❌ Error al registrar"
      );
    }
  };

  return (
<div
  style={{
    background: "rgba(255,136,0,0.15)",
    padding: "20px",
    borderRadius: "15px",
    border: "2px solid #ff8800",
    boxShadow: "0 0 20px rgba(255,136,0,0.3)",
  }}
><h2
  style={{
    textAlign: "center",
    color: "#ff8800",
    marginBottom: "20px",
  }}
>
  🎃 Registro de Disfraz
</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) =>
          setNombre(e.target.value)
        }
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
        }}
      />

      <input
        type="text"
        placeholder="Nombre del disfraz"
        value={disfraz}
        onChange={(e) =>
          setDisfraz(e.target.value)
        }
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
        }}
      />

      <select
        value={categoria}
        onChange={(e) =>
          setCategoria(e.target.value)
        }
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        <option value="Adultos">
          Adultos
        </option>

        <option value="Niños">
          Niños
        </option>
      </select>

      <input
        type="file"
        accept="image/*"
        onChange={cargarFoto}
      />

      {foto && (
        <img
          src={foto}
          alt="Preview"
          style={{
            width: "300px",
            marginTop: "15px",
            borderRadius: "10px",
          }}
        />
      )}

      <br />

      <button
        onClick={registrar}
        style={{
          marginTop: "15px",
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
  );
}

function ListadoParticipantes({
  titulo,
  participantes,
  cargarParticipantes,
  mostrarVotos,
  votacionAbierta,
}) {    
    const [empleado, setEmpleado] = useState("");

  return (
    <div>
<h2
  style={{
    textAlign: "center",
    color: "#ff8800",
    marginBottom: "20px",
  }}
>
  {titulo}
</h2>

      <input
        type="text"
        placeholder="Número de empleado"
        value={empleado}
        onChange={(e) => setEmpleado(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "none",
        }}
      />

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
    width: "250px",
    height: "250px",
    objectFit: "cover",
    borderRadius: "10px",
    display: "block",
    margin: "0 auto 15px auto",
  }}
/>

<h3
  style={{
    textAlign: "center",
    color: "white",
  }}
>
  🎭 {p.disfraz}
</h3>

<p
  style={{
    textAlign: "center",
    fontWeight: "bold",
  }}
>
  {p.nombre}
</p>

{mostrarVotos && (
  <p
    style={{
      textAlign: "center",
    }}
  >
    🦇 Votos: {p.votos || 0}
  </p>
)}          <div
            style={{
              textAlign: "center",
            }}
          >
<button
  onClick={async () => {
if (!votacionAbierta) {  alert(
    "🎃 Las votaciones han finalizado."
  );
  return;
}
    if (!empleado) {
      alert(
        "Ingresa tu número de empleado."
      );
      return;
    }

    try {

      const empleadoValido = query(
        collection(db, "empleados"),
        where(
          "empleado",
          "==",
          empleado
        )
      );

      const empleadoEncontrado =
        await getDocs(
          empleadoValido
        );

      if (
        empleadoEncontrado.empty
      ) {
        alert(
          "❌ Número de empleado no válido."
        );
        return;
      }

      const categoria =
        titulo.includes(
          "Adultos"
        )
          ? "Adultos"
          : "Niños";

      const votoExistente =
        query(
          collection(
            db,
            "votos"
          ),
          where(
            "empleado",
            "==",
            empleado
          ),
          where(
            "categoria",
            "==",
            categoria
          )
        );

      const resultadoVoto =
        await getDocs(
          votoExistente
        );

      if (
        !resultadoVoto.empty
      ) {
        alert(
          "❌ Ya registraste tu voto en esta categoría."
        );
        return;
      }

      await addDoc(
        collection(
          db,
          "votos"
        ),
        {
          empleado,
          categoria,
          participanteId:
            p.id,
          fecha:
            new Date(),
        }
      );

      await updateDoc(
        doc(
          db,
          "participantes",
          p.id
        ),
        {
          votos:
            (p.votos || 0) +
            1,
        }
      );

      alert(
        "✅ Voto registrado correctamente."
      );

await cargarParticipantes();
    } catch (error) {

      console.error(error);

      alert(
        "❌ Error al registrar el voto."
      );
    }
  }}              style={{
                background: "#16a34a",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              🗳️ Votar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Resultados({
  adultos,
  ninos,
}) {
const rankingAdultos = [...adultos]
  .sort(
    (a, b) =>
      (b.votos || 0) - (a.votos || 0)
  )
  .slice(0, 10);
const rankingNinos = [...ninos]
  .sort(
    (a, b) =>
      (b.votos || 0) - (a.votos || 0)
  )
  .slice(0, 10);
  return (
    <div>
<div
  style={{
    background: "rgba(255,136,0,0.15)",
    padding: "20px",
    borderRadius: "15px",
    border: "2px solid #ff8800",
    boxShadow: "0 0 20px rgba(255,136,0,0.3)",
  }}
><h2
  style={{
    textAlign: "center",
    color: "#ff8800",
  }}
>
  👨 Top 3 Adultos
</h2>
        {rankingAdultos.map((p, index) => (
          <div
            key={p.id}
            style={{
              textAlign: "center",
              marginBottom: "20px",
              padding: "15px",
              borderRadius: "10px",
              background:
                index === 0
                  ? "rgba(255,215,0,0.15)"
                  : index === 1
                  ? "rgba(192,192,192,0.15)"
                  : "rgba(205,127,50,0.15)",
            }}
          >
<h1
  style={{
    color: "#ff8800",
    fontSize: "60px",
    marginBottom: "30px",
  }}
>
  {index === 0
    ? "🥇"
    : index === 1
    ? "🥈"
    : index === 2
    ? "🥉"
    : `#${index + 1}`}
</h1>

            {p.foto && (
              <img
                src={p.foto}
                alt={p.disfraz}
                style={{
                  width: "180px",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  display: "block",
                  margin: "0 auto 10px auto",
                }}
              />
            )}

            <h3>{p.disfraz}</h3>

            <p>{p.nombre}</p>

            <strong>
              🦇 {p.votos || 0} votos
            </strong>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "rgba(0,0,0,0.5)",
          padding: "20px",
          borderRadius: "15px",
        }}
      >
<h2
  style={{
    textAlign: "center",
    color: "#ff8800",
  }}
>
  🧒 Top 3 Niños
</h2>
        {rankingNinos.map((p, index) => (
          <div
            key={p.id}
            style={{
              textAlign: "center",
              marginBottom: "20px",
              padding: "15px",
              borderRadius: "10px",
              background:
                index === 0
                  ? "rgba(255,215,0,0.15)"
                  : index === 1
                  ? "rgba(192,192,192,0.15)"
                  : "rgba(205,127,50,0.15)",
            }}
          >
            <h1>
              {index === 0
                ? "🥇"
                : index === 1
                ? "🥈"
                : "🥉"}
            </h1>

            {p.foto && (
              <img
                src={p.foto}
                alt={p.disfraz}
                style={{
                  width: "180px",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  display: "block",
                  margin: "0 auto 10px auto",
                }}
              />
            )}

            <h3>{p.disfraz}</h3>

            <p>{p.nombre}</p>

            <strong>
              🦇 {p.votos || 0} votos
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}