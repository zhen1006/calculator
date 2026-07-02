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

    return (
        <Accordion>
            <AccordionSummary>存檔</AccordionSummary>
            <AccordionDetails>
                <List>
                    {[...Array(5).keys()].map(i => {
                        const data = getSaveData(i);
                        return (
                            <ListItem
                                key={i}
                                sx={{
                                    "&:hover": { backgroundColor: "rgba(255,255,255,0.25)" },
                                    transition: "background-color ease-out 0.1s, background-color ease-out 0.5s",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                }}
                                secondaryAction={
                                    <>
                                        <IconButton color="success" onClick={() => { save(i); setUpdateCount(v => v + 1); }}>
                                            <Save />
                                        </IconButton>
                                        <IconButton color="primary" disabled={!data} onClick={() => { load(i); }}>
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
                                                                    const parsedData = JSON.parse(e.target.result);
                                                                    save(i, parsedData);
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
                                    primary={`0${i + 1}. ${formatSaveName(data)}`}
                                    secondary={formatSaveDetail(data)}
                                    secondaryTypographyProps={{ sx: { fontSize: '0.75rem', color: 'text.secondary' } }}
                                />
                            </ListItem>
                        );
                    })}
                </List>
            </AccordionDetails>
        </Accordion>
    );
}