import { useEffect, useState } from "react";
import { shortToneSeconds, longToneSeconds, CustomButton } from "./Params";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import example from "./assets/musics/English.mp3";

/**
 * seconds 秒間、frequency Hz の音を鳴らす
 * @param {number} seconds 秒数
 * @param {number} frequency 周波数
 */
async function generateTone(seconds: number, frequency: number) {
  const audioCtx = new window.AudioContext();
  const osc = audioCtx.createOscillator();
  osc.type = "square";
  osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
  osc.connect(audioCtx.destination);
  osc.start();
  await new Promise((resolve) => {
    setTimeout(() => {
      osc.stop();
      osc.disconnect(audioCtx.destination);
      resolve(null);
    }, seconds * 1000);
  });
}

/**
 * 0.2 秒間、frequency Hz の音を鳴らす
 * @param {number} frequency 周波数
 */
export async function generateShortTone(frequency: number) {
  await generateTone(shortToneSeconds, frequency);
}

/**
 * 0.6 秒間、frequency Hz の音を鳴らす
 * @param {number} frequency 周波数
 */
export async function generateLongTone(frequency: number) {
  await generateTone(longToneSeconds, frequency);
}

interface PlaySoundProps {
  value: string;
  seconds?: number;
  frequency: number;
  className?: string;
  showIcon?: boolean;
}

interface PlayMusicProps {
  value: string;
}

/**
 * @param {string} value ボタンに表示する文字列
 * @param {number} seconds 鳴らす音の秒数
 * @param {number} frequency 鳴らす音の周波数
 */
export function PlaySoundForFixedTime({
  value,
  seconds,
  frequency,
}: PlaySoundProps) {
  if (!seconds) return null;

  const handleMousedown = (_: React.MouseEvent<HTMLButtonElement>) => {
    generateTone(seconds, frequency);
  };
  return (
    <button className="play__btn" onClick={handleMousedown}>
      ▶️ {value}
    </button>
  );
}

/**
 * ボタンを押している間だけ音を鳴らす
 * @param {string} value ボタンに表示する文字列
 * @param {number} frequency 鳴らす音の周波数
 */
export function PlaySoundForFreeTime({
  value,
  frequency,
  className,
  showIcon = true,
}: PlaySoundProps) {
  const [audioCtx, setAudioCtx] = useState<null | AudioContext>(null);
  const [oscillator, setOscillator] = useState<OscillatorNode | null>(null);
  const [status, setStatus] = useState(false);
  const [touchCount, setTouchCount] = useState(0);

  const startOscillator = () => {
    if (!audioCtx) {
      setAudioCtx(new window.AudioContext());
    }

    // すでに音が鳴っているときは何もしない
    console.log("start oscillator");

    if (!status && audioCtx) {
      const osc = audioCtx.createOscillator();
      osc.type = "square";
      osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      osc.connect(audioCtx.destination);
      osc.start();
      setOscillator(osc);
      setStatus(true);
    }
    setTouchCount((prev) => prev + 1);
  };

  const stopOscillator = () => {
    setTouchCount((prev) => prev - 1);
    if (oscillator && touchCount <= 1 && audioCtx) {
      oscillator.stop();
      oscillator.disconnect(audioCtx.destination);
      setOscillator(null);
      setStatus(false);
    }
  };

  return (
    <CustomButton
      variant="outlined"
      startIcon={showIcon ? status ? <StopIcon /> : <PlayArrowIcon /> : null}
      className={`play__btn ${className}`}
      onMouseDown={startOscillator}
      onMouseUp={stopOscillator}
      onMouseLeave={stopOscillator}
      onTouchStart={startOscillator}
      onTouchEnd={stopOscillator}
      fullWidth
    >
      {value}
    </CustomButton>
  );
}

/**
 * ボタンを押している間だけ音を鳴らす
 * @param {string} value ボタンに表示する文字列
 * @param {number} frequency 鳴らす音の周波数
 */
