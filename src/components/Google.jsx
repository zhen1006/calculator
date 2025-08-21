import {
    FormControl, InputLabel,
    MenuItem, Select, Slider,
    Stack,
    Typography
} from "@mui/material";
import React, {useEffect, useMemo} from "react";

const marks = [6, 18, 30, 68, 98, 128, 198, 328, 648];
const Google = [8, 23, 38, 78, 118, 158, 238, 398, 788];
const levels = [
    { label: "銅 (x1)", boost: 1 },
    { label: "銀 (x1.25)", boost: 1.25 },
    { label: "金 (x1.5)", boost: 1.5 },
    { label: "鉑金 (x1.75)", boost: 1.75 },
    { label: "鑽石 (x2)", boost: 2 }
];
const methodOptions = [
    { cost: 7, earn: 100 },
    { cost: 14, earn: 200 },
    { cost: 35, earn: 500 },
    { cost: 70, earn: 1000 }
];

function calcGoogle(count, acc, level, boost, method) {
    const idx = marks.indexOf(count);
    const hkd = idx !== -1 ? Google[idx] : 0;
    const points1 = Math.round(hkd / 7 * acc) / acc;
    const points2 = Math.round(points1 * levels[level].boost * acc) / acc;
    const points3 = Math.round(points2 * boost * acc) / acc;
    const times = Math.floor(points3 / methodOptions[method].earn * acc) / acc;
    const minus = Math.floor(methodOptions[method].cost * times * acc) / acc;
    const total = Math.floor((hkd - minus) * acc) / acc;
    const effic = count > 0 ? Math.floor(total / count * acc) / acc : 0;
    return { hkd, points1, points2, points3, times, minus, total, effic };
}

export default function Google({ count, acc, setG }) {
    const [level, setLevel] = React.useState(0);
    const [boost, setBoost] = React.useState(1);
    const [method, setMethod] = React.useState(0);

    // 用 useMemo 優化計算
    const result = useMemo(
        () => calcGoogle(count, acc, level, boost, method),
        [count, acc, level, boost, method]
    );
    const { hkd, points1, points2, points3, times, minus, total, effic } = result;

    useEffect(() => {
        setG(effic);
    }, [effic, setG]);

    return (
        <Stack spacing={3} sx={{ width: { xs: "95vw", sm: "60vw", md: "30vw" }, maxWidth: 400 }}>
            <Typography variant="h3">渠道 (Google)</Typography>
            <Typography variant="h4">= HKD$ <b>{hkd}</b></Typography>
            <Typography>÷7 = <b>{points1}</b> Play Points</Typography>

            <FormControl fullWidth>
                <InputLabel id="level-select-label">等級</InputLabel>
                <Select
                    labelId="level-select-label"
                    id="level-select"
                    value={level}
                    label="等級"
                    onChange={e => setLevel(Number(e.target.value))}
                >
                    {levels.map((l, i) => (
                        <MenuItem key={l.label} value={i}>{l.label}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Typography>× <b>{levels[level].boost}</b> = <b>{points2}</b> Play Points</Typography>

            <Slider
                onChange={(_, v) => setBoost(v)}
                value={boost}
                step={1}
                marks
                min={1}
                max={10}
                valueLabelDisplay="on"
                valueLabelFormat={i => "x" + i}
            />
            活動加成
            <Typography>× <b>{boost}</b> = <b>{points3}</b> Play Points</Typography>

            <FormControl fullWidth>
                <InputLabel id="method-select-label">兑换方案</InputLabel>
                <Select
                    labelId="method-select-label"
                    id="method-select"
                    value={method}
                    label="兑换方案"
                    onChange={e => setMethod(Number(e.target.value))}
                >
                    {methodOptions.map((opt, i) => (
                        <MenuItem key={opt.cost} value={i}>
                            HKD${opt.cost} ({opt.earn} points)
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Typography>÷ <b>{methodOptions[method].earn}</b> = <b>{times}</b>次</Typography>
            <Typography>× <b>{methodOptions[method].cost}</b> = 節省HKD$<b>{minus}</b></Typography>
            <Typography variant="h4">總消耗: HKD$<b>{total}</b></Typography>
            <Typography variant="h4" color="secondary">總效率: HKD$<b>{effic}</b>/積分</Typography>
        </Stack>
    );
}