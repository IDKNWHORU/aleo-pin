import { Fragment, useRef, useState } from "react";
import baseball_program from "../baseball/build/main.aleo?raw";
import "./App.css";
import { AleoWorker } from "./workers/AleoWorker.js";

const aleoWorker = AleoWorker();
function App() {
  const [executing, setExecuting] = useState(false);
  const [target, setTarget] = useState("");
  const [life, setLife] = useState(0);
  const fieldRef = useRef();
  const [history, setHistory] = useState([]);
  const [finish, setFinish] = useState(false);
  const [value, setValue] = useState("");

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
    if (fieldRef.current.value.length !== 3) {
      alert("Put 3 Numbers");
      return;
    }

    setExecuting(true);
    const values = fieldRef.current.value
      .toString()
      .split("")
      .map((value) => `${value}u8`);

    const result = await aleoWorker.localProgramExecution(
      baseball_program,
      "main",
      [target, ...values]
    );

    setExecuting(false);

    const [strikes, balls] = JSON.parse(
      result[0].replaceAll("\n", "").replaceAll(" ", "").replaceAll("u8", "")
    );

    setHistory([
      ...history,
      { value: fieldRef.current.value, result: [strikes, balls] },
    ]);
    setValue("");

    if (strikes === 3) {
      alert("You Win!");
      setFinish(true);
      return;
    } else {
      setLife(life - 1);
      if (life - 1 === 0) {
        alert("Game Over!");
        setFinish(true);
      }
    }
  }

  const handleClickButton = (input) => {
    if (input === "BACK") {
      setValue(`${value.slice(0, -1)}`);
      return;
    } else if (input === "RESET") {
      setValue("");
      return;
    }

    if (value.length === 3) return;
    setValue(`${value}${input}`);
  };

  const resetGame = async () => {
    setFinish(false);
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
    setHistory([]);
  };

  return (
    <>
      {target.length > 0 ? (
        <>
          <div className="ingame">
            <div className="game">
              <h2 className="life">Your Life: {life}</h2>
              <h3>History</h3>
              <div className="history">
                <h4>INPUT</h4>
                <h4>RESULT</h4>
                {history.map((item) => (
                  <Fragment key={crypto.randomUUID()}>
                    <p>{item.value}</p>
                    <p>
                      {item.result[0]} strikes {item.result[1]} balls
                    </p>
                  </Fragment>
                ))}
              </div>
            </div>
            <div className="pad">
              <h2 className="label">NUMBER PAD</h2>
              <h3 className="advice">Enter 3 Numbers</h3>
              <input
                ref={fieldRef}
                type="number"
                name="value"
                id="value"
                defaultValue={value}
                readOnly
                disabled={executing || finish}
              />
              <div className="grid-3x3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => (
                  <button
                    type="button"
                    onClick={() => handleClickButton(value)}
                    disabled={executing || finish}
                    key={value}
                  >
                    {value}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleClickButton("BACK")}
                  disabled={executing || finish}
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => handleClickButton(0)}
                  disabled={executing || finish}
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={() => handleClickButton("RESET")}
                  disabled={executing || finish}
                >
                  R
                </button>
              </div>
              <button
                className="submit"
                type="button"
                disabled={executing}
                onClick={() => {
                  finish ? resetGame() : submit();
                }}
              >
                {finish ? "Restart" : executing ? "Executing..." : "SUBMIT"}
              </button>
            </div>
          </div>
          <div className="game-background" />
          <dialog>asdf</dialog>
        </>
      ) : (
        <>
          <div className="intro">
            <p>Baseball Game</p>
            <button disabled={executing} onClick={startGame}>
              {executing ? `Starting...` : `Start`}
            </button>
          </div>
          <div className="intro-background" />
        </>
      )}
    </>
  );
}

export default App;
