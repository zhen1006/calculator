import { useState, useMemo } from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Card,
    CardContent,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import {
    HUALINGTAI_DATA,
    PER_GAIN_MAP,
    REALM_LIST,
    GameData
} from '../data/data.js';

const FIXED_TARGET = 2581826.5843;
const SIMULATION_ROUNDS = 100;

const QUALITY_MULT = {
    '白': 1.0,
    '綠': 1.2,
    '藍': 1.6,
    '紫': 2.0,
    '金': 2.4,
    '紅': 3.0
};

function getQualityDistribution(qualityLevel) {
    const table = {
        1:  [70,30,0,0,0,0],
        2:  [65,35,0,0,0,0],
        3:  [60,40,0,0,0,0],
        4:  [55,45,0,0,0,0],
        5:  [50,50,0,0,0,0],
        6:  [45,55,0,0,0,0],
        7:  [15,85,0,0,0,0],
        8:  [10,90,0,0,0,0],
        9:  [5,95,0,0,0,0],
        10: [0,100,0,0,0,0],
        11: [0,40,60,0,0,0],
        12: [0,30,70,0,0,0],
        13: [0,20,80,0,0,0],
        14: [0,10,90,0,0,0],
        15: [0,0,100,0,0,0],
        16: [0,0,40,60,0,0],
        17: [0,0,30,70,0,0],
        18: [0,0,20,80,0,0],
        19: [0,0,10,90,0,0],
        20: [0,0,0,100,0,0],
        21: [0,0,0,40,60,0],
        22: [0,0,0,30,70,0],
        23: [0,0,0,20,80,0],
        24: [0,0,0,10,90,0],
        25: [0,0,0,0,100,0],
        26: [0,0,0,0,40,60],
        27: [0,0,0,0,30,70],
        28: [0,0,0,0,20,80],
        29: [0,0,0,0,10,90],
        30: [0,0,0,0,0,100]
    };
    return table[Math.min(30, Math.max(1, qualityLevel))] || [100,0,0,0,0,0];
}

function getMeritBase(level) {
    const idx = Math.floor((Math.min(30, Math.max(1, level)) - 1) / 5);
    return 150 + idx * 50;
}

function simulateWanYao(
    tier,
    cultivationLevel,
    qualityLevel,
    spiritLevel,
    highQualityLevel,
    isCurrentRealm,
    fruitCount
) {

    const baseMap = {
        0: 65000,
        1: 65000,
        2: 65000,
        3: 65000,
        4: 96000,
        5: 130000,
        6: 240000,
        7: 420000,
        8: 800000,
        9: 1810000,
        10: 3600000,
        11: 7020000
    };
    let base = baseMap[tier] ?? 65000;
    if (isCurrentRealm) base *= 1.5;

    const cultivationBonus = (cultivationLevel - 1) * 0.02;
    const cultivationFactor = 1 + Math.min(cultivationBonus, 0.6);

    const spiritBaseRate = 0.10 + Math.floor((spiritLevel - 1) / 5) * 0.05;
    const spiritRate = Math.min(spiritBaseRate, 0.35);
    const spiritMultiplier = 1 + (1.50 + (spiritLevel - 1) * 0.04);

    const qualityDist = getQualityDistribution(qualityLevel);
    const qualityNames = ['白','綠','藍','紫','金','紅'];
    const cumProb = [];
    let sum = 0;
    for (let i = 0; i < qualityDist.length; i++) {
        sum += qualityDist[i];
        cumProb.push(sum);
    }

    const highQualityRate = Math.min(0.20 + (highQualityLevel - 1) * 0.01, 0.50);
    const meritBase = getMeritBase(highQualityLevel);

    let totalGain = 0;
    let totalLingYong = 0;
    let totalMerit = 0;
    let totalWhite = 0, totalGreen = 0, totalBlue = 0, totalPurple = 0, totalGold = 0, totalRed = 0;
    const count = fruitCount;

    const rand = () => Math.random();

    for (let sim = 0; sim < SIMULATION_ROUNDS; sim++) {
        let simGain = 0;
        let simLingYong = 0;
        let simMerit = 0;
        let simWhite = 0, simGreen = 0, simBlue = 0, simPurple = 0, simGold = 0, simRed = 0;
        let globalCounter = 0;

        for (let i = 0; i < count; i++) {
            globalCounter++;
            let isSpirit = false;
            if (globalCounter === 6) {
                isSpirit = true;
                globalCounter = 0;
            } else {
                isSpirit = (rand() < spiritRate);
            }

            const r = rand() * 100;
            let qualityIndex = 0;
            for (let j = 0; j < cumProb.length; j++) {
                if (r < cumProb[j]) {
                    qualityIndex = j;
                    break;
                }
            }
            const qualityName = qualityNames[qualityIndex];
            const qualityMult = QUALITY_MULT[qualityName];

            let gain = base * cultivationFactor * qualityMult;
            if (isSpirit) {
                gain *= spiritMultiplier;
                simLingYong++;
            }

            if ((qualityName === '白' && cultivationLevel >= 1 && cultivationLevel <= 5) ||
                (qualityName === '紅' && cultivationLevel >= 26 && cultivationLevel <= 30)) {
                gain *= 1.2;
            }

            simGain += gain;

            if (qualityName === '白') simWhite++;
            else if (qualityName === '綠') simGreen++;
            else if (qualityName === '藍') simBlue++;
            else if (qualityName === '紫') simPurple++;
            else if (qualityName === '金') simGold++;
            else if (qualityName === '紅') simRed++;

            if (qualityName === '紅' && rand() < highQualityRate) {
                simMerit += meritBase;
            }
        }

        totalGain += simGain;
        totalLingYong += simLingYong;
        totalMerit += simMerit;
        totalWhite += simWhite;
        totalGreen += simGreen;
        totalBlue += simBlue;
        totalPurple += simPurple;
        totalGold += simGold;
        totalRed += simRed;
    }

    const avgGain = totalGain / SIMULATION_ROUNDS;
    const avgLingYong = totalLingYong / SIMULATION_ROUNDS;
    const avgMerit = totalMerit / SIMULATION_ROUNDS;
    const totalFruits = count * SIMULATION_ROUNDS;

    return {
        avgGain,
        avgLingYong,
        avgMerit,
        avgQuality: {
            白: (totalWhite / totalFruits) * 100,
            綠: (totalGreen / totalFruits) * 100,
            藍: (totalBlue / totalFruits) * 100,
            紫: (totalPurple / totalFruits) * 100,
            金: (totalGold / totalFruits) * 100,
            紅: (totalRed / totalFruits) * 100,
        },
        fruitCount,
    };
}

