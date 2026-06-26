import { useEffect, useState } from "react";

type NumberItem = {
  id: number;
  value: number;
};

export default function App() {
  const [value, setValue] = useState<number>(0);
  const [numbers, setNumbers] = useState<NumberItem[]>([]);

  const API = "http://127.0.0.1:8000";

  async function fetchNumbers() {
    const res = await fetch(`${API}/numbers`);
    const data = await res.json();
    setNumbers(data);
  }

  async function addNumber() {
    await fetch(`${API}/numbers?value=${value}`, {
      method: "POST",
    });

    setValue(0);
    fetchNumbers();
  }

  useEffect(() => {
    fetchNumbers();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Number Tracker</h1>

      <input
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />

      <button onClick={addNumber}>Add</button>

      <h2>Stored Numbers</h2>
      <ul>
        {numbers.map((n) => (
          <li key={n.id}>
            {n.id}: {n.value}
          </li>
        ))}
      </ul>
    </div>
  );
}