export function PlaySoundForFreeTimeWithSimpleButton({
  value,
  frequency,
  className,
}: PlaySoundProps) {
  const [audioCtx, setAudioCtx] = useState<null | AudioContext>(null);
  const [oscillator, setOscillator] = useState<OscillatorNode | null>(null);
  const [status, setStatus] = useState(false);
  const [touchCount, setTouchCount] = useState(0);

  const startOscillator = () => {
    if (!audioCtx) {
      setAudioCtx(new window.AudioContext());
    }
    console.log("start oscillator");
    // すでに音が鳴っているときは何もしない
    if (!status && audioCtx) {
      const osc = audioCtx.createOscillator();
      osc.type = "square";
      osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      osc.connect(audioCtx.destination);
      osc.start();
      setOscillator(osc);
      setStatus(true);
    }
    setTouchCount((prev) => prev + 1);
  };

  const stopOscillator = () => {
    setTouchCount((prev) => prev - 1);
    if (oscillator && touchCount <= 1 && audioCtx) {
      oscillator.stop();
      oscillator.disconnect(audioCtx.destination);
      setOscillator(null);
      setStatus(false);
    }
  };

  return (
    <button
      className={`play__btn ${className}`}
      onMouseDown={startOscillator}
      onMouseUp={stopOscillator}
      onMouseLeave={stopOscillator}
      onTouchStart={startOscillator}
      onTouchEnd={stopOscillator}
      style={{ border: "none" }}
    >
      {value}
    </button>
  );
}

/**
/**リスニング音声を流す
 * @param {string} value ボタンに表示する文字列
 */
const audio1 = new Audio(example);
export function PlaySoundMusic({ value }: PlayMusicProps) {
  const [status, setStatus] = useState(false);

  useEffect(() => {
    return () => {
      console.log("playsoundmusic unmouted");
      audio1.pause();
      audio1.currentTime = 0;
    };
  }, []);

  const music = (_: React.MouseEvent<HTMLButtonElement>) => {
    if (status) {
      audio1.pause();
      setStatus(false);
    } else {
      audio1.play();
      setStatus(true);
    }
  };
  return (
    <CustomButton
      variant="outlined"
      startIcon={status ? <StopIcon /> : <PlayArrowIcon />}
      className="play__btn"
      onClick={music}
      fullWidth
    >
      {value}
    </CustomButton>
  );
}

/**
 * ボタンを押すとノイズを出し、再度押すと止まる
 * @param {string} value ボタンに表示する文字列
 * @param {number} frequency 鳴らす音の周波数
 */
export function PlaySoundNoise({ value, frequency }: PlaySoundProps) {
  const [audioCtx] = useState(new window.AudioContext());
  const [oscillator, setOscillator] = useState<OscillatorNode | null>(null);
  const [status, setStatus] = useState(false);

  const noise = (_: React.MouseEvent<HTMLButtonElement>) => {
    const osc = audioCtx.createOscillator();
    if (!status) {
      osc.type = "square";
      osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      osc.connect(audioCtx.destination);
      osc.start();
      setOscillator(osc);
      setStatus(true);
    } else if (oscillator) {
      oscillator.stop();
      oscillator.disconnect(audioCtx.destination);
      setOscillator(null);
      setStatus(false);
    }
  };

  return (
    <CustomButton
      variant="outlined"
      startIcon={status ? <StopIcon /> : <PlayArrowIcon />}
      className="play__btn"
      onClick={noise}
      fullWidth
    >
      {value}
    </CustomButton>
  );
}

/**
 * ボタンを押すとノイズを出し、再度押すと止まる
 * @param {string} value ボタンに表示する文字列
 * @param {number} frequency 鳴らす音の周波数
 */
export function PlaySoundNoiseWithSimpleButton({
  value,
  frequency,
  className,
}: PlaySoundProps) {
  const [audioCtx] = useState(new window.AudioContext());
  const [oscillator, setOscillator] = useState<OscillatorNode | null>(null);
  const [status, setStatus] = useState(false);

  const noise = (_: React.MouseEvent<HTMLButtonElement>) => {
    const osc = audioCtx.createOscillator();
    if (!status) {
      osc.type = "square";
      osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      osc.connect(audioCtx.destination);
      osc.start();
      setOscillator(osc);
      setStatus(true);
    } else if (oscillator) {
      oscillator.stop();
      oscillator.disconnect(audioCtx.destination);
      setOscillator(null);
      setStatus(false);
    }
  };

  return (
    <button
      className={`play__btn ${className}`}
      onClick={noise}
      style={{ border: "none" }}
    >
      {value}
    </button>
  );
}
