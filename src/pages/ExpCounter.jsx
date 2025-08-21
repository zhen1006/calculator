import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormControlLabel,
    FormGroup, FormHelperText, FormLabel,
    IconButton,
    Input,
    InputLabel,
    LinearProgress,
    MenuItem,
    OutlinedInput,
    Radio,
    RadioGroup,
    Rating,
    Select,
    Slider,
    Stack,
    styled,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography
} from "@mui/material";
import {useState} from "react";
import {Check, ExpandMore, HelpOutline, OndemandVideo, QuestionMarkOutlined, Settings} from "@mui/icons-material";
import {pink} from "@mui/material/colors";
import AnimatedNumbers from "react-animated-numbers";
import {ExpSelector} from "../components/ExpSelector.jsx";
import {DataDisplay} from "../components/DataDisplay.jsx";

import {
    exps,
    tierList,
    redFruitList,
    effList,
    tableChances,
    levelList,
    stone,
    godBuff,
    godRegent,
    stoneEff,
    buffs,
    chartLs,
    breatheList, processList
} from "./../data/data.js";
import {timeString, formatNumber} from "../data/functions.js";
import _ from "lodash";
import SaveLoader from "../components/SaveLoader.jsx";
import {toast} from "react-toastify";

const ColorButton = styled(Button)(({theme}) => ({
    color: theme.palette.getContrastText(pink[300]), backgroundColor: pink[300], '&:hover': {
        backgroundColor: pink[400],
    },
}));


