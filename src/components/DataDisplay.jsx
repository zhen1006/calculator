import {
    Button,
    ButtonGroup,
    Card,
    CardContent,
    CardHeader, CircularProgress,
    Divider,
    Paper, Slider,
    Stack,
    Table, TableBody, TableCell, TableHead, TableRow,
    Typography
} from "@mui/material";
import {LineChart} from "@mui/x-charts";
import {ZoomIn, ZoomOut} from "@mui/icons-material";
import Grid from "@mui/material/Grid2";
import {useEffect, useState} from "react";
import {timeString, formatNumber} from "../data/functions.js";
import {tierList, levelList, stone, chartLs, exps, buffs} from "./../data/data.js";


export function DataDisplay({final, fullTime, counters, record}) {

    const isMobile = window.mobileCheck();

    const [blacklisted, setBlacklisted] = useState([]);
    const dayPass = record.length;
    const [range, setRange] = useState([1, dayPass  ]);
    const totalGain = Math.round(record.slice(range[0], range[1]).reduce((total, obj) => total + Object.keys(obj).reduce((acc, key) => !blacklisted.includes(key) ? acc + obj[key] : acc, 0), 0) * 100) / 100;
    const [zoom, setZoom] = useState(1.5);
    const [loading, setLoading] = useState(true);

    const percent = ([0, ...exps[final.t][final.l === 3 ? 2 : final.l].slice(0, final.p)].reduce((a, b) => a + b, 0) + final.e) / exps[final.t][final.l === 3 ? 2 : final.l].reduce((a, b) => a + b, 0) * 100;

    useEffect(() => {
        setRange([1, dayPass]);

        setLoading(true);
        setTimeout(() => setLoading(false), 200);
    }, [record]);

    setTimeout(() => setLoading(false), 200);
    return (
        loading ? <Stack alignItems={"center"}><CircularProgress color="secondary" sx={{mb: 2}}/> </Stack> :
            <Card elevation={10}>
                {final.type ? <CardContent>
                        <Typography variant={"h4"}>{fullTime / 10800}天後抵達</Typography>
                        <Typography variant={"h3"}>
                            {`${tierList[final.t]}${levelList[final.l]}${formatNumber(percent)}%`}
                        </Typography>

                        {final.l < 3 && `${final.p + 1}重[${formatNumber(final.e)}/${formatNumber(exps[final.t][final.l][final.p])}] (${formatNumber(final.e / exps[final.t][final.l][final.p] * 100)}%)`}

                    </CardContent> :
                    <CardContent>
                        <Typography variant={"h4"}>抵達
                            {final.stopLevel > 1
                                ? <span style={{color: Object.values(buffs)[final.stopLevel]}}>{Object.keys(buffs)[final.stopLevel]}{tierList[final.t + (final.stopLevel===4)*1]}</span>
                                : <span style={{color: Object.values(buffs)[final.stopLevel]}}>{tierList[final.t]}{Object.keys(buffs)[final.stopLevel]}</span>
                            }

                            總花費時間:
                        </Typography>
                        <Typography variant={"h3"}>{timeString(fullTime * 8)}</Typography>
                        ({Math.round(fullTime / 112.5 * 100) / 100}道年)

                        {final.l > 2 ? <Typography variant={"h6"}>
                                溢出{formatNumber(final.e)}修為 {isMobile && <br/>}
                                ({tierList[final.t] + levelList[final.l]} {formatNumber(percent + 100)}%)
                            </Typography> :
                            <Typography>{`抵達${tierList[final.t]}${levelList[final.l]}${final.p + 1}重${formatNumber(percent)}%`}<br/>
                                {`[${formatNumber(final.e)}/${formatNumber(exps[final.t][final.l][final.p])}] (${formatNumber(final.e / exps[final.t][final.l][final.p] * 100)}%)`}
                            </Typography>}
                    </CardContent>
                }

                <Divider/>

                <Card>
                    <CardHeader title={"圖表"}/>
                    <CardContent>
                        {record.length > 1 ?
                            <Stack alignItems={"center"} justifyContent={"center"}>
                                {isMobile ? "請使用電腦查看圖表" : <Stack direction={"row"} alignItems={"center"}>
                                    <Stack pb={3} spacing={2}>
                                        <LineChart
                                            dataset={record.map(obj => {
                                                const filteredObj = Object.keys(obj)
                                                    .filter(key => !blacklisted.includes(key)) // Remove blacklisted keys
                                                    .reduce((acc, key) => {
                                                        acc[key] = obj[key]; // Keep remaining key-value pairs
                                                        return acc;
                                                    }, {});

                                                filteredObj.sum = Object.values(filteredObj).reduce((acc, value) => acc + value, 0); // Calculate sum
                                                return filteredObj;
                                            })}
                                            slotProps={{legend: {hidden: true}}}
                                            xAxis={[
                                                {
                                                    id: "days",
                                                    min: range[0],
                                                    max: range[1],
                                                    data: Array.from({length: dayPass + 1}, (v, k) => k + 1),
                                                    valueFormatter: (x) => {
                                                        return x + "天";
                                                    },
                                                },
                                                {
                                                    id: "reach",
                                                    data: Array.from({length: dayPass + 1}, (v, k) => k + 1).splice(range[0], range[1]),
                                                    scaleType: "point",
                                                    valueFormatter: (x) => {
                                                        return counters.reachDays[x.toString()];
                                                    },
                                                    tickInterval: (day) => Object.keys(counters.reachDays).includes((day).toString()),
                                                },
                                            ]}
                                            yAxis={[{
                                                domainLimit: () => ({
                                                    min: 0,
                                                    max: totalGain / (range[1] - range[0]) * zoom
                                                }),
                                                valueFormatter: (x) => {
                                                    return (x / 10000).toString() + "萬";
                                                },
                                            }]}
                                            series={[
                                                {
                                                    id: "sum",
                                                    label: "總數",
                                                    dataKey: "sum",
                                                    area: false,
                                                    showMark: false,
                                                    color: "black"
                                                },
                                                ...[...chartLs.slice(0, 4), ...chartLs.slice(5), chartLs[4]].map(i => { // move table to the last
                                                    return {
                                                        id: i[0],
                                                        label: i[1],
                                                        dataKey: i[0],
                                                        stack: "total",
                                                        area: true,
                                                        showMark: false,
                                                        color: i[2]
                                                    }
                                                })]}

                                            topAxis={{
                                                min: range[0],
                                                max: range[1],
                                                axisId: "reach",
                                                labelStyle: {
                                                    fontSize: 14,
                                                    transform: `translateY(${
                                                        5 * Math.abs(Math.sin((Math.PI * -45) / 180))
                                                    }px)`
                                                },
                                                tickLabelStyle: {
                                                    angle: -45,
                                                    textAnchor: 'start',
                                                },
                                            }}
                                            bottomAxis={"days"}
                                            height={500}
                                            width={550}
                                            margin={{ top: 80 }}
                                        />
                                        <Slider
                                            value={range}
                                            onChange={(event, newValue, activeThumb) => {
                                                if (!Array.isArray(newValue)) {
                                                    return;
                                                }

                                                let minDistance = 2;

                                                if (activeThumb === 0) {
                                                    setRange([Math.min(newValue[0], range[1] - minDistance), range[1]]);
                                                } else {
                                                    setRange([range[0], Math.max(newValue[1], range[0] + minDistance)]);
                                                }
                                            }}
                                            valueLabelDisplay="on"
                                            min={1}
                                            max={dayPass}

                                        />
                                    </Stack>
                                    <ButtonGroup orientation={"vertical"}>
                                        <Button onClick={() => setZoom(zoom - 0.25)}><ZoomIn/></Button>
                                        <Button onClick={() => setZoom(zoom + 0.25)}><ZoomOut/></Button>
                                    </ButtonGroup>
                                </Stack>}

                                {/*<FormGroup row>*/}
                                {/*    {chartLs.map(i =>*/}
                                {/*        <FormControlLabel*/}
                                {/*            color={i[2]}*/}
                                {/*            checked={!blacklisted.includes(i[0])}*/}
                                {/*            control={<Checkbox sx={{ "svg": { color: i[2] } }}/>} label={i[1]}*/}
                                {/*            onChange={() => blacklisted.includes(i[0]) ? setBlacklisted(blacklisted.filter(a => a !== i[0])) : setBlacklisted([...blacklisted, i[0]])}*/}
                                {/*            key={i[0]}*/}
                                {/*        />*/}
                                {/*    )}*/}
                                {/*</FormGroup>*/}
                                <Paper elevation={8} sx={{width: isMobile ? "100%" : "75%", overflowX: "auto"}}>
                                    <Table size={"small"} sx={{width: isMobile ? "max-content" : "100%"}}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>數據</TableCell>
                                                <TableCell align={"right"}>平均速度/天</TableCell>
                                                <TableCell align={"right"}>總修為</TableCell>
                                                <TableCell align={"right"}>佔比</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>總數</TableCell>
                                                <TableCell
                                                    align={"right"}>{formatNumber(totalGain / dayPass)}</TableCell>
                                                <TableCell align={"right"}>{formatNumber(totalGain)}</TableCell>
                                                <TableCell align={"right"}>100%</TableCell>
                                            </TableRow>
                                            {chartLs.map((c, i) => {
                                                let gain = record.slice(range[0], range[1]).map(r => r[c[0]]).reduce((f, e) => f + e, 0);
                                                return <TableRow color={c[2]} key={c[0]}>
                                                    <TableCell>{c[1]}</TableCell>
                                                    <TableCell
                                                        align={"right"}>{formatNumber(gain / dayPass)}</TableCell>
                                                    <TableCell
                                                        align={"right"}>{formatNumber(gain)}</TableCell>
                                                    <TableCell
                                                        align={"right"}>{formatNumber(gain / totalGain * 100)}%</TableCell>
                                                </TableRow>
                                            })}
                                        </TableBody>
                                    </Table>
                                </Paper>
                            </Stack> :
                            <Stack alignItems={"center"} justifyContent={"center"}>
                                <Typography variant={"h3"} sx={{color: "rgba(255,255,255,0.5)"}}>
                                    時間太短，無法製作圖表
                                </Typography>
                            </Stack>}

                    </CardContent>
                </Card>

                <Divider/>
                <Grid container spacing={2} padding={isMobile ? 1 : 5}>
                    {[
                        ["機緣消耗", 6, false, counters.chance],
                        ["吐吶次數", 6, false, counters.breathe],
                        ["丹藥消耗", 12, true,
                            <Stack alignItems={"center"} justifyContent={"space-around"}
                                   direction={isMobile ? "column" : "row"}>
                                {Object.entries(stone).map(([k, color], i) => {
                                    if (i === 0) return
                                    return <Stack direction={!isMobile ? "column" : "row"} alignItems={"center"}
                                                  justifyContent={"space-between"} width={"100%"} key={k}>
                                        <Typography variant={"h5"} sx={{color: color}}>{k}品</Typography>
                                        <Typography variant={isMobile ? "h4" : "h2"} sx={{
                                            color: color,
                                            opacity: 0.5
                                        }}>{counters.med[i - 1]}</Typography>
                                    </Stack>
                                })}
                            </Stack>],
                        ["萬妖果進食量", 6, false, counters.eat],
                        ["靈湧次數", 6, false, counters.doubles],
                    ].map((d) => <Grid item size={d[1]} key={d[0]}>
                        <Card elevation={5}>
                            <CardHeader title={d[0]} sx={{"span": isMobile ? {fontSize: 16} : {}}}></CardHeader>
                            <CardContent>
                                {d[2] ? d[3] :
                                    <Stack alignItems={"center"} justifyContent={"center"}>
                                        <Typography variant={"h1"} sx={{color: "rgba(255,255,255,0.5)"}}>
                                            {d[3]}
                                        </Typography>
                                    </Stack>}
                            </CardContent>
                        </Card>
                    </Grid>)}
                </Grid>
            </Card>
    )
}