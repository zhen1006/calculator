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
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
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
    Stack,
    styled,
    TextField,
    Typography
} from "@mui/material";
import { useState, useEffect } from "react";
import { ExpandMore, Settings } from "@mui/icons-material";
import { pink } from "@mui/material/colors";
import Grid from "@mui/material/Grid";
import AnimatedNumbers from "react-animated-numbers";
import { ExpSelector } from "../components/ExpSelector.jsx";
import { DataDisplay } from "../components/DataDisplay.jsx";
import {
    exps,
    tierList,
    effList,
    levelList,
    godBuff,
    godRegent,
    buffs,
    chartLs,
    breatheList,
    processList,
    STONE_SYSTEM,
    stoneQualityList,
    furnaceQualityList
} from "./../data/data.js";
import { timeString, formatNumber } from "../data/functions.js";
import _ from "lodash";
import SaveLoader from "../components/SaveLoader.jsx";
import { toast } from "react-toastify";

const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(pink[300]),
    backgroundColor: pink[300],
    '&:hover': {
        backgroundColor: pink[400],
    },
}));

export default function ExpCounter() {
    const [reload, setReload] = useState(Math.random());

    const save = (i, data = null) => {
        let saveList = data || {
            cal,
            tier,
            level,
            process,
            exp,
            othersAir,
            voidAir,
            prevBuff,
            currentBuff,
            breatheTime,
            breatheBuf,
            medAmount,
            medExp,
            stoneLevel,
            stoneQuality,
            stoneForgeEnabled,
            stoneForgeAbsorption,
            stoneForgeMultiplierEnabled,
            stoneForgeMultiplier,
            stoneSealEnabled,
            furnaceEnabled,
            furnaceQuality,
            furnaceForge1Enabled,
            furnaceForge1Percent,
            furnaceForge2Enabled,
            furnaceForge2Multiplier,
            gods,
            mirrorDouble,
            starSeaConversion,
            dir,
            subProcess,
            thirdProcess,
            fenqiEnabled,
            fenqiBonus,
            yaojieEnabled,
            yaojieBonus,
            wanjieTianyuanEnabled,
            wanjieTianyuanBonus,
            nichenzhuEnabled,
            nichenzhuStars,
            nichenzhuTransform,
            customBreatheBase,
            customBreatheValue,
        };
        localStorage.setItem(`data ${i}`, JSON.stringify(saveList));
        toast.success("Saved!")
    };

    const load = (i) => {
        try {
            const raw = localStorage.getItem(`data ${i}`);
            if (!raw) {
                toast.error('存檔不存在');
                return;
            }
            const data = JSON.parse(raw);
            const defaultState = {
                cal: [true, true, true, true, true, true, true],
                tier: 4,
                level: 0,
                process: 0,
                exp: 0,
                othersAir: 0,
                voidAir: 0,
                prevBuff: 0,
                currentBuff: 0,
                breatheTime: 0,
                breatheBuf: 100,
                medAmount: [0,0,0,0,0,0],
                medExp: [0,0,0,0,0,0],
                stoneLevel: 6,
                stoneQuality: 3,
                stoneForgeEnabled: false,
                stoneForgeAbsorption: 4.5,
                stoneForgeMultiplierEnabled: false,
                stoneForgeMultiplier: 1.15,
                stoneSealEnabled: false,
                furnaceEnabled: false,
                furnaceQuality: 3,
                furnaceForge1Enabled: false,
                furnaceForge1Percent: 6.75,
                furnaceForge2Enabled: false,
                furnaceForge2Multiplier: 1.18,
                gods: [[-1,0], [-1,0,false]],
                mirrorDouble: true,
                starSeaConversion: 0,
                dir: 0,
                subProcess: { tier: 4, level: 0, process: 0, exp: 0 },
                thirdProcess: { tier: 4, level: 0, process: 0, exp: 0 },
                fenqiEnabled: false,
                fenqiBonus: 0,
                yaojieEnabled: false,
                yaojieBonus: 0,
                wanjieTianyuanEnabled: false,
                wanjieTianyuanBonus: 0,
                nichenzhuEnabled: false,
                nichenzhuStars: 0,
                nichenzhuTransform: false,
                customBreatheBase: false,
                customBreatheValue: 0,
                customEffective: false,
            };
            const merged = { ...defaultState, ...data };
            const setters = {
                cal: setCal,
                tier: setTier,
                level: setLevel,
                process: setProcess,
                exp: setExp,
                othersAir: setOthersAir,
                voidAir: setVoidAir,
                prevBuff: setPrevBuff,
                currentBuff: setCurrentBuff,
                breatheTime: setBreatheTime,
                breatheBuf: setBreatheBuf,
                medAmount: setMedAmount,
                medExp: setMedExp,
                stoneLevel: setStoneLevel,
                stoneQuality: setStoneQuality,
                stoneForgeEnabled: setStoneForgeEnabled,
                stoneForgeAbsorption: setStoneForgeAbsorption,
                stoneForgeMultiplierEnabled: setStoneForgeMultiplierEnabled,
                stoneForgeMultiplier: setStoneForgeMultiplier,
                stoneSealEnabled: setStoneSealEnabled,
                furnaceEnabled: setFurnaceEnabled,
                furnaceQuality: setFurnaceQuality,
                furnaceForge1Enabled: setFurnaceForge1Enabled,
                furnaceForge1Percent: setFurnaceForge1Percent,
                furnaceForge2Enabled: setFurnaceForge2Enabled,
                furnaceForge2Multiplier: setFurnaceForge2Multiplier,
                gods: setGods,
                mirrorDouble: setMirrorDouble,
                starSeaConversion: setStarSeaConversion,
                dir: setDir,
                subProcess: setSubProcess,
                thirdProcess: setThirdProcess,
                fenqiEnabled: setFenqiEnabled,
                fenqiBonus: setFenqiBonus,
                yaojieEnabled: setYaojieEnabled,
                yaojieBonus: setYaojieBonus,
                wanjieTianyuanEnabled: setWanjieTianyuanEnabled,
                wanjieTianyuanBonus: setWanjieTianyuanBonus,
                nichenzhuEnabled: setNichenzhuEnabled,
                nichenzhuStars: setNichenzhuStars,
                nichenzhuTransform: setNichenzhuTransform,
                customBreatheBase: setCustomBreatheBase,
                customBreatheValue: setCustomBreatheValue,
                customEffective: setCustomEffective,
            };
            Object.entries(setters).forEach(([key, setter]) => {
                if (merged[key] !== undefined) {
                    setter(merged[key]);
                }
            });
            toast.success("讀取成功！");
        } catch (error) {
            console.error('讀取存檔失敗：', error);
            toast.error('存檔資料損毀或版本不相容，請刪除或重新存檔。');
        }
    };

    const checkIsPerfect = (tier, level, process, exp) => {
        if (level !== 2) return false;
        const tierExpData = exps[tier]?.[2];
        if (!tierExpData) return false;
        const totalExp = tierExpData.reduce((a, b) => a + b, 0);
        const currentExp = tierExpData.slice(0, process).reduce((a, b) => a + b, 0) + exp;
        return currentExp >= totalExp;
    };

    const getCultivationPhase = (level) => {
        if (level === 3) return '圓滿';
        return levelList[level] || '前期';
    };

    const calculatePrevBuffBonus = (prevBuff, mainLevel) => {
        if (prevBuff === 0 || prevBuff === 1) return 0;
        if (prevBuff === 2) {
            if (mainLevel === 0) return 20;
            return 0;
        }
        if (prevBuff === 3) {
            if (mainLevel === 0 || mainLevel === 1) return 40;
            return 0;
        }
        return 0;
    };

    const calculateCurrentBuffBonus = (currentBuff, mainTier, mainLevel, mainProcess, mainExp, subTier, subLevel, subProcess, subExp) => {
        if (currentBuff === 0) return 0;
        const mainIsPerfect = checkIsPerfect(mainTier, mainLevel, mainProcess, mainExp);
        if (!mainIsPerfect) return 0;
        if (currentBuff === 1) {
            if (subTier === mainTier - 1 && subLevel >= 1) return 20;
            return 0;
        }
        if (currentBuff === 2) {
            if (subTier === mainTier && subLevel < 3) return 20;
            return 0;
        }
        if (currentBuff === 3) {
            if (subTier === mainTier && subLevel === 3 && checkIsPerfect(subTier, subLevel, subProcess, subExp)) return 40;
            return 0;
        }
        return 0;
    };

    const calc = (mainP, subP = {}, thirdP = {}) => {
        let log = new Set();
        let vd = 0;
        let records = [];
        let sum = {
            base: 0,
            extra: 0,
            breathe: 0,
            med: 0,
            stone: 0,
            god: 0,
        };
        let godEnergy = [0, 0];
        let chargeTime = 0;
        let counter = {
            breathe: 0,
            med: [0, 0, 0, 0, 0, 0],
            chance: 0,
            doubles: 0,
            eat: 0,
        }
        let reachDays = {};
        let gods1 = JSON.parse(JSON.stringify(gods));
        let gains = 0;
        if (!cal[6]) {
            gods1[0][0] = -1;
            gods1[1][0] = -1;
        }
        let PS = [_.clone(mainP), _.clone(subP), _.clone(thirdP)];
        let now = dir;
        let purpleFurnaceSpeed = 0;
        if (furnaceEnabled) {
            const quality = furnaceQualityList[furnaceQuality] || 0;
            const forge1 = furnaceForge1Enabled ? furnaceForge1Percent / 100 : 0;
            const forge2 = furnaceForge2Enabled ? furnaceForge2Multiplier : 1;
            const totalBonus = (quality + forge1) * forge2;
            purpleFurnaceSpeed = speed * totalBonus;
        }
        let nichenzhuEnergy = nichenzhuEnabled ? nichenzhuConfig[nichenzhuStars].maxEnergy : 0;
        let nichenzhuTotalGain = 0;
        let nichenzhuUseCount = 0;
        let dailyNichenzhuUses = {};

        let conversionFactor = 1;
        if (starSeaConversion === 1) conversionFactor = 0.8;
        else if (starSeaConversion === 2) conversionFactor = 0.95;
        const starSeaCost = 100
            * (gods1[0][0] === 5 ? 0.85 : 1)
            * conversionFactor;

        const nichenzhuRegenPerInterval = nichenzhuEnabled ? nichenzhuConfig[nichenzhuStars].regenPerInterval : 0;
        const nichenzhuEnergyCost = nichenzhuEnabled ? nichenzhuConfig[nichenzhuStars].energyCost : 10;
        const nichenzhuZhouTian = nichenzhuEnabled ? nichenzhuConfig[nichenzhuStars].zhouTian : 100;

        const baseAbsorption = STONE_SYSTEM.types[stoneLevel]?.absorption || 0;
        const qualityBonus = stoneSealEnabled ? (stoneQualityList[stoneQuality] || 0) : 0;
        const forge1Bonus = stoneForgeEnabled ? stoneForgeAbsorption / 100 : 0;
        const forge2Multiplier = stoneForgeMultiplierEnabled ? stoneForgeMultiplier : 1;
        const stoneMultiplier = (baseAbsorption + forge1Bonus) * forge2Multiplier * (1 + qualityBonus);

        while (true) {
            vd += 1;
            chargeTime += 8;
            if (chargeTime >= 900) {
                chargeTime -= 900;
                if (gods1[0][0] >= 0) godEnergy[0] += godRegent[gods1[0][0]] || 0;
                if (gods1[1][0] >= 0) godEnergy[1] += godRegent[gods1[1][0]] || 0;
                if (nichenzhuEnabled) {
                    nichenzhuEnergy = Math.min(nichenzhuConfig[nichenzhuStars].maxEnergy, nichenzhuEnergy + nichenzhuRegenPerInterval);
                }
            }
            let calcAir = PS[0]?.tier === 1 ? voidAir : othersAir;
            const effSpeed = customEffective === false ? (effList[PS[0]?.tier]?.[PS[0]?.level] || 0) : customEffective;
            let fenqiMult = 1;
            if (fenqiEnabled && fenqiBonus > 0) {
                fenqiMult = 1 + (fenqiBonus / 100);
            }
            let wanjieMult = 1;
            if (wanjieTianyuanEnabled && wanjieTianyuanBonus > 0) {
                wanjieMult = 1 + (wanjieTianyuanBonus / 100);
            }
            let yaojieMult = 1;
            if (yaojieEnabled && yaojieBonus > 0) {
                yaojieMult = 1 + (yaojieBonus / 100);
            }
            const totalMult = fenqiMult * wanjieMult * yaojieMult;
            const prevBuffBonusInner = calculatePrevBuffBonus(prevBuff, PS[0]?.level);
            const currentBuffBonusInner = calculateCurrentBuffBonus(
                currentBuff,
                PS[0]?.tier,
                PS[0]?.level,
                PS[0]?.process,
                PS[0]?.exp,
                PS[1]?.tier,
                PS[1]?.level,
                PS[1]?.process,
                PS[1]?.exp
            );
            const totalPerfectionBonusInner = prevBuffBonusInner + currentBuffBonusInner;
            const speed1 = calcAir * (effSpeed / 100) * totalMult * cal[0];
            const extra = calcAir * (totalPerfectionBonusInner / 100) * totalMult * cal[1];

            if (furnaceEnabled) {
                PS[1].exp += purpleFurnaceSpeed;
            }
            if (vd % 10800 === 0) {
                if (gods1[0][0] >= 0) godEnergy[0] += 100;
                if (gods1[1][0] >= 0) godEnergy[1] += 200;
                counter.chance += !(gods1[0][0] < 0) * 30 + !(gods1[1][0] < 0) * 30;

                while (godEnergy[0] >= starSeaCost) {
                    godEnergy[0] -= starSeaCost;
                    sum.god += gods1[0][1] * 10000;
                    gains += gods1[0][1] * 10000;
                }

                let useEnergy = (200 - 200 * (godBuff[1][gods1[1][0]] + gods1[1][2] * 10) / 100);
                while (godEnergy[1] >= useEnergy) {
                    if (!(Math.random() < 0.15 && mirrorDouble && gods1[1][0] === 5)) {
                        godEnergy[1] -= useEnergy;
                    }
                    sum.god += gods1[1][1] * 10000;
                    gains += gods1[1][1] * 10000;
                    counter.doubles += 1;
                }

                const stoneDaily = (speed1 + extra) * stoneMultiplier * 10800 * cal[5];
                gains += stoneDaily;
                sum.stone += stoneDaily;

                if (nichenzhuEnabled) {
                    const maxDailyUses = 20;
                    const currentDay = Math.floor(vd / 10800);
                    dailyNichenzhuUses[currentDay] = 0;
                    if (nichenzhuEnergy >= nichenzhuEnergyCost) {
                        const availableUses = Math.floor(nichenzhuEnergy / nichenzhuEnergyCost);
                        const remainingDailyUses = maxDailyUses - (dailyNichenzhuUses[currentDay] || 0);
                        const actualUses = Math.min(availableUses, remainingDailyUses);
                        if (actualUses > 0) {
                            const calcAirForNichen = PS[0]?.tier === 1 ? voidAir : othersAir;
                            const effSpeedForNichen = customEffective === false ? (effList[PS[0]?.tier]?.[PS[0]?.level] || 0) : customEffective;
                            const prevBuffBonusInnerN = calculatePrevBuffBonus(prevBuff, PS[0]?.level);
                            const currentBuffBonusInnerN = calculateCurrentBuffBonus(
                                currentBuff,
                                PS[0]?.tier,
                                PS[0]?.level,
                                PS[0]?.process,
                                PS[0]?.exp,
                                PS[1]?.tier,
                                PS[1]?.level,
                                PS[1]?.process,
                                PS[1]?.exp
                            );
                            const totalPerfectionBonusInnerN = prevBuffBonusInnerN + currentBuffBonusInnerN;
                            const baseSpeedForNichen = calcAirForNichen * ((effSpeedForNichen + totalPerfectionBonusInnerN) / 100);
                            const furnaceBonus = furnaceEnabled ? (() => {
                                const quality = furnaceQualityList[furnaceQuality] || 0;
                                const forge1 = furnaceForge1Enabled ? furnaceForge1Percent / 100 : 0;
                                const forge2 = furnaceForge2Enabled ? furnaceForge2Multiplier : 1;
                                return (quality + forge1) * forge2;
                            })() : 0;
                            const nichenzhuGainPerUse = baseSpeedForNichen * (1 + furnaceBonus) * nichenzhuZhouTian;
                            const totalGain = actualUses * nichenzhuGainPerUse;
                            nichenzhuEnergy -= actualUses * nichenzhuEnergyCost;
                            nichenzhuUseCount += actualUses;
                            PS[1].exp += totalGain;
                            nichenzhuTotalGain += totalGain;
                            dailyNichenzhuUses[currentDay] = (dailyNichenzhuUses[currentDay] || 0) + actualUses;
                            log.add(`${timeString(vd * 8)}: 逆塵珠使用 ${actualUses} 次，獲得 ${formatNumber(totalGain)} 修為（${nichenzhuZhouTian}周天/次）`);
                        }
                    }
                }

                const breatheSpeedNow = breatheSpeed;
                gains += breatheSpeedNow;
                sum.breathe += breatheSpeedNow;
                counter.breathe += breatheTime;

                [...Array(5).keys()].forEach((i) => {
                    let med = cal[3] * medExp[i] * medAmount[i] * 10000;
                    gains += med;
                    sum.med += med;
                    counter.med[i] += cal[3] * medAmount[i];
                })

                if (gains <= 0) {
                    alert(`到達${tierList[PS[now].tier]}${levelList[PS[now].level]}${PS[now].process}重時修煉速度為0, 不可繼續`);
                    break;
                }
                records.push(sum);
                sum = {
                    base: 0,
                    extra: 0,
                    breathe: 0,
                    med: 0,
                    stone: 0,
                    god: 0
                };
            }
            gains += speed1 + extra;
            sum.base += speed1;
            sum.extra += extra;

            if (PS[now].level < 3) {
                const currentLevelExps = exps[PS[now].tier][PS[now].level];
                if (PS[now].exp >= currentLevelExps[PS[now].process]) {
                    PS[now].exp -= currentLevelExps[PS[now].process];
                    PS[now].process += 1;
                    log.add(`${timeString(vd * 8)} (${Math.round(vd / 112.5 * 1000) / 1000}): ${processList[now]}${tierList[PS[now].tier]}${levelList[PS[now].level]}${PS[now].process + 1}重`)
                    reachDays[Math.ceil(vd / 10800 + 1).toString()] = `${processList[now]}${levelList[PS[now].level]}${PS[now].process + 1}重`
                }
                if (PS[now].process >= exps[PS[now].tier][PS[now].level].length) {
                    PS[now].process = 0;
                    PS[now].level += 1;
                    log.add(`${timeString(vd * 8)} (${Math.round(vd / 112.5 * 1000) / 1000}): ${processList[now]}${tierList[PS[now].tier]}${levelList[PS[now].level]}`)
                }
            }

            if (stopType === 1 && Math.floor(vd / 10800) >= stopTime) {
                const actualDays = Math.floor(vd / 10800);
                log.add(`到達設定的 ${stopTime} 天后停止（實際：${actualDays} 天）`);
                break;
            }
            if (stopType === 0) {
                if (!dir) {
                    if (now !== 0 && PS[now].level >= 3 && PS[now].tier < PS[0].tier) {
                        PS[now].tier += 1;
                        PS[now].level = 0;
                    }
                    if (PS[now].level >= 3) {
                        log.add("抵達圓滿");
                        if (stopLevel === 0) break;
                    }
                    if (now === 1 && (
                        PS[now].tier > PS[0].tier - 1 ||
                        (
                            PS[now].tier === PS[0].tier - 1 &&
                            PS[now].level >= 1
                        )
                    )) {
                        log.add("抵達大成, 吸收率+20%");
                        if (stopLevel === 1) break;
                    }
                    if (now === 1 && (
                        PS[now].tier >= PS[0].tier
                    )) {
                        log.add("抵達完美");
                        if (stopLevel === 2) break;
                    }
                    if (now === 1 && (
                        PS[now].tier >= PS[0].tier &&
                        PS[now].level >= 3
                    )) {
                        log.add("抵達半步, 吸收率+40%");
                        if (stopLevel === 3) break;
                    }
                    if (now === 2 && (
                        PS[now].tier >= PS[0].tier &&
                        PS[now].level >= 3
                    )) {
                        log.add("抵達準");
                        break;
                    }
                    if (PS[now].level >= 3 && now === 0) {
                        log.add("開始修練輔修");
                        now = 1;
                    }
                    if (PS[now].level >= 3 && now === 1) {
                        log.add("開始修練三修");
                        now = 2;
                    }
                } else {
                    if (PS[now].level >= 3) {
                        console.log("抵達圓滿");
                        break;
                    }
                }
            }

            gains = 0;
        }

        const calculateLevelPercentage = (tier, level, process, exp) => {
            if (level === 3) return 100;
            const levelExpData = exps[tier]?.[level];
            if (!levelExpData || levelExpData.length === 0) return 0;
            const totalExpForLevel = levelExpData.reduce((a, b) => a + b, 0);
            const accumulatedExp = levelExpData.slice(0, process).reduce((a, b) => a + b, 0) + exp;
            return Math.min(100, (accumulatedExp / totalExpForLevel) * 100);
        };

        const finalResults = {
            main: {
                tier: PS[0].tier,
                level: PS[0].level,
                process: PS[0].process,
                exp: PS[0].exp,
                percentage: calculateLevelPercentage(PS[0].tier, PS[0].level, PS[0].process, PS[0].exp)
            },
            sub: {
                tier: PS[1].tier,
                level: PS[1].level,
                process: PS[1].process,
                exp: PS[1].exp,
                percentage: calculateLevelPercentage(PS[1].tier, PS[1].level, PS[1].process, PS[1].exp)
            },
            third: {
                tier: PS[2].tier,
                level: PS[2].level,
                process: PS[2].process,
                exp: PS[2].exp,
                percentage: calculateLevelPercentage(PS[2].tier, PS[2].level, PS[2].process, PS[2].exp)
            }
        };
        setFinalResults(finalResults);
        setLogs(Array.from(log));
        setFullTime(vd);
        setRecord(records);
        counter.reachDays = reachDays;
        setCounters(counter);
        setFinal({ t: PS[0].tier, l: PS[0].level, p: PS[0].process, e: PS[0].exp, type: stopType, stopLevel: stopLevel });
        return vd;
    };

    const isMobile = window.mobileCheck();

    const [cal, setCal] = useState([true, true, true, true, true, true, true]);
    const [tier, setTier] = useState(4);
    const [level, setLevel] = useState(0);
    const [process, setProcess] = useState(0);
    const [exp, setExp] = useState(0);
    const [othersAir, setOthersAir] = useState(0);
    const [voidAir, setVoidAir] = useState(0);
    const [prevBuff, setPrevBuff] = useState(0);
    const [currentBuff, setCurrentBuff] = useState(0);
    const [breatheTime, setBreatheTime] = useState(0);
    const [breatheBuf, setBreatheBuf] = useState(100);
    const [medAmount, setMedAmount] = useState([0, 0, 0, 0, 0, 0]);
    const [medExp, setMedExp] = useState([0, 0, 0, 0, 0, 0]);
    const [stoneLevel, setStoneLevel] = useState(6);
    const [stoneQuality, setStoneQuality] = useState(3);
    const [stoneForgeEnabled, setStoneForgeEnabled] = useState(false);
    const [stoneForgeAbsorption, setStoneForgeAbsorption] = useState(4.5);
    const [stoneForgeMultiplierEnabled, setStoneForgeMultiplierEnabled] = useState(false);
    const [stoneForgeMultiplier, setStoneForgeMultiplier] = useState(1.15);
    const [stoneSealEnabled, setStoneSealEnabled] = useState(false);
    const [furnaceEnabled, setFurnaceEnabled] = useState(false);
    const [furnaceQuality, setFurnaceQuality] = useState(3);
    const [furnaceForge1Enabled, setFurnaceForge1Enabled] = useState(false);
    const [furnaceForge1Percent, setFurnaceForge1Percent] = useState(6.75);
    const [furnaceForge2Enabled, setFurnaceForge2Enabled] = useState(false);
    const [furnaceForge2Multiplier, setFurnaceForge2Multiplier] = useState(1.18);
    const [nichenzhuEnabled, setNichenzhuEnabled] = useState(false);
    const [nichenzhuStars, setNichenzhuStars] = useState(0);
    const [nichenzhuTransform, setNichenzhuTransform] = useState(false);
    const [nichenzhuDailyGain, setNichenzhuDailyGain] = useState(0);
    const [nichenzhuDailyUses, setNichenzhuDailyUses] = useState(0);
    const [nichenzhuEnergyCost, setNichenzhuEnergyCost] = useState(10);
    const [nichenzhuEnergyMax, setNichenzhuEnergyMax] = useState(200);
    const [nichenzhuRecoveryRate, setNichenzhuRecoveryRate] = useState(0);

    const [customBreatheBase, setCustomBreatheBase] = useState(false);
    const [customBreatheValue, setCustomBreatheValue] = useState(0);

    const [gods, setGods] = useState([
        [-1, 0],
        [-1, 0, false]
    ]);
    const [mirrorDouble, setMirrorDouble] = useState(true);
    const [starSeaConversion, setStarSeaConversion] = useState(0);

    const nichenzhuConfig = {
        0: { maxEnergy: 200, regenPerInterval: 1.0, energyCost: 10, zhouTian: 100 },
        1: { maxEnergy: 300, regenPerInterval: 1.3, energyCost: 10, zhouTian: 120 },
        2: { maxEnergy: 400, regenPerInterval: 1.6, energyCost: 10, zhouTian: 120 },
        3: { maxEnergy: 500, regenPerInterval: 2.0, energyCost: 10, zhouTian: 120 },
        4: { maxEnergy: 600, regenPerInterval: 2.4, energyCost: 10, zhouTian: 120 },
        5: { maxEnergy: 700, regenPerInterval: 3.0, energyCost: 9, zhouTian: 120 }
    };

    const [fenqiEnabled, setFenqiEnabled] = useState(false);
    const [fenqiBonus, setFenqiBonus] = useState(0);
    const [yaojieEnabled, setYaojieEnabled] = useState(false);
    const [yaojieBonus, setYaojieBonus] = useState(0);
    const [wanjieTianyuanEnabled, setWanjieTianyuanEnabled] = useState(false);
    const [wanjieTianyuanBonus, setWanjieTianyuanBonus] = useState(0);
    const [customEffective, setCustomEffective] = useState(false);
    const [subProcess, setSubProcess] = useState({
        tier: 4,
        level: 0,
        process: 0,
        exp: 0
    });
    const [thirdProcess, setThirdProcess] = useState({
        tier: 4,
        level: 0,
        process: 0,
        exp: 0
    });
    const [dir, setDir] = useState(0);
    const [fullTime, setFullTime] = useState(0);

    const air = tier === 1 ? voidAir : othersAir;
    const effectiveSpeed = customEffective === false ? effList[tier][level] : customEffective;
    const isMainPerfect = checkIsPerfect(tier, level, process, exp);

    const prevBuffBonus = calculatePrevBuffBonus(prevBuff, level);
    const currentBuffBonus = calculateCurrentBuffBonus(
        currentBuff,
        tier,
        level,
        process,
        exp,
        subProcess.tier,
        subProcess.level,
        subProcess.process,
        subProcess.exp
    );
    const totalPerfectionBonus = prevBuffBonus + currentBuffBonus;

    let fenqiMultiplier = 1;
    if (fenqiEnabled && fenqiBonus > 0) fenqiMultiplier = 1 + (fenqiBonus / 100);
    let yaojieMultiplier = 1;
    if (yaojieEnabled && yaojieBonus > 0) yaojieMultiplier = 1 + (yaojieBonus / 100);
    let wanjieMultiplier = 1;
    if (wanjieTianyuanEnabled && wanjieTianyuanBonus > 0) wanjieMultiplier = 1 + (wanjieTianyuanBonus / 100);
    const totalMultiplier = fenqiMultiplier * wanjieMultiplier * yaojieMultiplier;
    const baseEfficiency = effectiveSpeed + totalPerfectionBonus;
    const finalEfficiency = baseEfficiency * totalMultiplier;
    const speed = air * (finalEfficiency / 100);
    const baseSpeed = air * (effectiveSpeed * totalMultiplier / 100);
    const extraSpeed = air * (totalPerfectionBonus * totalMultiplier / 100);

    const breatheBase = customBreatheBase ? customBreatheValue : breatheList[tier][0];
    const breatheSpeed = cal[2] ? (customBreatheBase ? customBreatheValue : breatheBase * breatheBuf / 100 * breatheTime * 1.9) : 0;

    const medSpeed = cal[3] * medAmount.slice(0, 6).reduce((acc, _, i) => acc + medAmount[i] * medExp[i] * 10000, 0);

    let conversionFactor = 1;
    if (starSeaConversion === 1) conversionFactor = 0.8;
    else if (starSeaConversion === 2) conversionFactor = 0.95;
    const starSeaCost = 100
        * (gods[0][0] === 5 ? 0.85 : 1)
        * conversionFactor;
    const starSeaRecovery = 96 * godRegent[gods[0][0]] + 100;
    const starSeaTimes = cal[6] ? starSeaRecovery / starSeaCost : 0;
    const godSpeed0 = starSeaTimes * gods[0][1] * 10000;

    const useEnergy = (200 - 200 * (godBuff[1][gods[1][0]] + gods[1][2] * 10) / 100);
    const mirrorRecovery = 96 * godRegent[gods[1][0]] + 200;
    const mirrorTimes = cal[6] ? mirrorRecovery / useEnergy : 0;
    const mirrorEffectiveTimes = mirrorTimes * (1 + (mirrorDouble && gods[1][0] === 5 ? 0.15 : 0));
    const godSpeed1 = mirrorEffectiveTimes * gods[1][1] * 10000;
    const godSpeed = [godSpeed0, godSpeed1];

    const baseAbsorptionDisplay = STONE_SYSTEM.types[stoneLevel]?.absorption || 0;
    const qualityBonusDisplay = stoneSealEnabled ? (stoneQualityList[stoneQuality] || 0) : 0;
    const forge1BonusDisplay = stoneForgeEnabled ? stoneForgeAbsorption / 100 : 0;
    const forge2MultiplierDisplay = stoneForgeMultiplierEnabled ? stoneForgeMultiplier : 1;
    const stoneMultiplierDisplay = (baseAbsorptionDisplay + forge1BonusDisplay) * forge2MultiplierDisplay * (1 + qualityBonusDisplay);
    const zhouTian = air * (finalEfficiency / 100);
    const stoneSpeedPerDay = zhouTian * stoneMultiplierDisplay * 10800 * cal[5];

    const furnaceQualityBonus = furnaceQualityList[furnaceQuality] || 0;
    const furnaceForge1 = furnaceForge1Enabled ? furnaceForge1Percent / 100 : 0;
    const furnaceForge2 = furnaceForge2Enabled ? furnaceForge2Multiplier : 1;
    const furnaceTotalBonus = (furnaceQualityBonus + furnaceForge1) * furnaceForge2;
    const purpleFurnaceSpeedDisplay = furnaceEnabled ? Math.round(speed * furnaceTotalBonus * 100) / 100 : 0;

    const nichenBaseSpeed = air * ((effectiveSpeed + totalPerfectionBonus) / 100);
    const nichenGainPerUse = nichenBaseSpeed * (1 + furnaceTotalBonus) * (nichenzhuStars >= 1 ? 120 : 100);

    const baseSpeedPerDay = baseSpeed * 10800;
    const extraSpeedPerDay = extraSpeed * 10800;
    const breatheSpeedPerDay = breatheSpeed;
    const medSpeedPerDay = medSpeed;
    const godSpeedPerDay = godSpeed.reduce((a, b) => a + b);
    const totalSpeedPerDay = baseSpeedPerDay + extraSpeedPerDay + breatheSpeedPerDay + medSpeedPerDay + stoneSpeedPerDay + godSpeedPerDay;

    useEffect(() => {
        if (nichenzhuEnabled) {
            const config = nichenzhuConfig[nichenzhuStars];
            let energyCost = config.energyCost;
            if (nichenzhuTransform) energyCost = Math.max(8, energyCost - 1);
            const dailyRecovery = config.regenPerInterval * 96 + 100;
            const dailyUses = Math.floor(dailyRecovery / energyCost);
            setNichenzhuEnergyCost(energyCost);
            setNichenzhuEnergyMax(config.maxEnergy);
            setNichenzhuRecoveryRate(dailyRecovery);
            setNichenzhuDailyUses(dailyUses);
            const dailyGain = nichenGainPerUse * dailyUses;
            setNichenzhuDailyGain(dailyGain);
        } else {
            setNichenzhuEnergyCost(10);
            setNichenzhuEnergyMax(200);
            setNichenzhuRecoveryRate(0);
            setNichenzhuDailyUses(0);
            setNichenzhuDailyGain(0);
        }
    }, [nichenzhuEnabled, nichenzhuStars, nichenzhuTransform, nichenGainPerUse]);

    const [logs, setLogs] = useState([]);
    const [record, setRecord] = useState([]);
    const [counters, setCounters] = useState({
        breathe: 0,
        med: [0, 0, 0, 0, 0, 0],
        chance: 0,
        eat: 0,
        doubles: 0
    });
    const [final, setFinal] = useState(null);
    const [finalResults, setFinalResults] = useState(null);
    const [stopSetDialog, setStopSetDialog] = useState(false);
    const [stopType, setStopType] = useState(0);
    const [stopLevel, setStopLevel] = useState(0);
    const [stopTime, setStopTime] = useState(30);

    const ResultsPanel = ({ results }) => {
        if (!results) return null;

        const formatCultivationInfo = (cultivation) => {
            const isMaxLevel = cultivation.level === 3;
            if (isMaxLevel) {
                return {
                    levelDisplay: "後期",
                    processDisplay: 20,
                    percentageDisplay: "100%(圓滿)",
                    isMaxLevel: true
                };
            }
            const tierExpData = exps[cultivation.tier];
            if (!tierExpData || cultivation.level >= tierExpData.length) {
                return {
                    levelDisplay: levelList[cultivation.level] || "未知",
                    processDisplay: cultivation.process + 1,
                    percentageDisplay: `${formatNumber(0)}%`,
                    isMaxLevel: false
                };
            }
            const levelExpData = tierExpData[cultivation.level];
            if (!levelExpData || levelExpData.length === 0) {
                return {
                    levelDisplay: levelList[cultivation.level] || "未知",
                    processDisplay: cultivation.process + 1,
                    percentageDisplay: `${formatNumber(0)}%`,
                    isMaxLevel: false
                };
            }
            const totalExpForLevel = levelExpData.reduce((a, b) => a + b, 0);
            const accumulatedExp = levelExpData.slice(0, cultivation.process).reduce((a, b) => a + b, 0) + cultivation.exp;
            const percentage = Math.min(100, (accumulatedExp / totalExpForLevel) * 100);
            let actualProcessDisplay = 1;
            let currentExp = 0;
            for (let i = 0; i < levelExpData.length; i++) {
                currentExp += levelExpData[i];
                if (accumulatedExp <= currentExp) {
                    actualProcessDisplay = i + 1;
                    break;
                }
            }
            return {
                levelDisplay: levelList[cultivation.level] || "未知",
                processDisplay: actualProcessDisplay,
                percentageDisplay: `${formatNumber(percentage)}%`,
                isMaxLevel: false
            };
        };

        const mainInfo = formatCultivationInfo(results.main);
        const subInfo = formatCultivationInfo(results.sub);
        const thirdInfo = formatCultivationInfo(results.third);

        return (
            <Card sx={{ mt: 2, p: 2, backgroundColor: 'rgba(0,0,0,0.1)' }}>
                <Typography variant="h6" gutterBottom>
                    計算結果 - 境界進度
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <Card variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="subtitle1" color="primary" gutterBottom>主修進度</Typography>
                            <Stack spacing={1}>
                                <Typography>境界: {tierList[results.main.tier]}</Typography>
                                <Typography>階段: {mainInfo.levelDisplay}</Typography>
                                <Typography>重數: {mainInfo.processDisplay}重</Typography>
                                <Typography>進度: {mainInfo.percentageDisplay}</Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={mainInfo.isMaxLevel ? 100 : parseFloat(mainInfo.percentageDisplay)}
                                    sx={{ mt: 1, height: 10, borderRadius: 5, backgroundColor: mainInfo.isMaxLevel ? 'success.main' : 'primary.main' }}
                                />
                                {mainInfo.isMaxLevel && <Typography variant="caption" color="success.main" sx={{ fontStyle: 'italic' }}>🎉 已達圓滿境界</Typography>}
                            </Stack>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="subtitle1" color="secondary" gutterBottom>輔修進度</Typography>
                            <Stack spacing={1}>
                                <Typography>境界: {tierList[results.sub.tier]}</Typography>
                                <Typography>階段: {subInfo.levelDisplay}</Typography>
                                <Typography>重數: {subInfo.processDisplay}重</Typography>
                                <Typography>進度: {subInfo.percentageDisplay}</Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={subInfo.isMaxLevel ? 100 : parseFloat(subInfo.percentageDisplay)}
                                    sx={{ mt: 1, height: 10, borderRadius: 5, backgroundColor: subInfo.isMaxLevel ? 'success.main' : 'secondary.main' }}
                                />
                                {subInfo.isMaxLevel && <Typography variant="caption" color="success.main" sx={{ fontStyle: 'italic' }}>🎉 已達圓滿境界</Typography>}
                            </Stack>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="subtitle1" color="warning.main" gutterBottom>三修進度</Typography>
                            <Stack spacing={1}>
                                <Typography>境界: {tierList[results.third.tier]}</Typography>
                                <Typography>階段: {thirdInfo.levelDisplay}</Typography>
                                <Typography>重數: {thirdInfo.processDisplay}重</Typography>
                                <Typography>進度: {thirdInfo.percentageDisplay}</Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={thirdInfo.isMaxLevel ? 100 : parseFloat(thirdInfo.percentageDisplay)}
                                    sx={{ mt: 1, height: 10, borderRadius: 5, backgroundColor: thirdInfo.isMaxLevel ? 'success.main' : 'warning.main' }}
                                />
                                {thirdInfo.isMaxLevel && <Typography variant="caption" color="success.main" sx={{ fontStyle: 'italic' }}>🎉 已達圓滿境界</Typography>}
                            </Stack>
                        </Card>
                    </Grid>
                </Grid>
                <Accordion sx={{ mt: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="caption">詳細經驗信息</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack spacing={1}>
                            <Typography variant="caption">
                                主修: 境界 {tierList[results.main.tier]}, 階段 {levelList[results.main.level]}, 重數 {results.main.process + 1}, 經驗 {formatNumber(results.main.exp)} / {formatNumber(exps[results.main.tier][results.main.level][results.main.process] || 0)}
                            </Typography>
                            <Typography variant="caption">
                                輔修: 境界 {tierList[results.sub.tier]}, 階段 {levelList[results.sub.level]}, 重數 {results.sub.process + 1}, 經驗 {formatNumber(results.sub.exp)} / {formatNumber(exps[results.sub.tier][results.sub.level][results.sub.process] || 0)}
                            </Typography>
                            <Typography variant="caption">
                                三修: 境界 {tierList[results.third.tier]}, 階段 {levelList[results.third.level]}, 重數 {results.third.process + 1}, 經驗 {formatNumber(results.third.exp)} / {formatNumber(exps[results.third.tier][results.third.level][results.third.process] || 0)}
                            </Typography>
                        </Stack>
                    </AccordionDetails>
                </Accordion>
            </Card>
        );
    };

    return (
        <Stack spacing={2} sx={{ my: 2 }}>
            <Typography variant={isMobile ? "h3" : "h1"}>經驗計算器</Typography>

            <SaveLoader save={save} load={load} relaod={() => setReload(Math.random())} value={reload} />

            <Stack direction="row" className={"justify-center items-center"} spacing={3}>
                <Typography color={"textSecondary"}>修練(計算)方向</Typography>
                <RadioGroup row value={dir} onChange={(e, v) => setDir(parseInt(v))}>
                    <FormControlLabel control={<Radio value={0} />} label={"主修"} />
                    <FormControlLabel control={<Radio value={1} />} label={"輔修"} />
                    <FormControlLabel control={<Radio value={2} />} label={"三修"} />
                </RadioGroup>
            </Stack>

            <Stack spacing={1}>
                <Stack direction={"row"} className={"items-center justify-around"}>
                    <Typography color={"textSecondary"}>主修</Typography>
                    <ExpSelector
                        tier={tier}
                        setTier={setTier}
                        level={level}
                        setLevel={setLevel}
                        process={process}
                        setProcess={setProcess}
                        exp={exp}
                        setExp={setExp}
                        full={true}
                        lock={false}
                    />
                </Stack>
                <Divider />
                <Stack direction={"row"} className={"items-center justify-around"}>
                    <Typography color={"textSecondary"}>輔修</Typography>
                    <ExpSelector
                        setData={setSubProcess}
                        tier={subProcess.tier}
                        level={subProcess.level}
                        process={subProcess.process}
                        exp={subProcess.exp}
                    />
                </Stack>
                <Divider />
                <Stack direction={"row"} className={"items-center justify-around"}>
                    <Typography color={"textSecondary"}>三修</Typography>
                    <ExpSelector
                        setData={setThirdProcess}
                        tier={thirdProcess.tier}
                        level={thirdProcess.level}
                        process={thirdProcess.process}
                        exp={thirdProcess.exp}
                    />
                </Stack>
            </Stack>

            <Stack direction={"row"} alignItems={"center"}>
                <Box width={"100%"}>
                    <LinearProgress
                        variant={"determinate"}
                        value={([0, ...exps[tier][level].slice(0, process)].reduce((a, b) => a + b) + exp) / exps[tier][level === 3 ? 2 : level].reduce((a, b) => a + b) * 100 + (level === 3) * 100}
                    />
                </Box>
                <Typography minWidth={125} fontSize={"small"} color={"textSecondary"}>
                    {tierList[tier]}{levelList[level]}
                    {formatNumber(([0, ...exps[tier][level].slice(0, process)].reduce((a, b) => a + b) + exp) / exps[tier][level === 3 ? 2 : level].reduce((a, b) => a + b) * 100 + (level === 3) * 100)}%
                </Typography>
            </Stack>

            <Box sx={{ "*": { "*.MuiAccordionSummary-content": { justifyContent: "space-between" } } }}>
                <Accordion sx={{ width: "100%" }} defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMore />} sx={{ "*": { color: "white" } }}>
                        修煉速度
                        <span>+{Math.round(baseSpeedPerDay * 100) / 100}</span>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack alignItems={"center"} justifyContent={"center"} direction={isMobile ? "column" : "row"} spacing={2}>
                            <TextField
                                value={othersAir}
                                onChange={(e) => setOthersAir(parseFloat(e.target.value))}
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
                                    value={voidAir}
                                    onChange={(e) => setVoidAir(parseFloat(e.target.value))}
                                    label={"返虛境洞府靈氣(如有)"}
                                    variant="outlined"
                                    type={"number"}
                                    min={0.00}
                                    step={0.01}
                                    fullWidth
                                    helperText={"因為古寶套裝可能不同"}
                                />
                            }
                            <FormControl sx={{ minWidth: 100 }}>
                                <InputLabel htmlFor={"effective-input"}>吸收率</InputLabel>
                                <OutlinedInput
                                    id={"effective-input"}
                                    value={effectiveSpeed}
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
                            <FormControlLabel
                                sx={{ minWidth: 80 }}
                                control={<Checkbox checked={customEffective !== false} onChange={(e, v) => setCustomEffective(v ? 0 : false)} />}
                                label={"自訂"}
                            />
                        </Stack>
                    </AccordionDetails>
                </Accordion>

                <Accordion sx={{ width: "100%" }} defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMore />} sx={{ "*": { color: "lightgreen" } }}>
                        額外吸收率
                        <span>+{Math.round(extraSpeedPerDay * 100) / 100}</span>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Card sx={{ height: "100%", backgroundColor: 'rgba(0,0,0,0.2)' }} elevation={3}>
                                    <CardContent>
                                        <Stack spacing={2}>
                                            <Typography variant="h6" color="aquamarine">
                                                前一境界精進
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                                                (主修非圓滿時生效)
                                            </Typography>
                                            <FormControl component="fieldset">
                                                <RadioGroup value={prevBuff} onChange={(e, v) => setPrevBuff(parseInt(v))}>
                                                    <FormControlLabel
                                                        value={0}
                                                        control={<Radio size="small" />}
                                                        label={
                                                            <Stack direction="row" spacing={1} alignItems="center">
                                                                <Typography>圓滿</Typography>
                                                                <Typography variant="caption" color="textSecondary">(無加成)</Typography>
                                                            </Stack>
                                                        }
                                                    />
                                                    <FormControlLabel
                                                        value={1}
                                                        control={<Radio size="small" />}
                                                        label={
                                                            <Stack direction="row" spacing={1} alignItems="center">
                                                                <Typography>大成</Typography>
                                                                <Typography variant="caption" color="textSecondary">(無加成)</Typography>
                                                            </Stack>
                                                        }
                                                    />
                                                    <FormControlLabel
                                                        value={2}
                                                        control={<Radio size="small" sx={{ color: 'gold' }} />}
                                                        label={
                                                            <Stack direction="row" spacing={1} alignItems="center">
                                                                <Typography sx={{ color: 'gold' }}>完美</Typography>
                                                                <Typography variant="caption" color="gold">(+20% 當前境界前期)</Typography>
                                                            </Stack>
                                                        }
                                                    />
                                                    <FormControlLabel
                                                        value={3}
                                                        control={<Radio size="small" sx={{ color: 'red' }} />}
                                                        label={
                                                            <Stack direction="row" spacing={1} alignItems="center">
                                                                <Typography sx={{ color: 'red' }}>半步</Typography>
                                                                <Typography variant="caption" color="red">(+40% 當前境界前/中期)</Typography>
                                                            </Stack>
                                                        }
                                                    />
                                                </RadioGroup>
                                            </FormControl>
                                            <Divider />
                                            <Stack spacing={1}>
                                                <Typography variant="body2" color="textSecondary">
                                                    當前主修境界: {tierList[tier]} {levelList[level]} ({getCultivationPhase(level)})
                                                </Typography>
                                                <Box sx={{
                                                    p: 1.5,
                                                    borderRadius: 1,
                                                    backgroundColor: prevBuffBonus > 0 ? 'rgba(144,238,144,0.15)' : 'rgba(255,255,255,0.05)',
                                                    border: prevBuffBonus > 0 ? '1px solid rgba(144,238,144,0.3)' : '1px solid rgba(255,255,255,0.1)'
                                                }}>
                                                    <Typography variant="body2" color={prevBuffBonus > 0 ? 'lightgreen' : 'textSecondary'}>
                                                        精進加成: {prevBuffBonus > 0 ? `+${prevBuffBonus}%` : '無'}
                                                        {prevBuff === 2 && prevBuffBonus === 0 && ' (已突破至中期，加成失效)'}
                                                        {prevBuff === 3 && prevBuffBonus === 0 && ' (已突破至後期，加成失效)'}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card sx={{ height: "100%", backgroundColor: 'rgba(0,0,0,0.2)' }} elevation={3}>
                                    <CardContent>
                                        <Stack spacing={2}>
                                            <Typography variant="h6" color="gold">
                                                當前境界精進
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                                                (主修圓滿時生效)
                                            </Typography>
                                            <FormControl component="fieldset">
                                                <RadioGroup value={currentBuff} onChange={(e, v) => setCurrentBuff(parseInt(v))}>
                                                    <FormControlLabel
                                                        value={0}
                                                        control={<Radio size="small" />}
                                                        label={
                                                            <Stack direction="row" spacing={1} alignItems="center">
                                                                <Typography>圓滿</Typography>
                                                                <Typography variant="caption" color="textSecondary">(無加成)</Typography>
                                                            </Stack>
                                                        }
                                                    />
                                                    <FormControlLabel
                                                        value={1}
                                                        control={<Radio size="small" sx={{ color: 'magenta' }} />}
                                                        label={
                                                            <Stack direction="row" spacing={1} alignItems="center">
                                                                <Typography sx={{ color: 'magenta' }}>大成</Typography>
                                                                <Typography variant="caption" color="magenta">(+20% 輔修=主修-1 且中期以上)</Typography>
                                                            </Stack>
                                                        }
                                                    />
                                                    <FormControlLabel
                                                        value={2}
                                                        control={<Radio size="small" sx={{ color: 'gold' }} />}
                                                        label={
                                                            <Stack direction="row" spacing={1} alignItems="center">
                                                                <Typography sx={{ color: 'gold' }}>完美</Typography>
                                                                <Typography variant="caption" color="gold">(+20% 輔修=主修 且非圓滿)</Typography>
                                                            </Stack>
                                                        }
                                                    />
                                                    <FormControlLabel
                                                        value={3}
                                                        control={<Radio size="small" sx={{ color: 'red' }} />}
                                                        label={
                                                            <Stack direction="row" spacing={1} alignItems="center">
                                                                <Typography sx={{ color: 'red' }}>半步</Typography>
                                                                <Typography variant="caption" color="red">(+40% 輔修=主修 且圓滿)</Typography>
                                                            </Stack>
                                                        }
                                                    />
                                                </RadioGroup>
                                            </FormControl>
                                            <Divider />
                                            <Stack spacing={1}>
                                                <Typography variant="body2" color="textSecondary">
                                                    主修境界: {tierList[tier]} {levelList[level]} {isMainPerfect ? '✅ 圓滿' : '❌ 未圓滿'}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    輔修境界: {tierList[subProcess.tier]} {levelList[subProcess.level]} ({getCultivationPhase(subProcess.level)})
                                                </Typography>
                                                <Box sx={{
                                                    p: 1.5,
                                                    borderRadius: 1,
                                                    backgroundColor: currentBuffBonus > 0 ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.05)',
                                                    border: currentBuffBonus > 0 ? '1px solid rgba(255,215,0,0.3)' : '1px solid rgba(255,255,255,0.1)'
                                                }}>
                                                    <Typography variant="body2" color={currentBuffBonus > 0 ? 'gold' : 'textSecondary'}>
                                                        精進加成: {currentBuffBonus > 0 ? `+${currentBuffBonus}%` : '無'}
                                                        {!isMainPerfect && ' (主修未圓滿，無效)'}
                                                        {currentBuff === 1 && currentBuffBonus === 0 && isMainPerfect && ' (輔修非主修-1 或 輔修為前期)'}
                                                        {currentBuff === 2 && currentBuffBonus === 0 && isMainPerfect && ' (輔修非主修同境界 或 輔修已圓滿)'}
                                                        {currentBuff === 3 && currentBuffBonus === 0 && isMainPerfect && ' (輔修非主修同境界 或 輔修非圓滿)'}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        <Box sx={{ mt: 3 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Card sx={{ backgroundColor: 'rgba(0,0,0,0.15)' }} elevation={2}>
                                        <CardContent>
                                            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                                                額外修煉速度加成
                                            </Typography>
                                            <Stack spacing={2}>
                                                <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
                                                    <FormControlLabel
                                                        control={<Checkbox size="small" checked={fenqiEnabled} onChange={(e, v) => setFenqiEnabled(v)} />}
                                                        label="奮起"
                                                    />
                                                    {fenqiEnabled && (
                                                        <TextField
                                                            type="number"
                                                            value={fenqiBonus}
                                                            onChange={(e) => setFenqiBonus(parseFloat(e.target.value) || 0)}
                                                            InputProps={{ endAdornment: <span>%</span> }}
                                                            size="small"
                                                            sx={{ width: 120 }}
                                                        />
                                                    )}
                                                </Stack>
                                                <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
                                                    <FormControlLabel
                                                        control={<Checkbox size="small" checked={wanjieTianyuanEnabled} onChange={(e, v) => setWanjieTianyuanEnabled(v)} />}
                                                        label="萬界天淵"
                                                    />
                                                    {wanjieTianyuanEnabled && (
                                                        <TextField
                                                            type="number"
                                                            value={wanjieTianyuanBonus}
                                                            onChange={(e) => setWanjieTianyuanBonus(parseFloat(e.target.value) || 0)}
                                                            InputProps={{ endAdornment: <span>%</span> }}
                                                            size="small"
                                                            sx={{ width: 120 }}
                                                        />
                                                    )}
                                                </Stack>
                                                <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
                                                    <FormControlLabel
                                                        control={<Checkbox size="small" checked={yaojieEnabled} onChange={(e, v) => setYaojieEnabled(v)} />}
                                                        label="妖界降臨"
                                                    />
                                                    {yaojieEnabled && (
                                                        <TextField
                                                            type="number"
                                                            value={yaojieBonus}
                                                            onChange={(e) => setYaojieBonus(parseFloat(e.target.value) || 0)}
                                                            InputProps={{ endAdornment: <span>%</span> }}
                                                            size="small"
                                                            sx={{ width: 120 }}
                                                        />
                                                    )}
                                                </Stack>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Card sx={{ backgroundColor: 'rgba(0,0,0,0.15)' }} elevation={2}>
                                        <CardContent>
                                            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                                                最終吸收率
                                            </Typography>
                                            <Stack spacing={1}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="body2">境界吸收率</Typography>
                                                    <Typography variant="body2" fontWeight="bold">{effectiveSpeed.toFixed(1)}%</Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="body2" color="lightgreen">精進加成</Typography>
                                                    <Typography variant="body2" color="lightgreen" fontWeight="bold">+{(prevBuffBonus + currentBuffBonus).toFixed(1)}%</Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="body2" color="orange">額外倍率加成</Typography>
                                                    <Typography variant="body2" color="orange" fontWeight="bold">
                                                        +{((effectiveSpeed + prevBuffBonus + currentBuffBonus) * ((1 + (fenqiEnabled ? fenqiBonus / 100 : 0)) * (1 + (wanjieTianyuanEnabled ? wanjieTianyuanBonus / 100 : 0)) * (1 + (yaojieEnabled ? yaojieBonus / 100 : 0)) - 1)).toFixed(1)}%
                                                    </Typography>
                                                </Box>
                                                <Divider />
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="body2" fontWeight="bold">最終吸收率</Typography>
                                                    <Typography variant="body2" fontWeight="bold" color="lightgreen">
                                                        {((effectiveSpeed + prevBuffBonus + currentBuffBonus) * (1 + (fenqiEnabled ? fenqiBonus / 100 : 0)) * (1 + (wanjieTianyuanEnabled ? wanjieTianyuanBonus / 100 : 0)) * (1 + (yaojieEnabled ? yaojieBonus / 100 : 0))).toFixed(1)}%
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    </AccordionDetails>
                </Accordion>

                <Accordion sx={{ width: "100%" }}>
                    <AccordionSummary expandIcon={<ExpandMore />} sx={{ "*": { color: "orange" } }}>
                        吐吶
                        <span>+{Math.round(breatheSpeedPerDay * 100) / 100}</span>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack alignItems={"center"} justifyContent={"center"} spacing={2}>
                            <Typography variant={isMobile ? "h6" : "h2"} sx={{ color: "rgba(255,255,255,0.5)" }}>
                                抗拒計算吐納 從你我做起
                            </Typography>
                            <Typography variant="caption" color="textSecondary" sx={{ mb: 1 }}>
                                {customBreatheBase ? "勾選後直接輸入每日總修為" : "*請在總加成基礎上加100%"}
                            </Typography>
                            <Stack
                                px={!isMobile ? 10 : 0}
                                width={"100%"}
                                direction={isMobile ? "column" : "row"}
                                justifyContent={"space-around"}
                                alignItems={"center"}
                                spacing={isMobile ? 1 : 0}
                            >
                                <Stack direction={!isMobile ? "column" : "row-reverse"} alignItems={"center"} spacing={1}>
                                    <Typography variant="body1" fontWeight="bold">
                                        {customBreatheBase ? "自訂" : breatheBase}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {customBreatheBase ? "每日總修為" : "吐納基礎修為"}
                                    </Typography>
                                </Stack>
                                {!customBreatheBase && (
                                    <>
                                        <Typography sx={{ color: "rgba(255,255,255,0.5)" }} fontSize="large">×</Typography>
                                        <Stack direction={!isMobile ? "column" : "row-reverse"} alignItems={"center"} spacing={1}>
                                            <Input
                                                type={"number"}
                                                sx={{ width: 80 }}
                                                onChange={(e) => setBreatheBuf(parseFloat(e.target.value))}
                                                variant={"standard"}
                                                value={breatheBuf}
                                                endAdornment={"%"}
                                            />
                                            <Typography variant="body2" color="textSecondary">吐納加成</Typography>
                                        </Stack>
                                        <Typography sx={{ color: "rgba(255,255,255,0.5)" }} fontSize="large">×</Typography>
                                        <Stack direction={!isMobile ? "column" : "row-reverse"} alignItems={"center"} spacing={1}>
                                            <Input
                                                type={"number"}
                                                sx={{ width: 80 }}
                                                onChange={(e) => setBreatheTime(parseFloat(e.target.value))}
                                                variant={"standard"}
                                                value={breatheTime}
                                                endAdornment={"次"}
                                            />
                                            <Typography variant="body2" color="textSecondary">吐納次數</Typography>
                                        </Stack>
                                        <Typography sx={{ color: "rgba(255,255,255,0.5)" }} fontSize="large">×</Typography>
                                        <Stack direction={!isMobile ? "column" : "row-reverse"} alignItems={"center"} spacing={1}>
                                            <Typography variant="body1" fontWeight="bold">1.9</Typography>
                                            <Typography variant="body2" color="textSecondary">吐納爆擊</Typography>
                                        </Stack>
                                    </>
                                )}
                            </Stack>
                            <Stack direction={isMobile ? "column" : "row"} spacing={2} alignItems="center" sx={{ mt: 2, width: "100%" }}>
                                <FormControlLabel
                                    control={<Checkbox checked={customBreatheBase} onChange={(e, v) => setCustomBreatheBase(v)} />}
                                    label="自訂吐納"
                                />
                                {customBreatheBase && (
                                    <TextField
                                        type="number"
                                        value={customBreatheValue}
                                        onChange={(e) => setCustomBreatheValue(parseFloat(e.target.value) || 0)}
                                        label="每日總修為"
                                        size="small"
                                        sx={{ width: 150 }}
                                        InputProps={{ endAdornment: "修為" }}
                                    />
                                )}
                            </Stack>
                        </Stack>
                    </AccordionDetails>
                </Accordion>

                <Accordion sx={{ width: "100%" }}>
                    <AccordionSummary expandIcon={<ExpandMore />} sx={{ "*": { color: "magenta" } }}>
                        丹藥
                        <span>+{Math.round(medSpeedPerDay * 100) / 100}</span>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack direction={isMobile ? "column" : "row"} spacing={2} alignItems="center" justifyContent="space-around">
                            {["grey", "lightgreen", "lightblue", "magenta", "gold"].map((color, i) => (
                                <Stack alignItems={"center"} key={color} direction={!isMobile ? "column" : "row-reverse"} spacing={isMobile * 2}>
                                    <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                                        <Box sx={{ width: 10, height: 10, backgroundColor: color, borderRadius: 100 }} />
                                        <Input
                                            sx={{ width: 50 }}
                                            type={"number"}
                                            value={medAmount[i]}
                                            startAdornment={"x"}
                                            onChange={(e) => {
                                                let newAmount = Array.from(medAmount);
                                                newAmount[i] = parseFloat(e.target.value);
                                                if (newAmount[i] < 0) return;
                                                setMedAmount(newAmount);
                                            }}
                                        />
                                    </Stack>
                                    <Input
                                        sx={{ width: 80 }}
                                        type={"number"}
                                        value={medExp[i]}
                                        placeholder={""}
                                        endAdornment={"萬"}
                                        onChange={(e) => {
                                            let newAmount = Array.from(medExp);
                                            newAmount[i] = parseFloat(e.target.value);
                                            if (newAmount[i] < 0) return;
                                            setMedExp(newAmount);
                                        }}
                                    />
                                </Stack>
                            ))}
                        </Stack>
                    </AccordionDetails>
                    <AccordionActions>*請輸入您每天的進食量和經驗</AccordionActions>
                </Accordion>

                <Accordion sx={{ width: "100%" }}>
                    <AccordionSummary expandIcon={<ExpandMore />} sx={{ "*": { color: "gold" } }}>
                        納靈石
                        <span>+{Math.round(stoneSpeedPerDay * 100) / 100}</span>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack direction={isMobile ? "column" : "row"} alignItems={"center"} spacing={2}>
                            <FormControl sx={{ minWidth: 200, width: isMobile ? "100%" : "auto" }}>
                                <InputLabel>納靈石等級</InputLabel>
                                <Select
                                    value={stoneLevel}
                                    onChange={(e) => setStoneLevel(parseInt(e.target.value))}
                                    label="納靈石等級"
                                >
                                    {STONE_SYSTEM.types.map((t) =>
                                        <MenuItem key={t.id} value={t.id} sx={{ color: t.color }}>
                                            {t.name} ({(t.absorption * 100).toFixed(1)}%)
                                        </MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                            <Typography variant="body2" color="textSecondary">基礎吸收率: {((STONE_SYSTEM.types[stoneLevel]?.absorption || 0) * 100).toFixed(1)}%</Typography>
                        </Stack>
                        <Divider sx={{ my: 2 }} />
                        <FormControlLabel
                            control={<Checkbox checked={stoneSealEnabled} onChange={(e, v) => setStoneSealEnabled(v)} />}
                            label="啟用納靈印"
                        />
                        {stoneSealEnabled && (
                            <Stack spacing={2} mt={2}>
                                <Stack direction={isMobile ? "column" : "row"} alignItems={"center"} spacing={2}>
                                    <FormControl sx={{ minWidth: 200, width: isMobile ? "100%" : "auto" }}>
                                        <InputLabel>納靈印品質</InputLabel>
                                        <Select
                                            value={stoneQuality}
                                            onChange={(e) => setStoneQuality(parseInt(e.target.value))}
                                            label="納靈印星級"
                                        >
                                            <MenuItem value={0}>2星 ({(stoneQualityList[0] * 100).toFixed(1)}%)</MenuItem>
                                            <MenuItem value={1}>3星 ({(stoneQualityList[1] * 100).toFixed(1)}%)</MenuItem>
                                            <MenuItem value={2}>4星 ({(stoneQualityList[2] * 100).toFixed(1)}%)</MenuItem>
                                            <MenuItem value={3}>5星 ({(stoneQualityList[3] * 100).toFixed(1)}%)</MenuItem>
                                            <MenuItem value={4}>覺醒 ({(stoneQualityList[4] * 100).toFixed(1)}%)</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Typography variant="body2" color="textSecondary">星級效果: ×{((stoneQualityList[stoneQuality] || 0) * 100).toFixed(1)}%</Typography>
                                </Stack>
                                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                                    <FormControlLabel
                                        control={<Checkbox checked={stoneForgeEnabled} onChange={(e, v) => setStoneForgeEnabled(v)} />}
                                        label="鍛靈① - 繼承修煉速度"
                                    />
                                    {stoneForgeEnabled &&
                                        <TextField
                                            label="吸收率加成"
                                            type="number"
                                            value={stoneForgeAbsorption}
                                            onChange={(e) => setStoneForgeAbsorption(parseFloat(e.target.value) || 0)}
                                            sx={{ width: 130 }}
                                            InputProps={{ endAdornment: <span>%</span> }}
                                            inputProps={{ step: 0.1, min: 0 }}
                                        />
                                    }
                                </Stack>
                                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                                    <FormControlLabel
                                        control={<Checkbox checked={stoneForgeMultiplierEnabled} onChange={(e, v) => setStoneForgeMultiplierEnabled(v)} />}
                                        label="鍛靈② - 靈氣吸收提升"
                                    />
                                    {stoneForgeMultiplierEnabled &&
                                        <TextField
                                            label="倍率"
                                            type="number"
                                            value={stoneForgeMultiplier}
                                            onChange={(e) => setStoneForgeMultiplier(parseFloat(e.target.value) || 1)}
                                            sx={{ width: 130 }}
                                            InputProps={{ endAdornment: <span>×</span> }}
                                            inputProps={{ step: 0.01, min: 0 }}
                                        />
                                    }
                                </Stack>
                            </Stack>
                        )}
                        <Stack mt={2} p={2} sx={{ backgroundColor: 'rgba(255,215,0,0.1)', borderRadius: 1 }}>
                            <Typography variant="body2" color="textSecondary">當前納靈石加成計算：</Typography>
                            <Typography variant="body2">
                                {(() => {
                                    const base = STONE_SYSTEM.types[stoneLevel]?.absorption || 0;
                                    const quality = stoneSealEnabled ? (stoneQualityList[stoneQuality] || 0) : 0;
                                    const forge1 = stoneForgeEnabled ? stoneForgeAbsorption / 100 : 0;
                                    const forge2 = stoneForgeMultiplierEnabled ? stoneForgeMultiplier : 1;
                                    const totalPercent = (base + forge1) * forge2 * (1 + quality) * 100;
                                    const zhouTianDisplay = zhouTian;
                                    return (
                                        <>
                                            <strong>修煉周天 = {formatNumber(air)} × {formatNumber(finalEfficiency)}% = {formatNumber(zhouTianDisplay)}</strong>
                                            <br />
                                            吸收比例 = ({(base * 100).toFixed(1)}% + {(forge1 * 100).toFixed(1)}%) × {formatNumber(forge2, 2)} × (1 + {(quality * 100).toFixed(1)}%) = {totalPercent.toFixed(2)}%
                                            <br />
                                            每日收益 = {formatNumber(zhouTianDisplay)} × {totalPercent.toFixed(2)}% × 10800 = {formatNumber(stoneSpeedPerDay)}
                                            <br />
                                            <strong>總加成: {totalPercent.toFixed(2)}%</strong>
                                        </>
                                    );
                                })()}
                            </Typography>
                        </Stack>
                    </AccordionDetails>
                </Accordion>

                <Accordion sx={{ width: "100%" }}>
                    <AccordionSummary expandIcon={<ExpandMore />} sx={{ "*": { color: "red" } }}>
                        至寶
                        <span>≈+{Math.round(godSpeedPerDay * 100) / 100}</span>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack alignItems={"center"} justifyContent={"center"} direction={isMobile ? "column" : "row"} spacing={2}>
                            <Stack alignItems={"center"} width={"100%"} p={!isMobile * 3} spacing={1}>
                                <Checkbox
                                    checked={gods[0][0] >= 0}
                                    onChange={(e, v) => {
                                        let newGods = Array.from(gods);
                                        newGods[0][0] = v ? 0 : -1;
                                        setGods(newGods);
                                    }}
                                />星海瓶
                                <Rating
                                    disabled={gods[0][0] < 0}
                                    value={gods[0][0]}
                                    onChange={(e, v) => {
                                        let newGods = Array.from(gods);
                                        newGods[0][0] = v === null ? 0 : v;
                                        setGods(newGods);
                                    }}
                                    min={0}
                                />
                                <Stack direction={"row"} alignItems={"baseline"}>
                                    <Box sx={{ width: 10, height: 10, backgroundColor: "red", borderRadius: 100 }} />x{Math.round(starSeaTimes * 100) / 100} / 天
                                </Stack>
                                <Input
                                    value={gods[0][1]}
                                    onChange={(e) => {
                                        let newGods = Array.from(gods);
                                        newGods[0][1] = parseFloat(e.target.value === "" ? 0 : e.target.value);
                                        setGods(newGods);
                                    }}
                                    endAdornment={"萬"}
                                    type={"number"}
                                    min={0}
                                    sx={{ width: 80 }}
                                />
                                <Typography color={"error"}>≈+ {formatNumber(godSpeed0)} / 天</Typography>
                                <FormControl component="fieldset" sx={{ width: "100%" }}>
                                    <RadioGroup
                                        row
                                        value={starSeaConversion}
                                        onChange={(e, v) => setStarSeaConversion(parseInt(v))}
                                    >
                                        <FormControlLabel value={0} control={<Radio size="small" />} label="無" />
                                        <FormControlLabel value={1} control={<Radio size="small" />} label="金丹 (-20%)" />
                                        <FormControlLabel value={2} control={<Radio size="small" />} label="紫丹 (-5%)" />
                                    </RadioGroup>
                                </FormControl>
                            </Stack>

                            <Divider flexItem orientation={isMobile ? "horizontal" : "vertical"} />

                            <Stack alignItems={"center"} width={"100%"} p={!isMobile * 3} spacing={1}>
                                <Checkbox
                                    checked={gods[1][0] >= 0}
                                    onChange={(e, v) => {
                                        let newGods = Array.from(gods);
                                        newGods[1][0] = v ? 0 : -1;
                                        setGods(newGods);
                                    }}
                                />雙星鏡
                                <Rating
                                    disabled={gods[1][0] < 0}
                                    value={gods[1][0]}
                                    onChange={(e, v) => {
                                        let newGods = Array.from(gods);
                                        newGods[1][0] = v === null ? 0 : v;
                                        setGods(newGods);
                                    }}
                                    min={0}
                                />
                                <Stack direction={"row"} alignItems={"baseline"}>
                                    <Box sx={{ width: 10, height: 10, backgroundColor: "red", borderRadius: 100 }} />x{Math.round(mirrorEffectiveTimes * 100) / 100} / 天
                                </Stack>
                                <Input
                                    value={gods[1][1]}
                                    onChange={(e) => {
                                        let newGods = Array.from(gods);
                                        newGods[1][1] = parseFloat(e.target.value === "" ? 0 : e.target.value);
                                        setGods(newGods);
                                    }}
                                    endAdornment={"萬"}
                                    type={"number"}
                                    min={0}
                                    sx={{ width: 80 }}
                                />
                                <FormControlLabel
                                    checked={gods[1][2]}
                                    control={<Checkbox size={"small"} />}
                                    label={"幻化"}
                                    onChange={(e, v) => {
                                        let newGods = Array.from(gods);
                                        newGods[1][2] = v;
                                        setGods(newGods);
                                    }}
                                />
                                <Typography color={"error"}>≈+ {formatNumber(godSpeed1)} / 天</Typography>
                                <FormControlLabel
                                    control={<Checkbox checked={mirrorDouble} onChange={(e, v) => setMirrorDouble(v)} size="small" />}
                                    label="雙倍機會 (15%)"
                                />
                            </Stack>
                        </Stack>
                    </AccordionDetails>
                </Accordion>

                <Accordion sx={{ width: "100%" }}>
                    <AccordionSummary expandIcon={<ExpandMore />} sx={{ "*": { color: "grey" } }}>
                        輔修相關
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Stack spacing={2} alignItems="center">
                                    <FormControlLabel
                                        control={<Checkbox checked={furnaceEnabled} onChange={(e, v) => setFurnaceEnabled(v)} />}
                                        label="紫闕合道爐"
                                        sx={{ width: "100%", justifyContent: "center" }}
                                    />
                                    {furnaceEnabled && (
                                        <>
                                            <FormControl sx={{ minWidth: 150, width: isMobile ? "100%" : "auto" }}>
                                                <InputLabel>合道爐品質</InputLabel>
                                                <Select
                                                    value={furnaceQuality}
                                                    onChange={(e) => setFurnaceQuality(parseInt(e.target.value))}
                                                    label="合道爐品質"
                                                >
                                                    <MenuItem value={0}>2星 (7%)</MenuItem>
                                                    <MenuItem value={1}>3星 (11%)</MenuItem>
                                                    <MenuItem value={2}>4星 (15%)</MenuItem>
                                                    <MenuItem value={3}>5星 (19%)</MenuItem>
                                                    <MenuItem value={4}>覺醒 (20%)</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                                                <FormControlLabel
                                                    control={<Checkbox checked={furnaceForge1Enabled} onChange={(e, v) => setFurnaceForge1Enabled(v)} />}
                                                    label="鍛靈① +"
                                                />
                                                {furnaceForge1Enabled &&
                                                    <TextField
                                                        label="加成"
                                                        type="number"
                                                        value={furnaceForge1Percent}
                                                        onChange={(e) => setFurnaceForge1Percent(parseFloat(e.target.value) || 0)}
                                                        sx={{ width: 100 }}
                                                        InputProps={{ endAdornment: <span>%</span> }}
                                                        inputProps={{ step: 0.01, min: 0 }}
                                                    />
                                                }
                                            </Stack>
                                            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                                                <FormControlLabel
                                                    control={<Checkbox checked={furnaceForge2Enabled} onChange={(e, v) => setFurnaceForge2Enabled(v)} />}
                                                    label="鍛靈② ×"
                                                />
                                                {furnaceForge2Enabled &&
                                                    <TextField
                                                        label="倍率"
                                                        type="number"
                                                        value={furnaceForge2Multiplier}
                                                        onChange={(e) => setFurnaceForge2Multiplier(parseFloat(e.target.value) || 1)}
                                                        sx={{ width: 100 }}
                                                        InputProps={{ endAdornment: <span>×</span> }}
                                                        inputProps={{ step: 0.01, min: 0 }}
                                                    />
                                                }
                                            </Stack>
                                            <Stack p={2} sx={{ backgroundColor: 'rgba(156,39,176,0.1)', borderRadius: 1, width: "100%" }}>
                                                <Typography variant="body2" color="secondary">當前合道爐加成：</Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    品質: +{((furnaceQualityList[furnaceQuality] || 0) * 100).toFixed(1)}%
                                                    {furnaceForge1Enabled && ` + ${furnaceForge1Percent.toFixed(2)}% (鍛靈①)`}
                                                    {furnaceForge2Enabled && ` × ${furnaceForge2Multiplier.toFixed(2)} (鍛靈②)`}
                                                    <br /><strong style={{ color: '#ce93d8' }}>
                                                        總加成: {(((furnaceQualityList[furnaceQuality] || 0) + (furnaceForge1Enabled ? furnaceForge1Percent / 100 : 0)) * (furnaceForge2Enabled ? furnaceForge2Multiplier : 1) * 100).toFixed(2)}%
                                                    </strong>
                                                </Typography>
                                                <Typography variant="body2" color="secondary">輔修修煉速度: {formatNumber(purpleFurnaceSpeedDisplay * 10800)} / 天</Typography>
                                            </Stack>
                                        </>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Stack spacing={2} alignItems="center">
                                    <FormControlLabel
                                        control={<Checkbox checked={nichenzhuEnabled} onChange={(e, v) => setNichenzhuEnabled(v)} />}
                                        label="逆塵珠"
                                        sx={{ width: "100%", justifyContent: "center" }}
                                    />
                                    {nichenzhuEnabled && (
                                        <>
                                            <Rating
                                                disabled={!nichenzhuEnabled}
                                                value={nichenzhuStars}
                                                onChange={(e, v) => setNichenzhuStars(v === null ? 0 : v)}
                                                min={0}
                                                max={5}
                                                size="large"
                                            />
                                            <Stack spacing={1} alignItems="center">
                                                <Typography variant="body2" color="textSecondary">能量上限: {nichenzhuEnergyMax} 點</Typography>
                                                <Typography variant="body2" color="textSecondary">每日恢復: {Math.round(nichenzhuRecoveryRate)} 點/天</Typography>
                                                <Typography variant="body2" color="textSecondary">每次消耗: {nichenzhuEnergyCost} 點</Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    每次收益: {nichenzhuStars >= 1 ? '120' : '100'} 周天輔修經驗
                                                    {nichenzhuStars >= 1 && ' (⭐1星以上+20%)'}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">每日可使用: {nichenzhuDailyUses} 次</Typography>
                                                <Typography variant="body2" color="success.main">每日收益: {formatNumber(nichenzhuDailyGain)} 修為</Typography>
                                            </Stack>
                                            <FormControlLabel
                                                control={<Checkbox checked={nichenzhuTransform} onChange={(e, v) => setNichenzhuTransform(v)} size="small" />}
                                                label="幻化"
                                                disabled={!nichenzhuEnabled}
                                            />
                                            <Typography variant="caption" color="textSecondary">
                                                {nichenzhuStars === 5 && '⭐五星: 消耗 -10%'}
                                                {nichenzhuTransform && ' ✦幻化: 消耗 -1點'}
                                                {nichenzhuStars === 5 && nichenzhuTransform && ' → 最低8點/次'}
                                            </Typography>
                                        </>
                                    )}
                                </Stack>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Box>

            <Stack spacing={1}>
                <Typography variant={isMobile ? "h6" : "h5"}>
                    修煉速度: {Math.round(totalSpeedPerDay * 100) / 100} / 天
                </Typography>
                {furnaceEnabled && (
                    <Typography variant={isMobile ? "h6" : "h5"} color="secondary">
                        輔修修煉速度: {formatNumber(purpleFurnaceSpeedDisplay * 10800)} / 天
                    </Typography>
                )}
                <Stack direction={isMobile ? "column" : "row"} justifyContent={"center"}>
                    <div style={{ color: "white" }}>{formatNumber(baseSpeedPerDay)}</div>
                    <div style={{ color: "lightgreen" }}>+{formatNumber(extraSpeedPerDay)}</div>
                    <div style={{ color: "orange" }}>+{formatNumber(breatheSpeedPerDay)}</div>
                    <div style={{ color: "magenta" }}>+{formatNumber(medSpeedPerDay)}</div>
                    <div style={{ color: "gold" }}>+{formatNumber(stoneSpeedPerDay)}</div>
                    <div style={{ color: "red" }}>≈+{formatNumber(godSpeedPerDay)}</div>
                </Stack>
                <Stack direction={isMobile ? "column" : "row"} justifyContent={"center"} alignItems={"center"}>
                    當前境界
                    <Typography variant={"h4"}>總修煉速度:</Typography>
                    <Typography variant={"h4"}>
                        <AnimatedNumbers
                            animateToNumber={totalSpeedPerDay}
                            includeComma
                            transitions={(index) => ({ type: "spring", duration: index / 10 })}
                        />
                    </Typography>
                    <Typography variant={"h4"}> / 天</Typography>
                </Stack>
            </Stack>

            <Stack alignItems={"center"}>
                <FormGroup row>
                    {chartLs.map((i, j) =>
                        <FormControlLabel
                            color={i[2]}
                            checked={cal[j]}
                            control={<Checkbox sx={{ "svg": { color: i[2] } }} />}
                            label={i[1]}
                            onChange={(e, v) => {
                                let newCal = Array.from(cal);
                                newCal[j] = v;
                                setCal(newCal);
                            }}
                            key={i[0]}
                        />
                    )}
                </FormGroup>
            </Stack>

            <Stack direction={"row"} alignItems={"center"} spacing={2}>
                <ColorButton
                    onClick={() => calc({ tier, level, process, exp }, subProcess, thirdProcess)}
                    variant="outlined"
                    size={"large"}
                    fullWidth
                >
                    計算♡
                </ColorButton>
                <IconButton onClick={() => setStopSetDialog(true)}><Settings /></IconButton>
                <Dialog open={stopSetDialog} onClose={() => setStopSetDialog(false)} fullWidth maxWidth={"xs"}>
                    <DialogTitle>停止模擬的時間</DialogTitle>
                    <DialogContent>
                        <Accordion expanded={stopType === 0}>
                            <AccordionSummary onClick={() => setStopType(0)}>
                                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                                    <Checkbox checked={stopType === 0} sx={{ p: 0 }} />
                                    <Typography>到達後境界停止</Typography>
                                </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                                <RadioGroup row value={stopLevel} onChange={(e, v) => setStopLevel(parseInt(v))}>
                                    {Object.entries(buffs).map(([name, color], i) =>
                                        <FormControlLabel
                                            value={i}
                                            sx={{ color: color }}
                                            disabled={i > 0 ? dir !== 0 : false}
                                            control={<Radio size={"small"} />}
                                            label={name}
                                            key={name}
                                        />
                                    )}
                                </RadioGroup>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={stopType === 1}>
                            <AccordionSummary onClick={() => setStopType(1)}>
                                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                                    <Checkbox checked={stopType === 1} sx={{ p: 0 }} />
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
            </Stack>

            {finalResults && <ResultsPanel results={finalResults} />}
            {record.length !== 0 &&
                <DataDisplay
                    final={final}
                    fullTime={fullTime}
                    counters={counters}
                    record={record}
                    stopType={stopType}
                />
            }
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>Logs</AccordionSummary>
                <AccordionDetails>
                    {logs.map(i => <p key={i} style={{ margin: 0 }}>{i}</p>)}
                </AccordionDetails>
            </Accordion>
        </Stack>
    );
}