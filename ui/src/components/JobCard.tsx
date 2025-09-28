import {Card, CardContent, Typography, Button, Box, styled} from "@mui/material";
import {Apartment, WatchLater, IosShare} from '@mui/icons-material';
import TagBadge from "./TagBadge";

const StyledCard = styled(Card)`
    padding: 0.5rem;
    border-radius: 1rem;
    margin-bottom: 1rem;
`

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

export default function JobCard({job}: { job: Job }) {
    return (
        <StyledCard variant="outlined">
            <CardContent sx={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                <Box display="flex" flexDirection="column" alignItems="start" gap={1}>
                    <Box>
                        <Typography variant="h5" fontWeight={600}>{job.title}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Typography variant="subtitle2" color="text.secondary" alignItems="center" display="flex">
                            <Apartment sx={{mr: 1}}/> {job.company}
                        </Typography>

                        <Typography variant="subtitle2" color="text.secondary" alignItems="center" display="flex">
                            {job.location}
                        </Typography>

                        <Typography variant="subtitle2" color="text.secondary" alignItems="center" display="flex">
                            <WatchLater sx={{mr: 1}}/> Remote
                        </Typography>

                        <Box>
                            {job.tags &&
                                job.tags.split(",").slice(0, 4).map((t, i) => (
                                    <TagBadge key={i}>{t.trim()}</TagBadge>
                                ))}
                        </Box>
                    </Box>
                </Box>

                <Box>
                    <Button
                        sx={{display: "flex", alignItems: "center", padding: "0.5rem 1rem"}}
                        variant="contained"
                        color="primary"
                        onClick={() => window.open(job.url, "_blank", "noopener")}
                    >
                        <IosShare sx={{mr: 1}}/> Apply Now
                    </Button>
                </Box>
            </CardContent>
        </StyledCard>
    );
}
