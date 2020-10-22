import React from "react";
import logo from "./logo.svg";
import "./App.css";

import HtmlTextEditor from "./components/HtmlTextEditor";

function App() {
  return (
    <div className="App">
      <pre>Simple Html text editor</pre>
      <HtmlTextEditor />
      <div>
        <pre>
          ctrl + B = Bold, ctrl + i = Italic, ctrl + u = Underline, ctrl + ` =
          Code
        </pre>
      </div>
    </div>
  );
}

export default App;
