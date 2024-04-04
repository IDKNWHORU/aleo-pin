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
    setExecuting(true);
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

    setExecuting(false);

    const [strikes, balls] = JSON.parse(
      result[0].replaceAll("\n", "").replaceAll(" ", "").replaceAll("u8", "")
    );

    if (strikes === 3) {
      alert("You Win!");
    } else {
      alert(`${strikes} strikes, ${balls} balls`);
    }

    setLife(life - 1);
    setHistory([
      ...history,
      { value: fieldRef.current.value, result: [strikes, balls] },
    ]);
    setValue("");

    if (life - 1 === 0 || strikes === 3) setFinish(true);
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

  return (
    <>
      {target.length > 0 ? (
        <>
          <div className="game">
            <h2>Your Life: {life}</h2>
            <h3>History</h3>
            <div className="history">
              <h4>INPUT</h4>
              <h4>RESULT</h4>
              {history.map((item) => (
                <Fragment key={crypto.randomUUID()}>
                  <p>{item.value}</p>
                  <p>
                    {item.result[0]}strikes {item.result[1]} balls
                  </p>
                </Fragment>
              ))}
            </div>
          </div>
          <div className="pad">
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
              <button
                type="button"
                onClick={() => handleClickButton(1)}
                disabled={executing || finish}
              >
                1
              </button>
              <button
                type="button"
                onClick={() => handleClickButton(2)}
                disabled={executing || finish}
              >
                2
              </button>
              <button
                type="button"
                onClick={() => handleClickButton(3)}
                disabled={executing || finish}
              >
                3
              </button>
              <button
                type="button"
                onClick={() => handleClickButton(4)}
                disabled={executing || finish}
              >
                4
              </button>
              <button
                type="button"
                onClick={() => handleClickButton(5)}
                disabled={executing || finish}
              >
                5
              </button>
              <button
                type="button"
                onClick={() => handleClickButton(6)}
                disabled={executing || finish}
              >
                6
              </button>
              <button
                type="button"
                onClick={() => handleClickButton(7)}
                disabled={executing || finish}
              >
                7
              </button>
              <button
                type="button"
                onClick={() => handleClickButton(8)}
                disabled={executing || finish}
              >
                8
              </button>
              <button
                type="button"
                onClick={() => handleClickButton(9)}
                disabled={executing || finish}
              >
                9
              </button>
              <button
                type="button"
                onClick={() => handleClickButton("BACK")}
                disabled={executing || finish}
              >
                &#8592;
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
              disabled={executing || finish}
              onClick={submit}
            >
              {finish ? "Finish" : executing ? "checking..." : "SUBMIT"}
            </button>
          </div>
        </>
      ) : (
        <>
          <h1 className="intro">Aleo Base Ball Game</h1>
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
