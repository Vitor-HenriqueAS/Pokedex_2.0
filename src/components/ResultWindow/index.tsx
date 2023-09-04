import React from "react";
import styles from './ResultWindow.module.css';

interface ResultWindowProps {
  result: boolean;
  resultNameWin: string;
  onButtonClick: (valueBtn: string) => void;
}

const ResultWindow: React.FC<ResultWindowProps> = ({ result, resultNameWin, onButtonClick }) => {
  
  const onButtonClickBack = () => {
    onButtonClick('voltar');
  };

  const onButtonClickContinue = () => {
    onButtonClick('continuar');
  };

  const onButtonClickRestart = () => {
    onButtonClick('restart');
  };
  
  return (
      <div className={styles.result_window}>
        <h2 className={styles.result__title}>
          {result ? "VOCÊ ACERTOU !" : "VOCÊ ERROU !"}
        </h2>
        <h3 className={styles.result__subtitle}>
          Sua escolha foi : {resultNameWin}, 
          {result ? "e acertou, parabéns futuro(a) mestre(a) Pokémon !" : 
          "e está errado tenha mais conhecimento com a Pokédex !"}
          
          
        </h3>

        <div className={styles.result__buttons}>
          <button type="button" onClick={onButtonClickBack}>
            Voltar
          </button>

          {result ? 
            <button type="button" onClick={onButtonClickContinue}>Continuar</button>
            : 
            <button type="button" onClick={onButtonClickRestart}>Tentar Novamente</button>
          }
        </div>
      </div>
  )
}

export default ResultWindow;