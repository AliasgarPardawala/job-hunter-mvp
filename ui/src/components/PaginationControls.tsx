import { Pagination, Box } from "@mui/material";

export default function PaginationControls({
                                               page,
                                               pages,
                                               setPage,
                                           }: {
    page: number;
    pages: number;
    setPage: (p: number) => void;
}) {
    return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
                count={pages || 1}
                page={page}
                onChange={(_, val) => setPage(val)}
                color="primary"
            />
        </Box>
    );
}
