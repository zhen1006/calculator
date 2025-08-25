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

export default function SaveLoader({save, load}) {
    const [updateCount, setUpdateCount] = useState(0);
    const fileInputRef = Array.from({length: 5}, () => useRef(null));

    return (
        <Accordion>
            <AccordionSummary>存檔</AccordionSummary>
            <AccordionDetails>
                <List>
                    {[...Array(5).keys()].map(i => {
                        let data = null;
                        try {
                            data = JSON.parse(localStorage.getItem(`data ${i}`));
                        } catch (e) {
                            data = null;
                        }
                        return (
                            <ListItem
                                key={i}
                                sx={{
                                    "&:hover": { backgroundColor: "rgba(255,255,255,0.25)" },
                                    transition: "background-color ease-out 0.1s, background-color ease-out 0.5s",
                                }}
                                secondaryAction={
                                    <>
                                        <IconButton color="success" onClick={() => { save(i); setUpdateCount(v => v + 1); }}>
                                            <Save />
                                        </IconButton>
                                        <IconButton color="primary" disabled={!data} onClick={() => load(i)}>
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
                                                                    save(i, JSON.parse(e.target.result));
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
                                    primary={`0${i + 1}. ${!data ? "NO DATA" : `${tierList[data.tier]}${levelList[data.level]}${data.level === 3 ? "" : `${data.process}重`}`}`}
                                />
                            </ListItem>
                        );
                    })}
                </List>
            </AccordionDetails>
        </Accordion>
    );
}