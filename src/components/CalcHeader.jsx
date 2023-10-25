import { useState } from "react";
import "./CalcHeader.css";
import { useRef } from "react";
import { useEffect } from "react";

const themes = ["dark", "light", "contrast"];

const CalcHeader = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    // check the user's preference and set the theme accordingly
    // this is done only once when the component is mounted
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    if (prefersDarkScheme.matches) {
      setActive(1);
    } else {
      setActive(2);
    }
  }, []);

  const divref = useRef(null);

  return (
    <header>
      <h1>calc</h1>
      <div className="theme-container">
        <span>Theme</span>
        <div className="toggle-container">
          <div className="toggle-numbers">
            <span>1</span>
            <span>2</span>
            <span>3</span>
          </div>
          <div
            ref={divref}
            onClick={(e) => {
              const divWidth = divref.current.offsetWidth;
              const clickX =
                e.clientX - divref.current.getBoundingClientRect().left;

              // select html element
              const html = document.querySelector("html");
              // add override and theme class
              html.classList.add("override");

              // remove all theme classes
              themes.forEach((theme) => {
                html.classList.remove(theme);
              });

              if (clickX < divWidth * 0.33) {
                // this is a click on the left side
                setActive(1);
                html.classList.add(themes[1 - 1]);
              } else if (clickX > divWidth * 0.66) {
                // this is a click on the right side
                setActive(3);
                html.classList.add(themes[3 - 1]);
              } else {
                // this is a click in the middle
                setActive(2);
                html.classList.add(themes[2 - 1]);
              }
            }}
            className="toggle"
          >
            <button className={"theme" + active}></button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CalcHeader;