export default function ExpCounter() {

    const [reload, setReload] = useState(Math.random());
    const [REIKI, setREIKI] = useState(0); 
    const airValue = ur || 0;
    const ur = 0;
    const save = (i, data = null) => {
        let saveList = data || {
            cal,
            tier,
            level,
            process,
            exp,
            othersREIKI,
            voidREIKI,
            upT,
            upRate,
            buff,
            breatheTime,
            breatheBuf,
            medAmount,
            medExp,
            tableType,
            tableStopType,
            tableTime,
            tableCount,
            tableExtra,
            tableControl,
            tableChance,
            tableTierToStop,
            stoneLV,
            gods,
            godDoubles,
            dir,
            subProcess,
            thirdProcess,
        };
        localStorage.setItem(`data ${i}`, JSON.stringify(saveList));
        toast.success("Saved!")
    };
    const load = (i) => {
        let data = localStorage.getItem(`data ${i}`);

        if (data !== null) {
            data = JSON.parse(data);

            const setters = {
                cal: setCal,
                tier: setTier,
                level: setLevel,
                process: setProcess,
                exp: setExp,
                REIKI: setOthersREIKI,
                othersREIKI: setOthersREIKI,
                voidREIKI: setVoidREIKI,
                upT: setUpT,
                upRate: setUpRate,
                buff: setBuff,
                breatheTime: setBreatheTime,
                breatheBuf: setBreatheBuf,
                medAmount: setMedAmount,
                medExp: setMedExp,
                tableType: setTableType,
                tableStopType: setTableStopType,
                tableTime: setTableTime,
                tableCount: setTableCount,
                tableExtra: setTableExtra,
                tableControl: setTableControl,
                tableChance: setTableChance,
                tableTierToStop: setTableTierToStop,
                stoneLV: setStoneLV,
                gods: setGods,
                godDoubles: setGodDoubles,
                dir: setDir,
                subProcess: setSubProcess,
                thirdProcess: setThirdProcess,
            };

            Object.entries(setters).forEach(([key, setter]) => setter(data[key] || 0));
            toast.success("Loaded!")
        }
    };

    const eat = (c, t = 1, ct) => {
        ct.eat += t;
        let gain = redFruitList[tier] * 1.8 * (1.5 * tableControl[2]);
        let totalGain = 0;
        while (t > 0) {
            c += 1;
            t -= 1;
            if (c >= 6) {
                c = 0;
                totalGain += gain * 2.7;
                ct.doubles += 1;
            } else {
                if (tableChance === 0) {
                    totalGain += gain;
                } else if (tableChance === 1) {
                    if (Math.random() < 0.35) {
                        c = 0
                        totalGain += gain * 2.7;
                        ct.doubles += 1;
                    } else {
                        totalGain += gain;
                    }
                } else {
                    totalGain += gain * 2.7;
                    ct.doubles += 1;
                }
            }
        }

        return [totalGain, c, ct]
    }

    const calc = (mainP, subP = {}, thirdP = {}) => {
        let log = new Set();
        let vd = 0;
        let records = [];
        let sum = {
            base: 0, extra: 0, breathe: 0, med: 0, table: 0, stone: 0, god: 0,
        };
        let godEnergy = [0, 0, 0];
        let chargeTime = 0;
        let fruitAmount = tableCount;
        let counter = {
            breathe: 0, med: [0, 0, 0, 0, 0, 0], chance: 0, doubles: 0, eat: 0,
        }
        let reachDays = {};
        let gods1 = JSON.parse(JSON.stringify(gods));
        let gains = 0;
        let tb = 0;
        let inc = 0;
        let tableCanEat = false;
        let completeBuff = 0;

        // control
        if (!cal[6]) {
            gods1[0][0] = -1;
            gods1[1][0] = -1;
        }
        let PS = [_.clone(mainP), _.clone(subP), _.clone(thirdP)];

        let now = dir;

        while (true) {

            vd += 1;
            chargeTime += 8
            if (chargeTime >= 900) {
                chargeTime -= 900
                // god regent
                godEnergy[0] += godRegent[gods1[0][0]] || 0;
                godEnergy[1] += godRegent[gods1[1][0]] || 0;
            }

            // check if can eat

            if ((tableType === 0 || (tableStopType ? Math.floor(vd / 10800) >= tableTime : _.every([PS[now].tier, PS[now].level, PS[now].process, PS[now].exp], (n, i) => n >= Object.values(tableTierToStop)[i])) && tableType === 1) && cal[4] && !tableCanEat) {
                tableCanEat = true;
                [gains, tb, counter] = eat(tb, fruitAmount, counter);
                inc += gains;
                sum.table += gains;
                fruitAmount = 0;
            }
            let calcREIKI = PS[now].tier === 1 ? voidREIKI : othersREIKI;
            let customResult = (customAbsorbRate + upRate) * calcREIKI; 
            let customSpeedPerDay = customResult; 
            let speed1 = calcREIKI * (customEffective === false ? (effList[PS[0].tier][PS[0].level] / 100) : customEffective / 100); // 修煉速度
            let extra = calcREIKI * ((
                    (customEffective === false ? effList[PS[0].tier][PS[0].level] : customEffective)
                    + (PS[0].level < 1 && (buff === 2) ? 20 : 0)
                    + (PS[0].level < 2 && (buff === 3) ? 40 : 0)) / 100)
                * (PS[0].level < upT || (PS[now].tier < PS[0].tier && upT !== 0) ? upRate / 100 : 0) // 奮起
            extra += calcREIKI * (PS[0].level < 1 && buff === 2 ? 20 : 0) / 100; // perfect
            extra += calcREIKI * (PS[now].level < 2 && buff === 3 ? 40 : 0) / 100; // half step
            extra += calcREIKI * completeBuff *(PS[now].tier===PS[0].tier) / 100;

            let st1 = (speed1 * cal[0] + extra * cal[1]) * stoneEff[stoneLV] / 100; // 石

            speed1 *= cal[0];
            extra *= cal[1];
            st1 *= cal[5];

            inc += speed1 + extra + st1;

            sum.base += speed1;
            sum.extra += extra;
            sum.custom = customSpeedPerDay;
            sum.stone += st1;

            if (vd % 10800 === 0) {
                // god
                godEnergy[0] += gods1[0][0] < 0 ? 0 : 100;
                godEnergy[1] += gods1[1][0] < 0 ? 0 : 200;
                counter.chance += !(gods1[0][0] < 0) * 30 + !(gods1[1][0] < 0) * 30;
                while (godEnergy[0] >= 100) {
                    counter.doubles += 1;
                    if (!(Math.random() < 0.15 && godDoubles && gods1[0][0] === 5)) {
                        counter.doubles -= 1;
                        godEnergy[0] -= 100;
                        counter.med[5] += 1;
                    }
                    sum.god += gods1[0][1] * 10000;
                    inc += gods1[0][1] * 10000;
                }
                let useEnergy = (200 - 200 * (godBuff[1][gods1[1][0]] + gods1[1][2] * 10) / 100);
                while (godEnergy[1] >= useEnergy) {
                    counter.doubles += 1;
                    if (!(Math.random() < 0.15 && godDoubles && gods1[1][0] === 5)) {
                        counter.doubles -= 1;
                        godEnergy[1] -= useEnergy;
                        counter.med[5] += 1;
                    }
                    sum.god += gods1[0][1] * 10000;
                    inc += gods1[0][1] * 10000;
                }

                // breathe
                inc += breatheSpeed;
                sum.breathe += breatheSpeed;
                counter.breathe += breatheTime;

                // med
                [...Array(5).keys()].forEach((i) => {
                    let med = cal[3] * medExp[i] * medAmount[i] * 10000;
                    inc += med;
                    sum.med += med;
                    counter.med[i] += cal[3] * medAmount[i];
                })

                // table
                if (cal[4]) {

                    let day = ((new Date()).getDay() + Math.floor(vd / 10800) - 1) % 7;
                    if ([3, 5, 0].includes(day)) {

                        if (tableType === 0 || tableCanEat) {
                            [gains, tb, counter] = eat(tb, 3, counter);
                            inc += gains;
                            sum.table += gains;
                        } else if (tableType === 1 && !tableCanEat) {
                            fruitAmount += 3;
                        }
                    }
                    if (day === 1) {
                        let am = 6 * tableControl[0] + 6 * tableControl[1] + tableExtra;
                        if (tableType === 0 || tableCanEat) {
                            [gains, tb, counter] = eat(tb, am, counter);
                            inc += gains;
                            sum.table += gains;
                        } else if (tableType === 1 && !tableCanEat) {
                            fruitAmount += am;
                        }
                    }

                }

                // can't continues
                if (inc <= 0 && (!cal[4] || [2, 3].includes(tableType) || (tableType === 1 && tableStopType === 0))) {
                    alert(`到達${tierList[PS[now].tier]}${levelList[PS[now].level]}${PS[now].process}重時修煉速度為0, 不可繼續`);
                    break;
                }


                records.push(sum);
                sum = {
                    base: 0, extra: 0, breathe: 0, med: 0, table: 0, stone: 0, god: 0
                };

            }

            PS[now].exp += inc;


            // upgrade tier
            if (PS[now].exp >= exps[PS[now].tier][PS[now].level][PS[now].process]) {
                PS[now].exp -= exps[PS[now].tier][PS[now].level][PS[now].process];
                PS[now].process += 1;
                log.add(`${timeString(vd * 8)} (${Math.round(vd / 112.5 * 1000) / 1000}): ${processList[now]}${tierList[PS[now].tier]}${levelList[PS[now].level]}${PS[now].process + 1}重`)
                reachDays[Math.ceil(vd / 10800 + 1).toString()] = `${processList[now]}${levelList[PS[now].level]}${PS[now].process + 1}重`
            }
            if (PS[now].process >= exps[PS[now].tier][PS[now].level].length) {
                PS[now].process = 0;
                PS[now].level += 1;
                log.add(`${timeString(vd * 8)} (${Math.round(vd / 112.5 * 1000) / 1000}): ${processList[now]}${tierList[PS[now].tier]}${levelList[PS[now].level]}`)
            }

            // stop done.
            if (stopType === 1 && vd / 10800 === stop) {
                log.add("date reach.");
                break;
            }
            if (stopType === 0) {
                if (!dir) {
                    if (now !== 0 && PS[now].level >= 3 && PS[now].tier < PS[0].tier) { // upgrade tier
                        PS[now].tier += 1;
                        PS[now].level = 0;
                    }


                    if (PS[now].level >= 3) {
                        log.add("抵達圓滿");
                        if (stopLevel === 0) break;
                    }
                    if (now === 1 && (  // 大成
                        PS[now].tier > PS[0].tier - 1 // check tier
                        || (
                            PS[now].tier === PS[0].tier - 1
                            && PS[now].level >= 1
                        )
                    )) {
                        log.add("抵達大成, 吸收率+20%");
                        completeBuff = 20;
                        if (stopLevel === 1) break;
                    }
                    if (now === 1 && (  // 完美
                        PS[now].tier >= PS[0].tier
                    )) {
                        log.add("抵達完美");
                        completeBuff = 20;
                        if (stopLevel === 2) break;
                    }
                    if (now === 1 && (  // 半步
                        PS[now].tier >= PS[0].tier
                        && PS[now].level >= 3
                    )) {
                        log.add("抵達半步, 吸收率+40%");
                        completeBuff = 40;
                        if (stopLevel === 3) break;
                    }
                    if (now === 2 && (  // 準
                        PS[now].tier >= PS[0].tier
                        && PS[now].level >= 3
                    )) {
                        log.add("抵達準");``
                        break;
                    }

                    if (PS[now].level >= 3 && now === 0) { // 開始修練輔修
                        log.add("開始修練輔修");
                        now = 1;
                    }
                    if (PS[now].level >= 3 && now === 1) { // 開始修練三修
                        log.add("開始修練三修");
                        now = 2;
                    }

                } else if (PS[now].level >= 3) { // not main 修
                    console.log("抵達圓滿");
                    break;
                }

            }
            inc = 0;
        }
        setLogs(Array.from(log));
        setFullTime(vd);
        setRecord(records);
        console.log(PS);

        counter.reachDays = reachDays;
        setCounters(counter);
        setFinal({t: PS[0].tier, l: PS[0].level, p: PS[0].process, e: PS[0].exp, type: stopType, stopLevel: stopLevel});
        return vd;
    };

    const isMobile = window.mobileCheck();
    const [customAbsorbRate, setCustomAbsorbRate] = useState(0); // 自訂吸收率 (%)
    const [cal, setCal] = useState([true, true, true, true, true, true, true]);
    const [tier, setTier] = useState(4);
    const [level, setLevel] = useState(0);
    const [process, setProcess] = useState(0);
    const [exp, setExp] = useState(0);
    const [othersREIKI, setOthersREIKI] = useState(0);
    const [voidREIKI, setVoidREIKI] = useState(0);
    const [upT, setUpT] = useState(0);
    const [upRate, setUpRate] = useState(20);
    const [buff, setBuff] = useState(0);
    const [breatheTime, setBreatheTime] = useState(0);
    const [breatheBuf, setBreatheBuf] = useState(100);
    const [medAmount, setMedAmount] = useState([0, 0, 0, 0, 0, 0]);
    const [medExp, setMedExp] = useState([0, 0, 0, 0, 0, 0]);
    const [tableType, setTableType] = useState(3);
    const [tableStopType, setTableStopType] = useState(1);
    const [tableTime, setTableTime] = useState(0);
    const [tableCount, setTableCount] = useState(0);
    const [tableExtra, setTableExtra] = useState(0);
    const [tableControl, setTableControl] = useState([false, false, true]);
    const [tableChance, setTableChance] = useState(1);
    const [tableTierToStop, setTableTierToStop] = useState({
        tier: 4, level: 0, process: 0, exp: 0
    });
    const [stoneLV, setStoneLV] = useState(0);
    const [gods, setGods] = useState([[-1, 0], [-1, 0, false], [-1, 0]]);
    const [godDoubles, setGodDoubles] = useState(true);
    const [customEffective, setCustomEffective] = useState(false);

    const [subProcess, setSubProcess] = useState({
        tier: 4, level: 0, process: 0, exp: 0
    });
    const [thirdProcess, setThirdProcess] = useState({
        tier: 4, level: 0, process: 0, exp: 0
    });

    const [dir, setDir] = useState(0);

    const [fullTime, setFullTime] = useState(0);

    useEffect(() => {
  if (tier === 1) {
    setREIKI(voidREIKI);  // 根據 tier 設置 REIKI
  } else {
    setREIKI(othersREIKI); // 根據 tier 設置 REIKI
  }
}, [tier]); 

    const effectiveSpeed = customEffective === false ? effList[tier][level] : customEffective;
    const effective = cal[0] * effectiveSpeed;
    const addEfficiency = cal[1] * (effectiveSpeed + ((buff === 2) * 20 * (level < 1)) + ((buff === 3) * 40 * (level < 2))) * (upT > level ? upRate : 0) / 100 + (buff === 2) * 20 * (level < 1) + (buff === 3 || buff === 4) * 40 * (level < 2);
    const speed = REIKI * ((effective + addEfficiency) / 100);
    const breatheSpeed = cal[2] * breatheList[tier] * breatheBuf / 100 * breatheTime * 1.9;
    const medSpeed = cal[3] * medAmount.slice(0, 6).reduce((acc, _, i) => acc + medAmount[i] * medExp[i] * 10000, 0);
    const tableBase = cal[4] * redFruitList[tier] * 1.8 * (1.5 * tableControl[2]) * (9 + (tableControl[0] * 6) + (tableControl[1] * 6));
    const tableSpeed = tableType === 0 ? tableBase * (tableChances[tableChance] / 100) * 2.7 + tableBase * (1 - tableChances[tableChance] / 100) : 0;
    const stoneSpeed = cal[5] * speed * stoneEff[stoneLV] / 100;
    const godDay = [cal[6] * Math.round(((96 * godRegent[gods[0][0]] + 100) / 100 + (gods[0][0] === 5 && godDoubles ? ((96 * godRegent[gods[0][0]] + 100) / 100 * 0.15) : 0)) * 100) / 100, cal[6] * Math.round(((96 * godRegent[gods[1][0]] + 100) / (200 - 200 * (godBuff[1][gods[1][0]] + gods[1][2] * 10) / 100) + (gods[1][0] === 5 && godDoubles ? ((96 * godRegent[gods[1][0]] + 100) / (200 - 200 * (godBuff[1][gods[1][0]] + gods[1][2] * 10) / 100) * 0.15) : 0)) * 100) / 100]
    const godSpeed = [Math.round(godDay[0] * gods[0][1] * 10000 * 100) / 100 || 0, Math.round(godDay[1] * gods[0][1] * 10000 * 100) / 100 || 0];

    // final zone
    console.log("REIKI:", REIKI, "addEfficiencyTotal:", addEfficiencyTotal);
    const finalSpeed = Math.round(REIKI * effective / 100 / 8 * 60 * 60 * 24 * 100) / 100;
    const finalAdd = Math.round(REIKI * addEfficiencyTotal / 100 / 8 * 60 * 60 * 24 * 100) / 100;
    const totalAbsorbRate = addEfficiency + customAbsorbRate; // 綠色字 + 自訂輸入
    const addEfficiencyTotal = addEfficiency + customAbsorbRate;
    const finalBreathe = Math.round(breatheSpeed * 100) / 100;
    const finalMed = Math.round(medSpeed * 100) / 100;
    const finalTable = Math.round(tableSpeed / 7 * 100) / 100;
    const finalStone = Math.round((finalSpeed + finalAdd) * (stoneEff[stoneLV] / 100) * cal[5] * 100) / 100;
    const finalGod = Math.round(godSpeed.reduce((a, b) => a + b) * 100) / 100

    const [logs, setLogs] = useState([]);
    const [record, setRecord] = useState([]);
    const [counters, setCounters] = useState({
        breathe: 0, med: [0, 0, 0, 0, 0, 0], chance: 0, eat: 0, doubles: 0
    });

    const [final, setFinal] = useState(null);

    const [stopSetDialog, setStopSetDialog] = useState(false);
    const [stopType, setStopType] = useState(0);
    const [stopLevel, setStopLevel] = useState(0);
    const [stopTime, setStopTime] = useState(30);

    return (<Stack spacing={2} sx={{my: 2}}>
        <Typography variant={isMobile ? "h3" : "h1"}>經驗計算器</Typography>

        <Button startIcon={<OndemandVideo />} onClick={() => window.open("https://youtu.be/f1MhQwRrhuE", "_blank")}>使用說明</Button>

        <SaveLoader
            save={save}
            load={load}
            relaod={() => setReload(Math.random())}
            value={reload}
        />

        <Stack direction="row" className={"justify-center items-center"} spacing={3}>
            <Typography color={"textSecondary"}>修練(計算)方向</Typography>
            <RadioGroup row value={dir} onChange={(e, v) => setDir(parseInt(v))}>
                <FormControlLabel control={<Radio value={0}/>} label={"主修"}/>
                <FormControlLabel control={<Radio value={1}/>} label={"輔修"}/>
                <FormControlLabel control={<Radio value={2}/>} label={"三修"}/>
            </RadioGroup>
        </Stack>

        <Stack spacing={1}>
            <Stack direction={"row"} className={"items-center justify-around"}>
                <Typography color={"textSecondary"}>主修</Typography>
                <ExpSelector
                    tier={tier} setTier={setTier}
                    level={level} setLevel={setLevel}
                    process={process} setProcess={setProcess}
                    exp={exp} setExp={setExp}
                    full={true}
                    lock={false}
                />
            </Stack>
            <Divider />
            <Stack direction={"row"} className={"items-center justify-around"}>
                <Typography color={"textSecondary"}>輔修</Typography>
                <ExpSelector
                    setData={setSubProcess}
                    tier={subProcess.tier} level={subProcess.level} process={subProcess.process} exp={subProcess.exp}
                />
            </Stack>
            <Divider />

            <Stack direction={"row"} className={"items-center justify-around"}>
                <Typography color={"textSecondary"}>三修</Typography>
                <ExpSelector
                    setData={setThirdProcess}
                    tier={thirdProcess.tier} level={thirdProcess.level} process={thirdProcess.process} exp={thirdProcess.exp}
                />
            </Stack>


        </Stack>

        <Stack direction={"row"} alignItems={"center"}>
            <Box width={"100%"}>

               <LinearProgress
                 variant={"determinate"}
                 value={
                   ([0, ...exps[tier][level].slice(0, process)].reduce((a, b) => a + b) + exp)
                   / exps[tier][level === 3 ? 2 : level].reduce((a, b) => a + b)
                   * 100 + (level === 3) * 100
                 }
               />
               {tierList[tier]}{levelList[level]}
               {formatNumber(
                 ([0, ...exps[tier][level].slice(0, process)].reduce((a, b) => a + b) + exp)
                 / exps[tier][level === 3 ? 2 : level].reduce((a, b) => a + b)
                 * 100 + (level === 3) * 100
               )}%       
            </Box>
            <Typography minWidth={125} fontSize={"small"} color={"textSecondary"}>

                {tierList[tier]}
                {levelList[level]}

                {formatNumber(([0, ...exps[tier][level].slice(0, process)].reduce((a, b) => a + b) + exp) / exps[tier][level === 3 ? 2 : level].reduce((a, b) => a + b) * 100 + (level === 3) * 100)}%
            </Typography>
        </Stack>

        <Box sx={{"*": {"*.MuiAccordionSummary-content": {justifyContent: "space-between"}}}}>

            <Accordion sx={{width: "100%"}} defaultExpanded>
                <AccordionSummary
                    expandIcon={<ExpandMore/>}
                    sx={{"*": {color: "white"}}}
                >
                    修煉速度
                    <span>+{finalSpeed}</span>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack alignItems={"center"} justifyContent={"center"} direction={isMobile ? "column" : "row"} spacing={2}>
                        <TextField
                            value={othersREIKI}
                            onChange={(e) => setOthersREIKI(parseFloat(e.target.value))}
                            label={"洞府靈氣"}
                            variant="outlined"
                            type={"number"}
                            min={0.00}
                            step={0.01}
                            fullWidth
                            helperText={"請輸入**不是**返虛的洞府靈氣,"}
                        />
                        {[tier, subProcess.tier, thirdProcess.tier].includes(1) &&
                            <TextField
                                value={voidREIKI}
                                onChange={(e) => setVoidREIKI(parseFloat(e.target.value))}
                                label={"返虛境洞府靈氣(如有)"}
                                variant="outlined"
                                type={"number"}
                                min={0.00}
                                step={0.01}
                                fullWidth
                                helperText={"因為古寶套裝可能不同"}
                            />
                        }
                        <FormControl sx={{minWidth: 100}}>
                            <InputLabel htmlFor={"effective-input"}>吸收率</InputLabel>
                            <OutlinedInput
                                id={"effective-input"}
                                value={effective}
                                label={"吸收率"}
                                onChange={(e) => setCustomEffective(parseFloat(e.target.value))}
                                disabled={customEffective === false}
                                startAdornment={"x"}
                                endAdornment={"%"}
                                type="number"
                                aria-describedby="effective-input-helper-text"
                            />
                            <FormHelperText id={"effective-input-helper-text"}>白色文字</FormHelperText>
                        </FormControl>
                        <FormControlLabel sx={{minWidth: 80}} control={<Checkbox
                            checked={customEffective !== false}
                            onChange={(e, v) => setCustomEffective(v ? 0 : false)}
                        />} label={"自訂"}/>
                    </Stack>
                </AccordionDetails>
            </Accordion>

            <Accordion sx={{width: "100%"}} defaultExpanded>
                <AccordionSummary
                    expandIcon={<ExpandMore/>}
                    sx={{"*": {color: "lightgreen"}}}
                >
                    額外吸收率
                    <span>+{finalAdd}</span>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack alignItems={"center"} justifyContent={"space-evenly"}
                           direction={isMobile ? "column" : "row"}
                           spacing={2}>

                        <FormControl sx={{"*": {color: "lightgreen"}}}>
                            <InputLabel htmlFor={"add-effective-input"}>額外吸收率 (綠色字)</InputLabel>
                            <OutlinedInput
                                value={addEfficiency}
                                id={"add-effective-input"}
                                variant="outlined"
                                label={"額外吸收率 (綠色字)"}
                                startAdornment={"+"}
                                endAdornment={"%"}
                                type="number"
                                disabled
                            />
                        </FormControl>
                        <FormControl sx={{ "*": { color: "lightblue" } }}>
                          <InputLabel htmlFor="custom-absorb-input">自訂吸收率 (%)</InputLabel>
                          <OutlinedInput
                            value={customAbsorbRate}
                            id="custom-absorb-input"
                            variant="outlined"
                            label="自訂吸收率 (%)"
                            endAdornment={"%"}
                            type="number"
                            onChange={(e) => setCustomAbsorbRate(Number(e.target.value))}
                          />
                        </FormControl>
                        <Stack alignItems={"center"} justifyContent={"space-evenly"} direction={"row"} spacing={2}>

                            <Card sx={{height: "100%", width: 125}} elevation={5}>
                                <CardContent>
                                    <Typography color={"success"}>奮起</Typography>
                                    <FormGroup>
                                        {levelList.slice(0, 3).map((name, i) => <FormControlLabel
                                            checked={upT - 1 >= i}
                                            onChange={() => setUpT(upT === i + 1 ? 0 : i + 1)}
                                            control={<Checkbox size={"small"}/>} label={name}
                                            key={name}
                                        />)}
                                    </FormGroup>
                                    <FormControl variant={"standard"} fullWidth>
                                        <Select value={upRate} onChange={(e) => setUpRate(e.target.value)}>
                                            {[15, 20, 25, 30].map(i => <MenuItem value={i} key={i}>{i}%</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </CardContent>
                            </Card>

                            <Card sx={{height: "100%", width: 150}} elevation={5}>
                                <CardContent>
                                    <Typography color={"aquamarine"}> 前一境界<br/>修煉精進</Typography>
                                    <RadioGroup value={buff} onChange={(e, v) => setBuff(parseInt(v))}>
                                        {Object.entries(buffs).map(([name, color], i) => <FormControlLabel
                                            value={i} sx={{color: color}} control={<Radio size={"small"}/>} label={name}
                                            key={name}
                                        />)}
                                    </RadioGroup>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Stack>
                      <Typography variant="body2" sx={{ color: "gray", mt: 1 }}>
                          tip:若是你已經大成並且要計算半步的時間請不要勾選此面板,直接在上方輸入你的總吸收率*
                      </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion sx={{width: "100%"}}>
                <AccordionSummary
                    expandIcon={<ExpandMore/>}
                    sx={{"*": {color: "orange"}}}
                >
                    吐吶
                    <span>+{finalBreathe}</span>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack alignItems={"center"} justifyContent={"center"}>
                        <Typography variant={isMobile ? "h6" : "h2"} sx={{color: "rgba(255,255,255,0.5)"}}>
                            抗拒計算吐納 從你我做起
                        </Typography>
                        <Stack px={10 * !isMobile} width={"-webkit-fill-available"}
                               direction={isMobile ? "column" : "row"}
                               justifyContent={"space-around"} alignItems={"center"}>
                            <Stack direction={!isMobile ? "column" : "row-reverse"} alignItems={"center"}
                                   spacing={1}>
                                <Typography fontSize={"xx-large"}>{breatheList[tier]}</Typography>
                                <Typography color={"textSecondary"}>吐納基礎修為</Typography>
                            </Stack>
                            <Typography sx={{color: "rgba(255,255,255,0.5)"}} m={-3}
                                        fontSize={"xxx-large"}>×</Typography>
                            <Stack m={2} direction={!isMobile ? "column" : "row-reverse"} alignItems={"center"}
                                   spacing={1}>
                                <Input type={"number"} sx={{width: 80,}}
                                       onChange={(e) => setBreatheBuf(parseFloat(e.target.value))}
                                       variant={"standard"} value={breatheBuf}
                                       endAdornment={"%"}
                                />
                                <Typography color={"textSecondary"}>吐納加成</Typography>
                            </Stack>
                            <Typography sx={{color: "rgba(255,255,255,0.5)"}} m={-3}
                                        fontSize={"xxx-large"}>×</Typography>
                            <Stack m={2} direction={!isMobile ? "column" : "row-reverse"} alignItems={"center"}
                                   spacing={1}>
                                <Input type={"numbers"} sx={{width: 80}}
                                       onChange={(e) => setBreatheTime(parseFloat(e.target.value))}
                                       variant={"standard"} value={breatheTime}
                                       endAdornment={"次"}/>
                                <Typography color={"textSecondary"}>吐納次數</Typography>
                            </Stack>
                            <Typography sx={{color: "rgba(255,255,255,0.5)"}} m={-3}
                                        fontSize={"xxx-large"}>×</Typography>
                            <Stack direction={!isMobile ? "column" : "row-reverse"} alignItems={"center"}
                                   spacing={1}>
                                <Typography fontSize={"xx-large"}>1.9</Typography>
                                <Typography color={"textSecondary"}>吐納爆擊</Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </AccordionDetails>
            </Accordion>
            <Accordion sx={{width: "100%"}}>
                <AccordionSummary
                    expandIcon={<ExpandMore/>}
                    sx={{"*": {color: "magenta"}}}
                >
                    丹藥
                    <span>+{finalMed}</span>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack direction={isMobile ? "column" : "row"} spacing={2} alignItems="center"
                           justifyContent="space-around">
                        {["grey", "lightgreen", "lightblue", "magenta", "gold"].map((color, i) => <Stack
                            alignItems={"center"} key={color} direction={!isMobile ? "column" : "row-reverse"}
                            spacing={isMobile * 2}>
                            <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                                <Box sx={{width: 10, height: 10, backgroundColor: color, borderRadius: 100}}/>
                                <Input
                                    sx={{width: 50}}
                                    type={"number"}
                                    value={medAmount[i]}
                                    startAdornment={"x"}
                                    onChange={(e) => {
                                        let newAmount = Array.from(medAmount);
                                        newAmount[i] = parseFloat(e.target.value);
                                        if (newAmount[i] < 0) return
                                        setMedAmount(newAmount);
                                    }}
                                />
                            </Stack>
                            <Input
                                sx={{width: 80}}
                                type={"number"}
                                value={medExp[i]}
                                placeholder={""}
                                endAdornment={"萬"}
                                onChange={(e) => {
                                    let newAmount = Array.from(medExp);
                                    newAmount[i] = parseFloat(e.target.value);
                                    if (newAmount[i] < 0) return
                                    setMedExp(newAmount);
                                }}
                            />
                        </Stack>)}
                    </Stack>
                </AccordionDetails>
                <AccordionActions>*請輸入您每天的進食量和經驗</AccordionActions>
            </Accordion>

            <Accordion sx={{width: "100%"}}>
                <AccordionSummary
                    expandIcon={<ExpandMore/>}
                    sx={{"*": {color: "lightblue"}}}
                >
                    化靈臺
                    <span>+{finalTable}</span>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack spacing={2} direction={isMobile ? "column" : "row"} alignItems={"center"}
                           justifyContent={"center"}>
                        <Tooltip title={<Stack sx={{fontSize: isMobile ? "1em" : "2em"}}>1. 立即吃 =
                            星期3、5、日各吃三顆，星期一看有沒有購買禮包吃台子，有就吃掉【已經升滿級選這個】 <br/>
                            2. 達成條件後吃 = 達成設定好的條件後一次過吃（時間/達到修為），其中的過程所有的果實會保存起來，其後遵從“立刻吃”模式
                            【知道什麼時候可以升滿台子選這個】 <br/>
                            3. 最少進食量 = 當一次過吃完所有果子能夠達成圓滿才吃，也會累積果實數量，務求消耗最少的果實數量
                            【不知道什麼時候用】 <br/>
                            4. 不吃 = 就不吃</Stack>} placement={"top"} arrow>
                            <HelpOutline/>
                        </Tooltip>
                        <ToggleButtonGroup exclusive onChange={(e, v) => v !== null ? setTableType(v) : null}
                                           value={tableType} orientation={"vertical"} fullWidth={isMobile}
                                           size={isMobile ? "small" : "medium"}>
                            <ToggleButton value={0}>
                                立即吃
                            </ToggleButton>
                            <ToggleButton value={1}>
                                達成條件後吃
                            </ToggleButton>
                            <ToggleButton value={2}>
                                最小進食量
                            </ToggleButton>
                            <ToggleButton value={3}>
                                不吃
                            </ToggleButton>
                        </ToggleButtonGroup>

                        <FormGroup>
                            {["購買萬妖果禮包x2", "購買萬妖令禮包", "目前最高等級(+50%)"].map((t, i) =>
                                <FormControlLabel
                                    checked={tableControl[i]}
                                    onChange={(e, v) => {
                                        let newControl = Array.from(tableControl);
                                        newControl[i] = v;
                                        setTableControl(newControl);
                                    }}
                                    control={<Checkbox/>}
                                    label={t}
                                    key={t}
                                />)}

                        </FormGroup>
                        <Slider
                            sx={isMobile ? {} : {height: "100px"}}
                            orientation={isMobile ? "horizontal" : "vertical"}
                            defaultValue={1}
                            value={tableChance}
                            onChange={(e, v) => setTableChance(v)}
                            valueLabelDisplay={isMobile ? "on" : "auto"}
                            valueLabelFormat={(v) => ["非酋(全保底)", "正常(期望機率)", "歐皇(全靈湧)"][v]}
                            step={null}
                            min={0}
                            max={2}
                            marks={[{value: 0}, {value: 1}, {value: 2},]}
                        />
                        <Stack spacing={2}>

                            <TextField
                                label={"當前果子數量"}
                                type={"number"}
                                value={tableCount}
                                onChange={(e) => setTableCount(parseFloat(e.target.value))}
                            />

                            <TextField
                                label={"每週額外果子數量"}
                                type={"number"}
                                value={tableExtra}
                                onChange={(e) => setTableExtra(parseFloat(e.target.value))}
                            />
                        </Stack>
                    </Stack>
                    <Collapse in={tableType === 1}>

                        <Stack direction={isMobile ? "column" : "row"} p={3} justifyContent={"space-around"}
                               alignItems={"center"} spacing={2}>
                            <ToggleButtonGroup exclusive
                                               onChange={(e, v) => v !== null ? setTableStopType(v) : null}
                                               value={tableStopType}
                                               orientation={isMobile ? "horizontal" : "vertical"}>
                                <ToggleButton value={0}>
                                    修為
                                </ToggleButton>
                                <ToggleButton value={1}>
                                    時間
                                </ToggleButton>
                            </ToggleButtonGroup>
                            {tableStopType ? <FormControl>
                                <Input
                                    value={tableTime}
                                    onChange={(e) => setTableTime(parseFloat(e.target.value))}
                                    type="number"
                                    endAdornment={"天"}
                                />
                            </FormControl> : <ExpSelector
                                full={false}
                                setData={setTableTierToStop}
                                lock={true}
                                tier={tier} level={level} process={process}
                            />}
                            後吃果子
                        </Stack>
                    </Collapse>

                    <Stack p={!isMobile * 3} pt={3}
                           sx={{"div": {display: "flex", justifyContent: "space-between"}}}>
                        <Divider/>
                        {[{label: "萬妖果(紅)基礎修為:", value: redFruitList[tier]}, {
                            label: "靈氣球修為加成:", value: `*1.8 ${tableControl[2] ? "*1.5" : ""}`
                        }, {
                            label: "數量(每周):",
                            value: `9 ${tableControl[0] ? "+6" : ""} ${tableControl[1] ? "+6" : ""}`
                        }, {label: "靈湧機率:", value: `${tableChances[tableChance]}%`}, {
                            label: "期望修為:",
                            value: [0, 3].includes(tableType) ? `${formatNumber(tableSpeed)} / 周` : "請使用計算功能"
                        }].map(({label, value}) => (<>
                            <Box key={label}>
                                <Typography fontSize={isMobile ? "medium" : "x-large"}
                                            color={"textSecondary"}>{label}</Typography>
                                <Typography fontSize={isMobile ? "large" : "x-large"}
                                            color={"textSecondary"}>{value}</Typography>
                            </Box><Divider key={label + "-divider"}/>
                        </>))}
                    </Stack>
                </AccordionDetails>
                <AccordionActions>
                    *預設所有等級已升滿
                    *一次過吃的時候會消耗所有萬妖果（會益出修為），不會因為達成完滿而剩下果實
                </AccordionActions>
            </Accordion>
            <Accordion sx={{width: "100%"}}>
                <AccordionSummary
                    expandIcon={<ExpandMore/>}
                    sx={{"*": {color: "gold"}}}
                >
                    納靈石
                    <span>+{finalStone}</span>
                </AccordionSummary>

                <AccordionDetails>
                    <Stack direction={isMobile ? "column" : "row"} alignItems={"center"}
                           justifyContent={"space-around"} spacing={1}>

                        <FormControl sx={{width: isMobile ? "100%" : "50%"}}>
                            <InputLabel htmlFor={"stone-level-select"}>品質</InputLabel>
                            <Select
                                id={"stone-level-select"}
                                label={"品質"}
                                value={stoneLV}
                                onChange={(e) => setStoneLV(parseFloat(e.target.value))}
                                variant={"outlined"}
                                sx={{color: Object.values(stone)[stoneLV]}}
                            >
                                {Object.keys(stone).map((t, i) => <MenuItem sx={{color: stone[t]}} value={i}
                                                                            key={t}>{t}品</MenuItem>)}
                            </Select>
                        </FormControl>

                        <span>
                               +{speed * stoneEff[stoneLV] / 100} / 周天
                            </span>
                    </Stack>
                </AccordionDetails>
            </Accordion>


            <Accordion sx={{width: "100%"}}>
                <AccordionSummary
                    expandIcon={<ExpandMore/>}
                    sx={{"*": {color: "red"}}}
                >
                    至寶
                    <span>≈+{finalGod}</span>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack alignItems={"center"} justifyContent={"center"} direction={isMobile ? "column" : "row"}
                           spacing={2}>
                        {["星海瓶", "雙星鏡"].map((t, i) => <>
                            <Stack alignItems={"center"} width={"100%"} p={!isMobile * 3} spacing={1}>
                                <Checkbox
                                    checked={gods[i][0] >= 0}
                                    onChange={(e, v) => {
                                        let newGods = Array.from(gods);
                                        newGods[i][0] = v ? 0 : -1;
                                        if (i === 0 && v === false) {
                                            newGods[1][0] = -1;
                                        }
                                        if (i === 1 && v === true && gods[0][0] === -1) {
                                            newGods[0][0] = 0;
                                        }
                                        setGods(newGods);
                                    }}
                                />
                                {t}
                                <Rating
                                    disabled={gods[i][0] < 0}
                                    value={gods[i][0]}
                                    onChange={(e, v) => {
                                        let newGods = Array.from(gods);
                                        newGods[i][0] = v === null ? 0 : v;
                                        setGods(newGods);
                                    }}
                                    min={0}
                                />
                                <Stack direction={"row"} alignItems={"baseline"}>
                                    <Box sx={{width: 10, height: 10, backgroundColor: "red", borderRadius: 100}}/>
                                    x{godDay[i]} / 天
                                </Stack>

                                {!i ? <Input
                                    value={gods[i][1]}
                                    onChange={(e) => {
                                        let newGods = Array.from(gods);
                                        newGods[i][1] = parseFloat(e.target.value === "" ? 0 : e.target.value);
                                        setGods(newGods);
                                    }}
                                    endAdornment={"萬"}
                                    type={"number"}
                                    min={0}
                                    sx={{width: 80}}

                                /> : <FormControlLabel
                                    checked={gods[i][2]}
                                    control={<Checkbox size={"small"}/>} label={"幻化"}
                                    onChange={(e, v) => {
                                        let newGods = Array.from(gods);
                                        newGods[i][2] = v;
                                        setGods(newGods);
                                    }}
                                />}
                                <Typography color={"error"}>
                                    ≈+ {formatNumber(godSpeed[i])} / 天
                                </Typography>
                            </Stack>
                            <Divider flexItem orientation={isMobile ? "horizontal" : "vertical"}/>
                        </>)}
                        <Stack alignItems={"center"} width={"100%"} p={3}>
                            逆塵珠
                            WIP
                        </Stack>
                    </Stack>
                </AccordionDetails>
                <AccordionActions>
                    <FormControlLabel
                        checked={godDoubles}
                        control={<Checkbox/>}
                        label={"計算雙倍機會 (15%)"}
                        onChange={(e, v) => setGodDoubles(v)}
                    />
                </AccordionActions>
            </Accordion>

            <Accordion sx={{width: "100%"}}>
                <AccordionSummary
                    expandIcon={<ExpandMore/>}
                    sx={{"*": {color: "grey"}}}
                >
                    其他
                </AccordionSummary>
                <AccordionDetails>
                </AccordionDetails>
            </Accordion>
        </Box>

        <Stack spacing={1}>

            <Typography variant={isMobile ? "h6" : "h5"}>
                修煉速度: {Math.round(speed * 100) / 100} / 周天(8s)
            </Typography>
            <Typography variant="h6" sx={{ color: "lightblue" }}>
              自訂吸收率結果：{formatNumber(finalAdd)} 修練速度/周天
            </Typography>

            <Stack direction={isMobile ? "column" : "row"} justifyContent={"center"}>
                {formatNumber(finalSpeed)}
                <div style={{color: "lightgreen"}}>+{formatNumber(finalAdd)}</div>
                <div style={{color: "orange"}}>+{formatNumber(finalBreathe)}</div>
                <div style={{color: "magenta"}}>+{formatNumber(finalMed)}</div>
                <div style={{color: "lightblue"}}>+{formatNumber(finalTable)}</div>
                <div style={{color: "gold"}}>+{formatNumber(finalStone)}</div>
                <div style={{color: "red"}}>≈+{formatNumber(finalGod)}</div>
            </Stack>

            <Stack direction={isMobile ? "column" : "row"} justifyContent={"center"} alignItems={"center"}>
                當前境界
                <Typography variant={"h4"}>總修煉速度:</Typography>
                <Typography variant={"h4"}>
                    <AnimatedNumbers
                        animateToNumber={finalSpeed + finalAdd + finalBreathe + finalMed + finalStone + finalTable + finalGod}
                        includeComma
                        transitions={(index) => ({
                            type: "spring", duration: index / 10,
                        })}
                    />
                </Typography>
                <Typography variant={"h4"}> / 天</Typography>
                (估算)
            </Stack>

        </Stack>


        <Stack alignItems={"center"}>
            <FormGroup row>
                {chartLs.map((i, j) => <FormControlLabel
                    color={i[2]}
                    checked={cal[j]}
                    control={<Checkbox sx={{"svg": {color: i[2]}}}/>} label={i[1]}
                    onChange={(e, v) => {
                        let newCal = Array.from(cal);
                        newCal[j] = v;
                        setCal(newCal);
                    }}
                    key={i[0]}
                />)}
            </FormGroup>
        </Stack>
        <Stack direction={"row"} alignItems={"center"} spacing={2}>

            <ColorButton
                onClick={() => calc({tier, level, process, exp}, subProcess, thirdProcess)}
                variant="outlined"
                size={"large"}
                fullWidth
            >計算♡</ColorButton>

            <IconButton onClick={() => setStopSetDialog(true)}>
                <Settings/>

            </IconButton>
            <Dialog
                open={stopSetDialog}
                onClose={() => setStopSetDialog(false)}
                fullWidth
                maxWidth={"xs"}
            >
                <DialogTitle>停止模擬的時間</DialogTitle>
                <DialogContent>
                    <Accordion expanded={stopType === 0}>
                        <AccordionSummary onClick={() => setStopType(0)}>
                            <Stack direction={"row"} alignItems={"center"} spacing={1}>
                                <Checkbox checked={stopType === 0} sx={{p: 0}}/>
                                <Typography>到達後境界停止</Typography>
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                            <RadioGroup row value={stopLevel} onChange={(e, v) => setStopLevel(parseInt(v))}>
                                {Object.entries(buffs).map(([name, color], i) => <FormControlLabel
                                    value={i} sx={{color: color}} disabled={i > 0 ? dir !== 0 : false}
                                    control={<Radio size={"small"}/>}
                                    label={name} key={name}
                                />)}
                            </RadioGroup>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion expanded={stopType === 1}>
                        <AccordionSummary onClick={() => setStopType(1)}>
                            <Stack direction={"row"} alignItems={"center"} spacing={1}>
                                <Checkbox checked={stopType === 1} sx={{p: 0}}/>
                                <Typography>到達時間後停止</Typography>
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                            <OutlinedInput
                                endAdornment={"天"}
                                fullWidth
                                value={stopTime}
                                type={"number"}
                                onBlur={() => isNaN(stopTime) ? setStopTime(0) : null}
                                min={1}
                                onChange={e => setStopTime(parseFloat(e.target.value))}
                            />
                        </AccordionDetails>
                    </Accordion>
                </DialogContent>
            </Dialog>

            <Tooltip title={<Typography
                fontSize={"large"}>按下按鈕後會議極快的速度每一次達到圓滿的過程（以一週天作為基礎單位)</Typography>}
                     placement={"top"} arrow>
                <HelpOutline/>
            </Tooltip>
        </Stack>

        {record.length !== 0 && <DataDisplay
            final={final}
            fullTime={fullTime}
            counters={counters}
            record={record}
            stopType={stopType}
        />}

        <Accordion>
            <AccordionSummary expandIcon={<ExpandMore/>}>Logs</AccordionSummary>
            <AccordionDetails>
                {logs.map(i => <p key={i} style={{margin: 0}}>{i}</p>)}
            </AccordionDetails>
        </Accordion>


    </Stack>);
}
