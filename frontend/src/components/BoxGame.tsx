import React, { useState } from "react";
import treasureImg from "../assets/tesoro.png";
import pirateImg from "../assets/bandera-pirata.png";
import {
  MiniKit,
  tokenToDecimals,
  Tokens,
  PayCommandInput,
} from "@worldcoin/minikit-js";

const BoxGame: React.FC = () => {
  // Estados principales
  const [betAmount, setBetAmount] = useState<number>(0);
  const [coinIndex, setCoinIndex] = useState<number>(-1);
  const [attempts, setAttempts] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [showGame, setShowGame] = useState<boolean>(false);
  const [revealed, setRevealed] = useState<boolean[]>(Array(9).fill(false));

  const maxAttempts = 3;
  const bets = [0.1, 0.2, 0.5, 2, 5, 10];

  const startGame = (selectedBet: number) => {
    setBetAmount(selectedBet);
    setShowGame(true);
    setAttempts(0);
    setCoinIndex(Math.floor(Math.random() * 9));
    setMessage("");
    setRevealed(Array(9).fill(false));
  };

  const handleCubeClick = (index: number) => {
    if (attempts >= maxAttempts || revealed[index]) return;

    setAttempts((prev) => prev + 1);
    setRevealed((prevState) => {
      const newState = [...prevState];
      newState[index] = true;
      return newState;
    });

    if (index === coinIndex) {
      setMessage("¡Felicidades! Encontraste el Cofre.");
      endGame(true);
    } else {
      if (attempts + 1 >= maxAttempts) {
        setMessage("No encontraste el cofre. Has perdido tu apuesta.");
        endGame(false);
      }
    }
  };

  const endGame = (win: boolean) => {
    setAttempts(maxAttempts);
    if (win) {
      processWinTransaction();
    } else {
      processLossTransaction();
    }
  };

  // En caso de victoria, simplemente mostramos el pago en consola (se puede ajustar según la lógica de World)
  const processWinTransaction = async () => {
    const totalPayout = betAmount * 2;
    console.log("GANASTE, se paga:", totalPayout, "WLD");
    // Aquí podrías implementar la transacción de victoria si la API lo requiere,
    // pero normalmente se paga al usuario sin que tú especifiques 'to'.
  };

  // Transacción de derrota: se envía la apuesta a tu wallet usando el comando pay
  const processLossTransaction = async () => {
    try {
      const amountInDecimals = tokenToDecimals(betAmount, Tokens.WLD).toString();

      const payload: PayCommandInput = {
        reference: `loss-${Date.now()}`,
        to: "0x9c6178d44d3d48d9b395100e04ae76c9d20738e0", // Tu dirección de wallet
        tokens: [
          {
            symbol: Tokens.WLD,
            token_amount: amountInDecimals,
          },
        ],
        description: "Apuesta perdida en BoxGame",
      };

      const result = await MiniKit.commandsAsync.pay(payload);

      if (result?.finalPayload?.status === "success") {
        console.log("Transacción de derrota exitosa");
      } else {
        console.log("Transacción fallida o cancelada");
      }
    } catch (err) {
      console.error("Error en transacción de derrota", err);
    }
  };

  const resetGame = () => {
    setBetAmount(0);
    setShowGame(false);
    setMessage("");
    setAttempts(0);
    setCoinIndex(-1);
    setRevealed(Array(9).fill(false));
  };

  const renderCubes = () => {
    const cubes = [];
    for (let i = 0; i < 9; i++) {
      const isRevealed = revealed[i];
      const isCoin = i === coinIndex;

      cubes.push(
        <div
          key={i}
          onClick={() => handleCubeClick(i)}
          className={`
            w-16 h-16 m-1
            flex items-center justify-center
            cursor-pointer
            border border-gray-400
            transition-transform duration-300
            hover:scale-105
            ${isRevealed ? "bg-white" : "bg-gray-300"}
          `}
        >
          {isRevealed &&
            (isCoin ? (
              <img src={treasureImg} alt="Tesoro" className="w-10 h-10" />
            ) : (
              <img src={pirateImg} alt="Pirata" className="w-10 h-10" />
            ))}
        </div>
      );
    }
    return <div className="flex flex-wrap w-64 mx-auto">{cubes}</div>;
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Box Game</h2>
      {!showGame ? (
        <div>
          <p className="mb-2">Selecciona tu apuesta:</p>
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
            {bets.map((bet) => (
              <button
                key={bet}
                onClick={() => startGame(bet)}
                className="bg-blue-500 text-white font-bold px-4 py-2 rounded hover:bg-blue-600"
              >
                {bet} WLD
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <p className="mb-2">Tienes {maxAttempts} intentos para encontrar el cofre.</p>
          <div className="mb-2">Apuesta seleccionada: {betAmount} WLD</div>
          {renderCubes()}
        </div>
      )}
      {message && <p className="mt-4">{message}</p>}
      {(attempts >= maxAttempts || message.includes("¡Felicidades!")) && showGame && (
        <button
          onClick={resetGame}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mt-4"
        >
          Volver
        </button>
      )}
    </div>
  );
};

export default BoxGame;
