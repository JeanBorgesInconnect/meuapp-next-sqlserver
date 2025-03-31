import { useEffect, useState } from "react";

interface User {
    id: number;
    name: string;
    email: string;
}

export default function TestApiPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const env = process.env.NEXT_PUBLIC_APP_ENV || "unknown";

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/users");
            const contentType = res.headers.get("content-type");

            if (!res.ok || !contentType?.includes("application/json")) {
                console.error("Erro ao buscar usuários");
                setUsers([]);
                return;
            }

            const data = await res.json();

            if (Array.isArray(data)) {
                setUsers(data);
            } else {
                console.error("Resposta inesperada:", data);
                setUsers([]);
            }
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
            setUsers([]);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data?.error || "Erro ao criar usuário.");
            } else {
                setName("");
                setEmail("");
                fetchUsers();
            }
        } catch (err) {
            setError("Erro na requisição. Tente novamente.");
        }

        setLoading(false);
    };

    return (
        <div style={{ maxWidth: 500, margin: "0 auto", padding: 32 }}>
            <h1>👤 Cadastro de Usuários</h1>
            <p style={{ color: "#888", fontSize: 14 }}>Ambiente 7: {env}</p>

            <div style={{ marginBottom: 16 }}>
                <input
                    type="text"
                    placeholder="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={inputStyle}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                />
                <button onClick={handleCreateUser} disabled={loading} style={btnStyle}>
                    {loading ? "Salvando..." : "Salvar Usuário"}
                </button>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>

            <h2>📋 Lista de Usuários</h2>
            <ul style={{ padding: 0 }}>
                {Array.isArray(users) && users.length > 0 ? (
                    users.map((user) => (
                        <li
                            key={user.id}
                            style={{
                                listStyle: "none",
                                borderBottom: "1px solid #ddd",
                                padding: "8px 0",
                            }}
                        >
                            <strong>{user.name}</strong>
                            <br />
                            <span style={{ color: "#555" }}>{user.email}</span>
                        </li>
                    ))
                ) : (
                    <li style={{ color: "#aaa", listStyle: "none" }}>
                        Nenhum usuário encontrado.
                    </li>
                )}
            </ul>
        </div>
    );
}

const inputStyle = {
    display: "block",
    width: "100%",
    marginBottom: 8,
    padding: 8,
    borderRadius: 4,
    border: "1px solid #ccc",
};

const btnStyle = {
    width: "100%",
    padding: 10,
    backgroundColor: "#0070f3",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
};
