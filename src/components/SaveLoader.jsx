import {
    Accordion,
    AccordionDetails,
    AccordionSummary, IconButton,
    List,
    ListItem,
    ListItemText
} from "@mui/material";
import {Delete, Download, InputOutlined, Save, Upload} from "@mui/icons-material";
import {useRef, useState} from "react";
import {levelList, tierList} from "../data/data.js";
import {toast} from "react-toastify";
import {download} from "../data/functions.js";

<<<<<<< HEAD
export default function SaveLoader({save, load, relaod, value}) {
    const [updateCount, setUpdateCount] = useState(0);
    const fileInputRef = Array.from({length: 5}, () => useRef(null));

    const getSaveData = (i) => {
        try {
            return JSON.parse(localStorage.getItem(`data ${i}`));
        } catch (e) {
            return null;
        }
    };

    const formatSaveName = (data) => {
        if (!data) return "NO DATA";
        const tierName = tierList[data.tier] || "未知";
        const levelName = levelList[data.level] || "未知";
        const processInfo = data.level === 3 ? "" : `${data.process + 1}重`;
        return `${tierName}${levelName}${processInfo}`;
    };

    const formatSaveDetail = (data) => {
        if (!data) return "";
        const parts = [];
        if (data.subProcess) {
            const subTier = tierList[data.subProcess.tier] || "未知";
            const subLevel = levelList[data.subProcess.level] || "未知";
            const subProcess = data.subProcess.level === 3 ? "" : `${data.subProcess.process + 1}重`;
            parts.push(`輔:${subTier}${subLevel}${subProcess}`);
        }
        if (data.thirdProcess) {
            const thirdTier = tierList[data.thirdProcess.tier] || "未知";
            const thirdLevel = levelList[data.thirdProcess.level] || "未知";
            const thirdProcess = data.thirdProcess.level === 3 ? "" : `${data.thirdProcess.process + 1}重`;
            parts.push(`三:${thirdTier}${thirdLevel}${thirdProcess}`);
        }
        if (data.stoneLevel !== undefined && data.stoneLevel > 0) {
            const stoneNames = ["無", "下品", "中品", "上品", "極品", "仙品", "超越仙品"];
            parts.push(`納:${stoneNames[data.stoneLevel] || "無"}`);
        }
        if (data.furnaceEnabled) {
            parts.push("爐");
        }
        if (data.nichenzhuEnabled) {
            parts.push(`逆${data.nichenzhuStars || 0}星`);
        }
        if (data.fenqiEnabled && data.fenqiBonus > 0) {
            parts.push(`奮${data.fenqiBonus}%`);
        }
        if (data.wanjieTianyuanEnabled && data.wanjieTianyuanBonus > 0) {
            parts.push(`萬${data.wanjieTianyuanBonus}%`);
        }
        if (data.yaojieEnabled && data.yaojieBonus > 0) {
            parts.push(`妖${data.yaojieBonus}%`);
        }
        return parts.join(" ");
    };

=======
export default function SaveLoader({save, load}) {
    const [updateCount, setUpdateCount] = useState(0);
    const fileInputRef = Array.from({length: 5}, () => useRef(null));

>>>>>>> 3091d3657786ba31276672684014deafbfd6cc4d
    return (
        <Accordion>
            <AccordionSummary>存檔</AccordionSummary>
            <AccordionDetails>
                <List>
                    {[...Array(5).keys()].map(i => {
<<<<<<< HEAD
                        const data = getSaveData(i);
=======
                        let data = null;
                        try {
                            data = JSON.parse(localStorage.getItem(`data ${i}`));
                        } catch (e) {
                            data = null;
                        }
>>>>>>> 3091d3657786ba31276672684014deafbfd6cc4d
                        return (
                            <ListItem
                                key={i}
                                sx={{
                                    "&:hover": { backgroundColor: "rgba(255,255,255,0.25)" },
                                    transition: "background-color ease-out 0.1s, background-color ease-out 0.5s",
<<<<<<< HEAD
                                    flexDirection: "column",
                                    alignItems: "flex-start",
=======
>>>>>>> 3091d3657786ba31276672684014deafbfd6cc4d
                                }}
                                secondaryAction={
                                    <>
                                        <IconButton color="success" onClick={() => { save(i); setUpdateCount(v => v + 1); }}>
                                            <Save />
                                        </IconButton>
<<<<<<< HEAD
                                        <IconButton color="primary" disabled={!data} onClick={() => { load(i); }}>
=======
                                        <IconButton color="primary" disabled={!data} onClick={() => load(i)}>
>>>>>>> 3091d3657786ba31276672684014deafbfd6cc4d
                                            <InputOutlined />
                                        </IconButton>
                                        <IconButton color="error" disabled={!data} onClick={() => {
                                            localStorage.removeItem(`data ${i}`);
                                            toast.error("已刪除");
                                            setUpdateCount(v => v + 1);
                                        }}>
                                            <Delete />
                                        </IconButton>
                                        <IconButton color="secondary" disabled={!data} onClick={() => {
                                            download(`save0${i}.ynsy`, JSON.stringify(data));
                                        }}>
                                            <Download />
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => fileInputRef[i].current.click()}>
                                            <input
                                                type="file"
                                                accept=".ynsy"
                                                onChange={event => {
                                                    const file = event.target.files[0];
                                                    if (file) {
                                                        if (file.name.endsWith('.ynsy')) {
                                                            const reader = new FileReader();
                                                            reader.onload = e => {
                                                                try {
<<<<<<< HEAD
                                                                    const parsedData = JSON.parse(e.target.result);
                                                                    save(i, parsedData);
=======
                                                                    save(i, JSON.parse(e.target.result));
>>>>>>> 3091d3657786ba31276672684014deafbfd6cc4d
                                                                    toast.success("已上傳");
                                                                    load(i);
                                                                    setUpdateCount(v => v + 1);
                                                                    fileInputRef[i].current.value = null;
                                                                } catch (err) {
                                                                    toast.error("檔案上傳失敗: " + err);
                                                                }
                                                            };
                                                            reader.readAsText(file);
                                                        } else {
                                                            toast.error('請上傳 .ynsy 檔案');
                                                        }
                                                    }
                                                }}
                                                style={{ display: 'none' }}
                                                ref={fileInputRef[i]}
                                            />
                                            <Upload />
                                        </IconButton>
                                    </>
                                }
                            >
                                <ListItemText
<<<<<<< HEAD
                                    primary={`0${i + 1}. ${formatSaveName(data)}`}
                                    secondary={formatSaveDetail(data)}
                                    secondaryTypographyProps={{ sx: { fontSize: '0.75rem', color: 'text.secondary' } }}
=======
                                    primary={`0${i + 1}. ${!data ? "NO DATA" : `${tierList[data.tier]}${levelList[data.level]}${data.level === 3 ? "" : `${data.process}重`}`}`}
>>>>>>> 3091d3657786ba31276672684014deafbfd6cc4d
                                />
                            </ListItem>
                        );
                    })}
                </List>
            </AccordionDetails>
        </Accordion>
    );
}