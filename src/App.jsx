import './App.css'
import {Link, Outlet, useNavigate, useLocation} from "react-router-dom";
import {
    Box, Button,
    Container,
    createTheme,
    Dialog, DialogContent,
    DialogTitle, Divider,
    IconButton,
    Paper, Stack,
    Tab,
    Tabs,
    ThemeProvider
} from "@mui/material";
import {useState, useEffect} from "react";
import {VolunteerActivism} from "@mui/icons-material";

function App() {
    const navigate = useNavigate();
    const location = useLocation();

    // 安全處理 hash，避免 undefined 錯誤
    const getInitialTab = () => {
        if (typeof window !== "undefined" && window.location.hash) {
            const hash = window.location.hash.split("/").pop();
            return hash && hash !== "" ? "/" + hash : "/exp";
        }
        return "/exp";
    };

    const [tab, setTab] = useState(getInitialTab());
    const [donate, setDonate] = useState(false);

    // 當路由改變時，更新 tab 狀態
    useEffect(() => {
        if (location.hash.includes("exp")) {
            setTab("/exp");
        }
    }, [location]);

    return (
        <ThemeProvider theme={createTheme({
            palette: { mode: "dark" }
        })}>
            <Paper sx={{borderBottom: 1, borderColor: 'divider', position: "absolute", zIndex: 99, width: "100%"}}>
                <Tabs
                    centered
                    value={tab}
                    onChange={(e, v) => {
                        setTab(v);
                        navigate(v);
                    }}
                    aria-label="basic tabs example"
                >
                    <Tab value={"/exp"} label="經驗計算器"/>
                </Tabs>
                <IconButton
                    onClick={() => setDonate(true)}
                    color={"success"}
                    sx={{position: "absolute", top: 0, right: 0}}
                >
                    <VolunteerActivism/>
                </IconButton>
                <Dialog
                    maxWidth={"md"}
                    fullWidth
                    open={donate}
                    onClose={() => setDonate(false)}
                >
                    <DialogTitle>考慮支持我!</DialogTitle>
                    <DialogContent>
                        <Stack
                            direction={window.mobileCheck() ? "column" : "row"}
                            spacing={1}
                            className={"items-center justify-center"}
                            sx={{ fontSize: window.mobileCheck() ? 16 : 32 }}
                        >
                            UID:&nbsp;&nbsp;
                            <Box sx={{
                                backgroundColor: "gray",
                                px: 0.5,
                                borderRadius: 1
                            }}>暫時不開放</Box>
                            <Button onClick={() => navigator.clipboard.writeText("x")}>複製</Button>
                        </Stack>
                    </DialogContent>
                </Dialog>
            </Paper>
            <Container sx={{mt: 10}} maxWidth={"md"}>
                <Outlet/>
            </Container>
        </ThemeProvider>
    )
}

export default App
