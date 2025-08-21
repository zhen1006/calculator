import {
    FormControl, InputLabel,
    MenuItem, Select,
    Stack,
    Typography
} from "@mui/material";
import React, {useEffect, useMemo} from "react";

export default function Web({count, acc, setW}) {
    const [method, setMethod] = React.useState(0);

    const methodCost = [8, 16, 24, 38, 78, 98, 118, 158, 218, 238, 398, 788, 1588, 2288, 4488, 7888];
    const methodEarn = [600, 1200, 1800, 3000, 6800, 8800, 10000, 13500, 19000, 20500, 33800, 68000, 138000, 208300, 419700, 699500];

    // 用 useMemo 優化計算
    const {money, times, cost, effic} = useMemo(() => {
        const money = count * 100;
        const times = Math.floor(money / methodEarn[method] * acc) / acc;
        const cost = Math.floor(methodCost[method] * times * acc) / acc;
        const effic = count > 0 ? Math.floor(cost / count * acc) / acc : 0;
        return {money, times, cost, effic};
    }, [count, acc, method]);

    useEffect(() => {
        setW(effic);
    }, [effic, setW]);

    return (
        <Stack spacing={3} sx={{ width: { xs: "95vw", sm: "60vw", md: "30vw" }, maxWidth: 400, height: "100%" }} justifyContent="space-between">
            <Stack spacing={3}>
                <Typography variant="h3">代金 (官網)</Typography>
                <Typography variant="h4">×100 = <b>{money}代金</b></Typography>
                <FormControl fullWidth>
                    <InputLabel id="method-select-label">兑换方案</InputLabel>
                    <Select
                        labelId="method-select-label"
                        id="method-select"
                        value={method}
                        label="兑换方案"
                        onChange={e => setMethod(Number(e.target.value))}
                    >
                        {methodCost.map((v, i) =>
                            <MenuItem key={v} value={i}>HKD${v} ({methodEarn[i]}代金)</MenuItem>
                        )}
                    </Select>
                </FormControl>
                <Typography>÷ <b>{methodEarn[method]}</b> = <b>{times}</b>次</Typography>
            </Stack>
            <Stack spacing={3}>
                <Typography variant="h4">總消耗: HKD$<b>{cost}</b></Typography>
                <Typography variant="h4" color="secondary">總效率: HKD$<b>{effic}</b>/積分</Typography>
            </Stack>
        </Stack>
    );
}