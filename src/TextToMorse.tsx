import { generateShortTone, generateLongTone } from "./PlaySound";
import {
  CustomButton,
  frequency,
  spaceBetweenCharsMilliseconds,
} from "./Params";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import axios from "axios";
import { useEffect, useRef } from "react";

interface CharToMorseProps {
  char: string;
}

// 0:短音, 1:長音, -:文字間の間隔をあける
const morse: { [key: string]: string } = {
  a: "01",
  b: "1000",
  c: "1010",
  d: "100",
  e: "0",
  f: "0010",
  g: "110",
  h: "0000",
  i: "00",
  j: "0111",
  k: "101",
  l: "0100",
  m: "11",
  n: "10",
  o: "111",
  p: "0110",
  q: "1101",
  r: "010",
  s: "000",
  t: "1",
  u: "001",
  v: "0001",
  w: "011",
  x: "1001",
  y: "1011",
  z: "1100",
  あ: "11011",
  い: "01",
  う: "001",
  え: "10111",
  お: "01000",
  か: "0100",
  き: "10100",
  く: "0001",
  け: "1011",
  こ: "1111",
  さ: "10101",
  し: "11010",
  す: "11101",
  せ: "01110",
  そ: "1110",
  た: "10",
  ち: "0010",
  つ: "0110",
  て: "01011",
  と: "00100",
  な: "010",
  に: "1010",
  ぬ: "0000",
  ね: "1101",
  の: "0011",
  は: "1000",
  ひ: "11001",
  ふ: "1100",
  へ: "0",
  ほ: "100",
  ま: "1001",
  み: "00101",
  む: "1",
  め: "10001",
  も: "10010",
  や: "011",
  ゆ: "10011",
  よ: "11",
  ら: "000",
  り: "110",
  る: "10110",
  れ: "111",
  ろ: "0101",
  わ: "101",
  を: "0111",
  ん: "01010",
  ア: "11011",
  イ: "01",
  ウ: "001",
  エ: "10111",
  オ: "01000",
  カ: "0100",
  キ: "10100",
  ク: "0001",
  ケ: "1011",
  コ: "1111",
  サ: "10101",
  シ: "11010",
  ス: "11101",
  セ: "01110",
  ソ: "1110",
  タ: "10",
  チ: "0010",
  ツ: "0110",
  テ: "01011",
  ト: "00100",
  ナ: "010",
  ニ: "1010",
  ヌ: "0000",
  ネ: "1101",
  ノ: "0011",
  ハ: "1000",
  ヒ: "11001",
  フ: "1100",
  ヘ: "0",
  ホ: "100",
  マ: "1001",
  ミ: "00101",
  ム: "1",
  メ: "10001",
  モ: "10010",
  ヤ: "011",
  ユ: "10011",
  ヨ: "11",
  ラ: "000",
  リ: "110",
  ル: "10110",
  レ: "111",
  ロ: "0101",
  ワ: "101",
  ヲ: "0111",
  ン: "01010",
  が: "0100-00",
  ぎ: "10100-00",
  ぐ: "0001-00",
  げ: "1011-00",
  ご: "1111-00",
  ざ: "10101-00",
  じ: "11010-00",
  ず: "11101-00",
  ぜ: "01110-00",
  ぞ: "1110-00",
  だ: "10-00",
  ぢ: "0010-00",
  づ: "0110-00",
  で: "01011-00",
  ど: "00100-00",
  ば: "1000-00",
  び: "11001-00",
  ぶ: "1100-00",
  べ: "0-00",
  ぼ: "100-00",
  ガ: "0100-00",
  ギ: "10100-00",
  グ: "0001-00",
  ゲ: "1011-00",
  ゴ: "1111-00",
  ザ: "10101-00",
  ジ: "11010-00",
  ズ: "11101-00",
  ゼ: "01110-00",
  ゾ: "1110-00",
  ダ: "10-00",
  ヂ: "0010-00",
  ヅ: "0110-00",
  デ: "01011-00",
  ド: "00100-00",
  バ: "1000-00",
  ビ: "11001-00",
  ブ: "1100-00",
  ベ: "0-00",
  ボ: "100-00",
  ぱ: "1000-00110",
  ぴ: "11001-00110",
  ぷ: "1100-00110",
  ぺ: "0-00110",
  ぽ: "100-00110",
  パ: "1000-00110",
  ピ: "11001-00110",
  プ: "1100-00110",
  ペ: "0-00110",
  ポ: "100-00110",
  ゃ: "011",
  ゅ: "10011",
  ょ: "11",
  ャ: "011",
  ュ: "10011",
  ョ: "11",
  っ: "0110",
  ッ: "0110",
  1: "01111",
  2: "00111",
  3: "00011",
  4: "00001",
  5: "00000",
  6: "10000",
  7: "11000",
  8: "11100",
  9: "11110",
  0: "11111",
  ー: "01101",
};

