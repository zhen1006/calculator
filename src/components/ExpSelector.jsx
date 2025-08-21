import {Button, FormControl, Input, InputLabel, MenuItem, Select, Stack} from "@mui/material";
import {exps, tierList, levelList} from "../data/data.js";
import {useEffect, useState} from "react";

export function ExpSelector (props) {
    let isMobile = window.mobileCheck();
    let tier, setTier, level, setLevel, process, setProcess, exp, setExp;

    useEffect(() => {
        if (props.level === 3 && props.exp === 0) {
            setExp(exps[props.tier][2][19]);
        }
    }, [props.level])

    if (props.full) {
        ({tier, setTier, level, setLevel, process, setProcess, exp, setExp} = props);
    } else {
        [tier, setTier] = useState(props.tier);
        [level, setLevel] = useState(props.level);
        [process, setProcess] = useState(props.process);
        [exp, setExp] = useState(0);

        useEffect(() => {
            props.setData({
                tier: tier,
                level: level,
                process: process,
                exp: exp,
            });

        }, [tier, level, process, exp]);

        useEffect(() => {
            setTier(props.tier);
            setLevel(level > props.level ? level : props.level);
            setProcess((process > props.process || level > props.level) ? process : props.process);
        }, [props.tier, props.level, props.process]);
    }

    return <Stack direction={isMobile ? "column" : "row"} alignItems={"center"} justifyContent={"center"} width={"90%"}>

        <Stack mb={1} direction={"row"} alignItems={"center"} justifyContent={"center"} width={"100%"}>
            <FormControl variant={"standard"} fullWidth>
                <InputLabel htmlFor={"tier-select"}>境界</InputLabel>
                <Select
                    id={"tier-select"}
                    onChange={(e) => setTier(e.target.value)}
                    label={"境界"}
                    value={props.lock ? props.tier : tier}
                    disabled={props.lock}
                >
                    {tierList.map((n, i) => (
                        <MenuItem key={n} value={i}>{n}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl variant={"standard"} fullWidth>
                <InputLabel htmlFor={"level-select"}>階段</InputLabel>
                <Select
                    id={"level-select"}
                    label={"階段"}
                    onChange={(e) => setLevel(e.target.value)}
                    value={level}
                >
                    {levelList.filter((_, i) => i >= props.level || !props.lock).map((n, i) => <MenuItem key={n} value={levelList.indexOf(n)}>{n}</MenuItem>)}
                </Select>
            </FormControl>

            <FormControl variant={"standard"} fullWidth>
                <InputLabel htmlFor={"process-select"}>進度</InputLabel>
                <Select
                    id={"process-select"}
                    label={"進度"}
                    onChange={(e) => setProcess(e.target.value)}
                    value={level === 3 ? 19 : process}
                    disabled={level === 3}
                >
                    {[...Array(exps[tier][level].length).keys()].filter((_, i) => i > props.process || level > props.level || !props.lock).map((n, i) => <MenuItem key={n} value={n}>{n + 1}重</MenuItem>)}
                </Select>
            </FormControl>
        </Stack>
        <FormControl variant={"standard"} fullWidth sx={{ mb: 1 }}>
            <InputLabel htmlFor={"process-input"}>經驗</InputLabel>
            <Input
                id={"process-input"}
                variant={"standard"}
                label={"經驗"}
                value={exp}
                onChange={(e) => setExp(parseFloat(e.target.value))}
                type="number"
                endAdornment={"/" + (level === 3 ? exps[tier][2][19] : exps[tier][level][process])}
                sx={{"*": {textAlign: "center"}}}
            />
        </FormControl>
        <Button variant={"outlined"} sx={{ ml: 1 }} onClick={() => {
            setLevel(2);
            setProcess(exps[tier][2].length-1);
            setExp(exps[tier][2][exps[tier][2].length-1]);
        }}>
            圓滿
        </Button>
    </Stack>

}