function formatInteger(num) {
    return Math.round(num).toLocaleString('zh-TW');
}

export default function OtherCalculators() {
    const isMobile = window.mobileCheck?.() || false;


    const [selectedRealm, setSelectedRealm] = useState('真仙');
    const [currentLevels, setCurrentLevels] = useState({ 修為: 1, 品質: 1, 靈湧: 1, 高品: 1 });
    const [targetLevels, setTargetLevels] = useState({ 修為: 30, 品質: 30, 靈湧: 30, 高品: 30 });
    const [wanYaoLingCount, setWanYaoLingCount] = useState(0);

    const [tier, setTier] = useState(10); 
    const [stage, setStage] = useState(2); 
    const [cultivationLevel, setCultivationLevel] = useState(30);
    const [qualityLevel, setQualityLevel] = useState(30);
    const [spiritLevel, setSpiritLevel] = useState(30);
    const [highQualityLevel, setHighQualityLevel] = useState(30);
    const [isCurrentRealm, setIsCurrentRealm] = useState(false);
    const [fruitCount, setFruitCount] = useState(100);

    const branches = ['修為', '品質', '靈湧', '高品'];
    const realmData = HUALINGTAI_DATA[selectedRealm];
    const perGain = PER_GAIN_MAP[selectedRealm] || 320;

    const calculateUpgrade = () => {
        if (!realmData) return null;
        let totalCost = 0;
        let branchDetails = {};
        branches.forEach(branch => {
            const costs = realmData[branch];
            if (!costs) {
                branchDetails[branch] = { cost: 0, start: 0, end: 0 };
                return;
            }
            const start = currentLevels[branch] || 1;
            const end = targetLevels[branch] || 1;
            if (start > end) {
                branchDetails[branch] = { cost: 0, start, end, error: '目標等級不能小於當前等級' };
                return;
            }
            let cost = 0;
            for (let i = start - 1; i < end; i++) {
                cost += costs[i] || 0;
            }
            branchDetails[branch] = { cost, start, end };
            totalCost += cost;
        });
        const totalTimesNeeded = Math.ceil(totalCost / perGain);
        const effectiveTimes = Math.max(0, totalTimesNeeded - wanYaoLingCount);
        const weeksNeeded = Math.ceil(effectiveTimes / 3);
        return {
            totalCost,
            totalTimesNeeded,
            effectiveTimes,
            weeksNeeded,
            perGain,
            wanYaoLingCount,
            branchDetails
        };
    };
    const result = calculateUpgrade();

    const stageExpData = useMemo(() => {
        const tierData = GameData.experience.find(d => d.tier === tier);
        if (!tierData) return { expArray: [], total: 0 };
        const expArray = tierData.levels[stage] || [];
        const total = expArray.reduce((a, b) => a + b, 0);
        return { expArray, total };
    }, [tier, stage]);

    const wanYaoResult = useMemo(() => {
        return simulateWanYao(
            tier,
            cultivationLevel,
            qualityLevel,
            spiritLevel,
            highQualityLevel,
            isCurrentRealm,
            fruitCount
        );
    }, [tier, cultivationLevel, qualityLevel, spiritLevel, highQualityLevel, isCurrentRealm, fruitCount]);

    const stagePercent = stageExpData.total > 0 ? (wanYaoResult.avgGain / stageExpData.total) * 100 : null;

    const tierName = GameData.tiers.find(t => t.id === tier)?.name || '';
    const stageName = GameData.levels[stage]?.name || '';

    return (
        <Stack spacing={3} sx={{ p: 2, maxWidth: 900, mx: 'auto' }}>
            <Typography variant="h4" align="center">其餘計算器</Typography>

            {/* -------- 化靈台升級計算 -------- */}
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6">化靈台升級計算</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack spacing={2}>
                        <Stack direction={isMobile ? "column" : "row"} spacing={2} alignItems="center" flexWrap="wrap">
                            <FormControl sx={{ minWidth: 120 }}>
                                <Select value={selectedRealm} onChange={(e) => setSelectedRealm(e.target.value)}>
                                    {REALM_LIST.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <Typography variant="body2" color="textSecondary">
                                每次獲取量(以最高戰力要求計算): {perGain}
                            </Typography>
                            <TextField
                                label="萬妖令總數量"
                                type="number"
                                value={wanYaoLingCount}
                                onChange={(e) => setWanYaoLingCount(parseInt(e.target.value) || 0)}
                                sx={{ width: 150 }}
                                inputProps={{ min: 0 }}
                            />
                        </Stack>

                        <Divider>當前等級與目標等級</Divider>
                        <Stack direction={isMobile ? "column" : "row"} spacing={2} flexWrap="wrap">
                            {branches.map(branch => (
                                <Stack key={branch} direction="row" spacing={1} alignItems="center">
                                    <Typography variant="body2" sx={{ minWidth: 40 }}>{branch}</Typography>
                                    <TextField
                                        label="當前"
                                        type="number"
                                        size="small"
                                        value={currentLevels[branch]}
                                        onChange={(e) => {
                                            let val = parseInt(e.target.value) || 1;
                                            if (val > 30) val = 30;
                                            if (val < 1) val = 1;
                                            setCurrentLevels({ ...currentLevels, [branch]: val });
                                        }}
                                        sx={{ width: 70 }}
                                        inputProps={{ min: 1, max: 30 }}
                                    />
                                    <TextField
                                        label="目標"
                                        type="number"
                                        size="small"
                                        value={targetLevels[branch]}
                                        onChange={(e) => {
                                            let val = parseInt(e.target.value) || 1;
                                            if (val > 30) val = 30;
                                            if (val < 1) val = 1;
                                            setTargetLevels({ ...targetLevels, [branch]: val });
                                        }}
                                        sx={{ width: 70 }}
                                        inputProps={{ min: 1, max: 30 }}
                                    />
                                </Stack>
                            ))}
                        </Stack>

                        {result && (
                            <Card variant="outlined" sx={{ mt: 2 }}>
                                <CardContent>
                                    <Typography variant="subtitle1" gutterBottom>升級需求</Typography>
                                    <Stack spacing={1}>
                                        {branches.map(branch => {
                                            const detail = result.branchDetails[branch];
                                            if (!detail) return null;
                                            return (
                                                <Typography key={branch} variant="body2">
                                                    {branch}: 從 {detail.start} 級到 {detail.end} 級，消耗 {formatInteger(detail.cost)} 萬妖魄
                                                    {detail.error && ` (${detail.error})`}
                                                </Typography>
                                            );
                                        })}
                                        <Divider />
                                        <Typography variant="body1">
                                            總消耗: <strong>{formatInteger(result.totalCost)}</strong> 萬妖魄
                                        </Typography>
                                        <Typography variant="body1">
                                            每次獲取: {result.perGain}，每週基礎 3 次
                                        </Typography>
                                        <Typography variant="body1">
                                            需要通關總次數: <strong>{result.totalTimesNeeded}</strong> 次
                                        </Typography>
                                        <Typography variant="body1">
                                            扣除萬妖令 {result.wanYaoLingCount} 次後，仍需 <strong>{result.effectiveTimes}</strong> 次
                                        </Typography>
                                        <Typography variant="body1">
                                            需要週數: <strong>{result.weeksNeeded}</strong> 週
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        )}
                    </Stack>
                </AccordionDetails>
            </Accordion>

            {/* -------- 萬妖果模擬 -------- */}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6">萬妖果模擬</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack spacing={2}>
                        {/* 第一行：境界、階段、萬妖果數量、是否當前境界 */}
                        <Stack direction={isMobile ? "column" : "row"} spacing={2} flexWrap="wrap" alignItems="center">
                            <FormControl sx={{ minWidth: 100 }}>
                                <Select value={tier} onChange={(e) => setTier(parseInt(e.target.value))}>
                                    {GameData.tiers.map(t => (
                                        <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl sx={{ minWidth: 100 }}>
                                <Select value={stage} onChange={(e) => setStage(parseInt(e.target.value))}>
                                    {GameData.levels.map((l, idx) => (
                                        <MenuItem key={idx} value={idx}>{l.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                label="萬妖果數量"
                                type="number"
                                value={fruitCount}
                                onChange={(e) => setFruitCount(parseInt(e.target.value) || 1)}
                                sx={{ width: 120 }}
                                inputProps={{ min: 1 }}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isCurrentRealm}
                                        onChange={(e) => setIsCurrentRealm(e.target.checked)}
                                    />
                                }
                                label="是否為當前境界"
                            />
                        </Stack>

                        <Divider />

                        {/* 第二行：四個分支等級 */}
                        <Stack direction={isMobile ? "column" : "row"} spacing={2} flexWrap="wrap" alignItems="center">
                            <TextField
                                label="修為等級"
                                type="number"
                                value={cultivationLevel}
                                onChange={(e) => {
                                    let val = parseInt(e.target.value) || 1;
                                    if (val < 1) val = 1;
                                    if (val > 30) val = 30;
                                    setCultivationLevel(val);
                                }}
                                sx={{ width: 100 }}
                                inputProps={{ min: 1, max: 30 }}
                            />
                            <TextField
                                label="品質等級"
                                type="number"
                                value={qualityLevel}
                                onChange={(e) => {
                                    let val = parseInt(e.target.value) || 1;
                                    if (val < 1) val = 1;
                                    if (val > 30) val = 30;
                                    setQualityLevel(val);
                                }}
                                sx={{ width: 100 }}
                                inputProps={{ min: 1, max: 30 }}
                            />
                            <TextField
                                label="靈湧等級"
                                type="number"
                                value={spiritLevel}
                                onChange={(e) => {
                                    let val = parseInt(e.target.value) || 1;
                                    if (val < 1) val = 1;
                                    if (val > 30) val = 30;
                                    setSpiritLevel(val);
                                }}
                                sx={{ width: 100 }}
                                inputProps={{ min: 1, max: 30 }}
                            />
                            <TextField
                                label="高品等級"
                                type="number"
                                value={highQualityLevel}
                                onChange={(e) => {
                                    let val = parseInt(e.target.value) || 1;
                                    if (val < 1) val = 1;
                                    if (val > 30) val = 30;
                                    setHighQualityLevel(val);
                                }}
                                sx={{ width: 100 }}
                                inputProps={{ min: 1, max: 30 }}
                            />
                        </Stack>

                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="subtitle1" gutterBottom>模擬100次結果</Typography>
                                <Stack spacing={1}>
                                    <Typography>總修為：{formatInteger(wanYaoResult.avgGain)}</Typography>
                                    <Typography>每顆平均：{formatInteger(wanYaoResult.avgGain / fruitCount)}</Typography>
                                    {stagePercent !== null ? (
                                        <Typography>
                                            佔 {tierName}{stageName} 百分比：{stagePercent.toFixed(2)}%
                                        </Typography>
                                    ) : (
                                        <Typography>該階段無經驗數據，無法計算百分比</Typography>
                                    )}
                                    <Typography>靈湧觸發率：{(wanYaoResult.avgLingYong / fruitCount * 100).toFixed(1)}%</Typography>
                                    <Typography>功法點：{formatInteger(wanYaoResult.avgMerit)}</Typography>
                                    <Typography>品質分布：白 {wanYaoResult.avgQuality.白.toFixed(1)}% / 綠 {wanYaoResult.avgQuality.綠.toFixed(1)}% / 藍 {wanYaoResult.avgQuality.藍.toFixed(1)}% / 紫 {wanYaoResult.avgQuality.紫.toFixed(1)}% / 金 {wanYaoResult.avgQuality.金.toFixed(1)}% / 紅 {wanYaoResult.avgQuality.紅.toFixed(1)}%</Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Stack>
                </AccordionDetails>
            </Accordion>
        </Stack>
    );
}