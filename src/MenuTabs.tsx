import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Footer from "./Footer";
import { useState } from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

type ModeProps = {
  subMode: string;
  onClick: any;
  text?: string;
  onChangeTextField?: any;
};
const NormalMode = ({
  subMode,
  onClick,
  text,
  onChangeTextField
}: ModeProps) => {
  return (
    <>
      <FormControl fullWidth sx={{ mb: 10 }}>
        <FormLabel id="normal-mode-radio-buttons-group-label">
          通信モード
        </FormLabel>
        <RadioGroup
          aria-labelledby="normal-mode-radio-buttons-group-label"
          name="radio-buttons-group"
          value={subMode}
          onChange={onClick}
          sx={{ mb: 3 }}
        >
          <FormControlLabel
            value="manual-communication"
            control={<Radio sx={{ zIndex: 200 }} />}
            label="Manual Communication"
          />
          <Box pl={4} sx={{ typography: "caption" }}>
            手動でモールス信号を発します。
          </Box>
          <FormControlLabel
            value={"translation-to-morse-code"}
            control={<Radio sx={{ zIndex: 200 }} />}
            label="Translation to Morse Code"
          />
          <Box pl={4} sx={{ typography: "caption" }}>
            入力したメッセージをモールス信号に変換して再生します。
            <br />
            <span style={{ color: "#B00020" }}>注意：</span>
            メッセージにはひらがな、カタカナ、アルファベット、漢字を使用してください。漢字は自動的にひらがなに変換されます。
          </Box>
        </RadioGroup>
        <Box pl={4} pr={1}>
          <TextField
            id="outlined-basic"
            label="メッセージ"
            variant="outlined"
            fullWidth
            value={text}
            onChange={onChangeTextField}
            sx={{ zIndex: 200 }}
          />
        </Box>
      </FormControl>
    </>
  );
};

const SabotageMode = ({ subMode, onClick }: ModeProps) => {
  return (
    <>
      <FormControl sx={{ mb: 10 }}>
        <FormLabel id="sabotage-mode-radio-buttons-group-label">
          妨害モード
        </FormLabel>
        <RadioGroup
          aria-labelledby="sabotage-mode-radio-buttons-group-label"
          name="radio-buttons-group"
          value={subMode}
          onChange={onClick}
        >
          <FormControlLabel
            value="abrasive-mosquitone"
            control={<Radio sx={{ zIndex: 200 }} />}
            label="Abrasive Mosquitone"
          />
          <Box pl={4} sx={{ typography: "caption" }}>
            不快感を与える高音を継続的に再生し、集中力を削ります。
          </Box>
          <FormControlLabel
            value="fake-listening-problems"
            control={<Radio sx={{ zIndex: 200 }} />}
            label="Fake Listening Problems"
          />
          <Box pl={4} sx={{ typography: "caption" }}>
            ダミーのリスニング音声を再生し、リスニングテストをかく乱します。
            <br />
            <span style={{ color: "#B00020" }}>注意：</span>
            周波数の設定に関わらず、誰にでも聞こえる音声が再生されます。
          </Box>
        </RadioGroup>
      </FormControl>
    </>
  );
};

type MenuTabsProps = {
  frequency: number;
};

const MenuTabs = ({ frequency }: MenuTabsProps) => {
  // normal or sabotage
  const [value, setValue] = React.useState(0);
  const handleChangeValue = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    newValue == 0
      ? setSubMode("manual-communication")
      : setSubMode("abrasive-mosquitone");
  };

  // 各モード内のラジオボタン
  const [subMode, setSubMode] = useState("manual-communication");

  const handleChangeSubMode = (_: React.SyntheticEvent, newValue: string) => {
    setSubMode(newValue);
  };

  // テキストボックスの値
  const [text, setText] = React.useState("");
  const handleChangeTextField = (e: any) => {
    setText(e.target.value);
  };

  return (
    <>
      <Tabs
        value={value}
        onChange={handleChangeValue}
        aria-label="menu tabs"
        variant="fullWidth"
      >
        <Tab label="通信" sx={{ zIndex: 200 }} />
        <Tab label="妨害" sx={{ zIndex: 200 }} />
      </Tabs>
      <CustomTabPanel value={value} index={0}>
        <NormalMode
          subMode={subMode}
          onClick={handleChangeSubMode}
          text={text}
          onChangeTextField={handleChangeTextField}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <SabotageMode subMode={subMode} onClick={handleChangeSubMode} />
      </CustomTabPanel>
      <Footer mode={subMode} frequency={frequency} text={text} />
    </>
  );
};

export default MenuTabs;