/**
 * number ミリ秒間待つ
 * @param ms 待つ時間（ミリ秒）
 */
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 1文字をモールス信号に変換して再生する
 * @param {CharToMorseProps} char 変換する文字
 */
async function CharToMorse({ char }: CharToMorseProps) {
  if (!(char in morse)) return;

  for (let i = 0; i < morse[char].length; i++) {
    if (morse[char].charAt(i) === "0") {
      await generateShortTone(frequency);
    } else if (morse[char].charAt(i) === "1") {
      await generateLongTone(frequency);
    }
    await sleep(spaceBetweenCharsMilliseconds);
  }
}

type TextToMorseProps = {
  text: string;
  value: string;
};

const APIKEY = import.meta.env.VITE_HIRAGANA_API_KEY;

/**
 * 文章をモールス信号に変換して再生するコンポーネントを返す
 * @param {TextToMorseProps} text 文章
 * @param {TextToMorseProps} value ボタンに表示する文字列
 */
export function TextToMorse({ text, value }: TextToMorseProps) {
  const isMounted = useRef(true);
  const isAbleToPlay = useRef(true);

  useEffect(() => {
    return () => {
      if (!isAbleToPlay.current) {
        isMounted.current = false;
      } else {
        isAbleToPlay.current = false;
      }
    };
  }, []);

  const handleMousedown = async (_: React.MouseEvent<HTMLButtonElement>) => {
    const textArray: string[] = [];

    let start = 0;
    for (let i = 0; i < text.length; i++) {
      if (text.charAt(i).match(/[a-zA-Z]/)) {
        if (i != 0 && !text.charAt(i - 1).match(/[a-zA-Z]/)) {
          textArray.push(text.slice(start, i));
          start = i;
        }
        if (i != text.length - 1 && !text.charAt(i + 1).match(/[a-zA-Z]/)) {
          textArray.push(text.slice(start, i + 1));
          start = i + 1;
        }
      }
      if (i === text.length - 1) {
        textArray.push(text.slice(start, i + 1));
      }
    }

    const convertedTextArray = await Promise.all(
      textArray.map(async (v) => {
        if (v.match(/^[a-zA-Z0-9]+$/)) {
          return v;
        }
        try {
          const res = await axios.post("https://labs.goo.ne.jp/api/hiragana", {
            app_id: APIKEY,
            sentence: v,
            output_type: "hiragana",
          });
          return res.data.converted.replace(/\s+/g, "");
        } catch (error: any) {
          if (error.response) {
            console.log("Error data:", error.response.data);
          } else {
            console.log("Error:", error.message);
          }
        }
      })
    );

    for (const char of convertedTextArray.join("")) {
      if (!isMounted.current) {
        break;
      }
      await CharToMorse({ char });
    }
  };

  return (
    <CustomButton
      variant="outlined"
      startIcon={<PlayArrowIcon />}
      className="play__btn"
      onClick={handleMousedown}
      fullWidth
    >
      {value}
    </CustomButton>
  );
}
