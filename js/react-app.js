// js/react-app.js
import React, { useEffect, useState } from "https://esm.sh/react@18";
import ReactDOM from "https://esm.sh/react-dom@18/client";

function Directory({ items }) {
  return (
    <ul className="directory">
      {items.map(item => (
        <li key={item.path}>
          <span className="icon">{item.isDir ? "📁" : "📄"}</span>
          {item.isDir ? (
            <details>
              <summary>{item.name}</summary>
              <Directory items={item.children} />
            </details>
          ) : (
            <a href={item.path} download>{item.name}</a>
          )}
        </li>
      ))}
    </ul>
  );
}

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("directory.json")
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error("Error loading directory:", err));
  }, []);

  return (
    <div className="app">
      <h1>📂 Directory Listing</h1>
      {data.length ? <Directory items={data} /> : <p>Loading...</p>}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
