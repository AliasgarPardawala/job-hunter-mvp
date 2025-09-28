import React from "react";
import { Chip } from "@mui/material";

export default function TagBadge({ children }: { children: React.ReactNode }) {
    return <Chip label={children} color="primary" size="small" sx={{ mr: 1 }} />;
}
