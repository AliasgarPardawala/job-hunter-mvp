import {useEffect, useState} from "react";
import JobCard from "./JobCard";
import PaginationControls from "./PaginationControls";
import {Box, Typography} from "@mui/material";
import JobFilterBar from "./FilterBar.tsx";

type Job = {
    id: number;
    title: string;
    company?: string;
    location?: string;
    date?: string;
    summary?: string;
    tags?: string;
    url: string;
};

export default function JobList() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [q, setQ] = useState("");
    const [category, setCategory] = useState("all");
    const [company, setCompany] = useState("");
    const [sort, setSort] = useState("date");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [meta, setMeta] = useState<{ total: number; pages: number; currentItems: [number, number] }>({
        total: 0,
        pages: 0,
        currentItems: [0, 0]
    });

    const fetchJobs = async () => {
        const params = new URLSearchParams({
            q,
            company,
            sort,
            category,
            page: String(page),
            limit: String(limit),
        });
        const res = await fetch(`/api/jobs?${params.toString()}`);
        const json = await res.json();
        setJobs(json.data);
        setMeta({
            ...json.meta,
            currentItems: [(page - 1) * limit + 1, page * limit > json.meta.total ? json.meta.total : page * limit]

        });
    };

    useEffect(() => {
        fetchJobs();
    }, [q, category, company, sort, page]);

    return (
        <Box sx={{margin: "0 auto", paddingX: "4rem"}}>
            <Box sx={{margin: "4rem 0"}}>
                <Typography variant="h2" sx={{margin: "2rem 0", fontWeight: "bold"}}>Job Board</Typography>
                <Typography variant="h6" sx={{margin: "2rem 0"}}>Find your dream jobs</Typography>
            </Box>
            <Box sx={{mb: 4}}>
                <JobFilterBar
                    q={q}
                    setQ={setQ}
                    category={category}
                    setCategory={setCategory}
                    company={company}
                    setCompany={setCompany}
                    sort={sort}
                    setSort={setSort}
                    totalItems={meta.total}
                    currentItems={meta.currentItems}/>
            </Box>
            {!jobs.length &&
                <Box sx={{margin: "4rem 0"}}>
                    <Typography variant="h6" sx={{margin: "2rem 0"}}>No Jobs</Typography>
                </Box>}

            {jobs.map((j) => (
                <JobCard key={j.id} job={j}/>
            ))}

            <PaginationControls page={page} pages={meta.pages} setPage={setPage}/>
        </Box>
    );
}
