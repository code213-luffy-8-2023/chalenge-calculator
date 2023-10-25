import { useState } from "react";
import "./App.css";
import CalcHeader from "./components/CalcHeader";
import { useEffect } from "react";
import { useRef } from "react";

// an array of all the buttons
const butons = [
  { text: "7", class: "number" },
  { text: "8", class: "number" },
  { text: "9", class: "number" },
  { text: "del", class: "del" },
  { text: "4", class: "number" },
  { text: "5", class: "number" },
  { text: "6", class: "number" },
  { text: "+", class: "plus" },
  { text: "1", class: "number" },
  { text: "2", class: "number" },
  { text: "3", class: "number" },
  { text: "-", class: "sub" },
  { text: ".", class: "dot" },
  { text: "0", class: "number" },
  { text: "/", class: "div" },
  { text: "x", class: "mul" },
  { text: "reset", class: "reset" },
  { text: "=", class: "equal" },
];
// an array of all the numbers (this will be used to check if the button clicked is a number)
const numbers = ["9", "8", "7", "6", "5", "4", "3", "2", "1", "0", "."];
// an array of all the operators (this will be used to check if the button clicked is an operator)
const operators = ["+", "-", "x", "/"];

// Helper function to calculate the result of the operation
function calc(prev, curr, operator) {
  switch (operator) {
    case "+":
      return prev + curr;
    case "-":
      return prev - curr;
    case "x":
      return prev * curr;
    case "/":
      return prev / curr;
    default:
      return 0;
  }
}

function App() {
  const [previousScreen, setPreviousScreen] = useState("0");
  const [screen, setScreen] = useState("0");
  const [lastOperator, setLastOperator] = useState(null);
  const [lastClickedWasOperator, setLastClickedWasOperator] = useState(false);

  // useRef returns a mutable ref object whose .current property is initialized to the passed argument (initialValue).
  // The returned object will persist for the full lifetime of the component.
  // unlick useState, useRef doesn't trigger a re-render when its value changes.
  // geenrally used to access the DOM element
  // see https://react.dev/reference/react/useRef
  const buttonsRef = useRef([]);

  useEffect(() => {
    const keyupHandler = (e) => {
      let key = e.key;

      // some keys need to be converted to match the button text
      if (key === "Enter") {
        key = "=";
      }
      if (key === "Backspace") {
        key = "del";
      }

      if (key === "Escape") {
        key = "reset";
      }

      if (key === "*") {
        key = "x";
      }
      const buttonRef = buttonsRef.current[key];

      if (buttonRef) {
        // click the button to trigger the onClick event
        buttonRef.click();
      }
    };

    window.addEventListener("keyup", keyupHandler);

    return () => {
      // cleanup
      window.removeEventListener("keyup", keyupHandler);
    };
  }, []);

  return (
    <div className="app">
      <CalcHeader />
      <div className="screen">{screen}</div>
      <div className="buttons">
        {butons.map((btn) => (
          <button
            ref={(el) => (buttonsRef.current[btn.text] = el)}
            onClick={() => {
              if (numbers.includes(btn.text)) {
                if (lastClickedWasOperator) {
                  setScreen(btn.text === "." ? "0." : btn.text);
                  setLastClickedWasOperator(false);
                } else {
                  setScreen(
                    screen === "0" && btn.text != "."
                      ? btn.text
                      : screen + btn.text
                  );
                }
              } else if (operators.includes(btn.text)) {
                if (
                  lastOperator &&
                  lastOperator !== "=" &&
                  lastClickedWasOperator
                ) {
                  setLastOperator(btn.text);
                } else if (lastOperator == null || lastOperator === "=") {
                  setLastClickedWasOperator(true);
                  setLastOperator(btn.text);
                  setPreviousScreen(screen);
                } else {
                  let prev = parseFloat(previousScreen);
                  let curr = parseFloat(screen);
                  let result = calc(prev, curr, lastOperator);

                  setLastOperator(btn.text);
                  setLastClickedWasOperator(true);
                  setPreviousScreen(result);
                  setScreen(result);
                }
              } else if (btn.text === "del") {
                if (!lastClickedWasOperator)
                  setScreen(screen.slice(0, -1) || "0");
              } else if (btn.text === "reset") {
                setScreen("0");
                setPreviousScreen("0");
                setLastOperator(null);
                setLastClickedWasOperator(false);
              } else if (btn.text === "=") {
                if (lastOperator == null || lastOperator === "=") {
                  setLastOperator("=");
                } else {
                  let prev = parseFloat(previousScreen);
                  let curr = parseFloat(screen);

                  const result = calc(prev, curr, lastOperator);
                  setScreen(result);
                  setLastOperator("=");
                  setLastClickedWasOperator(true);
                }
              }
            }}
            className={btn.class}
            key={btn.text}
          >
            {btn.text}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
