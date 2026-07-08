import { useEffect, useState } from "react";

type IncomeItem = {
  income_id: number;
  income_value: number;
  income_name: string;
  is_deleted: boolean;
};

export default function App() {
  const [income_value, setValue] = useState<number>(0);
  const [Income, setIncome] = useState<IncomeItem[]>([]);
  const [income_name, setName] = useState<string>("");
  // const [is_deleted, setBool] = useState<boolean>(false);

  const API = "http://127.0.0.1:8000";

  async function fetchIncome() {
    const res = await fetch(`${API}/datanumbers`);
    const data = await res.json();
    setIncome(data);
  }

  async function addNumber() {
    await fetch(`${API}/numbers?income_value=${income_value}`, {
      method: "POST",
    });

    setValue(0);
    fetchIncome();
  }

  async function delLRow() {
    await fetch(`${API}/dellrow?`, {
      method: "POST",
    });

    fetchIncome();
  }

  async function setDel() {
    await fetch(`${API}/setdelete?`, {
      method: "POST",
    });

    fetchIncome();
  }

  async function addName() {
    await fetch(`${API}/addName?income_name=${income_name}`, {
      method: "POST",
    });

    setName("");
    fetchIncome();
  }

  async function addNameandNum() {
    await fetch(`${API}/addNameandNum?income_name=${income_name}&income_value=${income_value}`, {
      method: "POST",
    })

    setValue(0);
    setName("");
    fetchIncome();
  }

  useEffect(() => {
    fetchIncome();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Finance Tracker</h1>

      <input
        type="string"
        value={income_name}
        onChange={(e) => setName(String(e.target.value))}
      />
      
      <button onClick={addName}>Add Name</button>

      <input
        type="number"
        value={income_value}
        onChange={(e) => setValue(Number(e.target.value))}
      />

      <button onClick={addNumber}>Add</button>
      <button onClick={addNameandNum}>Add Everything</button>

      <button onClick={delLRow}>Del LRow</button>
      <button onClick={setDel}>Delete</button>
      
      
      <h2>Income</h2>
      <ul>
        {Income.map((n) => (
          <li key={n.income_id}>
            {n.income_id}: {n.income_name}: {n.income_value}
          </li>
        ))}
      </ul>
    </div>
  );
}