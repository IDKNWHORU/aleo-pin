import { useRef, useState } from "react";
import baseball_program from "../baseball/build/main.aleo?raw";
import "./App.css";
import { AleoWorker } from "./workers/AleoWorker.js";

const aleoWorker = AleoWorker();
function App() {
  const [executing, setExecuting] = useState(false);
  const [target, setTarget] = useState("");
  const [life, setLife] = useState(0);
  const fieldRef = useRef();

  const createRandom = (acc) => {
    const value = parseInt((Math.random() * 10) % 10);

    if (acc.includes(value)) return createRandom(acc);

    return [...acc, value];
  };

  async function startGame() {
    setExecuting(true);

    const randomList = [1, 2, 3]
      .reduce((acc) => {
        return createRandom(acc);
      }, [])
      .map((value) => `${value}u8`);

    const result = await aleoWorker.localProgramExecution(
      baseball_program,
      "init",
      randomList
    );
    setExecuting(false);

    setTarget(result[0].replaceAll("\n", "").replaceAll(" ", ""));
    setLife(9);
  }

  async function submit() {
    const values = fieldRef.current.value
      .toString()
      .split("")
      .map((value) => `${value}u8`);

    console.log(target);

    const result = await aleoWorker.localProgramExecution(
      baseball_program,
      "main",
      [target, ...values]
    );

    const [strikes, balls] = JSON.parse(
      result[0].replaceAll("\n", "").replaceAll(" ", "").replaceAll("u8", "")
    );

    console.log(strikes);
    if (strikes === 3) return;

    setLife(life - 1);
  }

  return (
    <>
      {target.length > 0 ? (
        <>
          <h3>Let's go!</h3>
          <input ref={fieldRef} type="number" name="value" id="value" />
          <button type="button" onClick={submit}>
            submit
          </button>
        </>
      ) : (
        <>
          <h1>Base Ball Game</h1>
          <div className="card">
            <p>
              <button disabled={executing} onClick={startGame}>
                {executing ? `Starting...` : `Start Game`}
              </button>
            </p>
          </div>
        </>
      )}
    </>
  );
}

export default App;
