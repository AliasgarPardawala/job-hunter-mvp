import {Card, MenuItem, Select, Typography, TextField} from "@mui/material";
import {styled} from "@mui/material/styles";

type FilterCardProps = {
    q: string;
    setQ: (v: string) => void;
    category: string;
    setCategory: (v: string) => void;
    company: string;
    setCompany: (v: string) => void;
    sort: string;
    setSort: (v: string) => void;
    totalItems: number;
    currentItems: [number, number];
};

const StyledCard = styled(Card)`
    display: flex;
    align-items: center;
    justify-content: start;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 12px;
    background-color: var(--bg-white);
    box-shadow: var(--shadow-light);
    gap: 1rem;
`;

const StyledSelect = styled(Select)`
    color: var(--text-muted);
    font-weight: 500;
    padding: 0rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: 8px;
`;

const ShowingText = styled(Typography)`
    color: var(--text-strong);
`;

function JobFilterBar({
  q,
  setQ,
  category,
  setCategory,
  company,
  setCompany,
  sort,
  setSort,
  totalItems,
  currentItems
}: FilterCardProps) {

    return (
        <StyledCard elevation={12}>
            <TextField
                label="Search jobs"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                size="medium"
            />
            <TextField
                label="Search Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
            />
            <StyledSelect
                value={category}
                onChange={(e) => setCategory(e.target.value as string)}
                disableUnderline
            >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="tech">Technical</MenuItem>
                <MenuItem value="Non Tech">Non Tech</MenuItem>
                <MenuItem value="legal">Legal</MenuItem>
            </StyledSelect>
            <TextField
                select
                label="Sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
            >
                <MenuItem value="date">Newest</MenuItem>
                <MenuItem value="title">Title A–Z</MenuItem>
            </TextField>

            <ShowingText variant="body2">
                Showing {currentItems[0]} - {currentItems[1]} of {totalItems} jobs
            </ShowingText>
        </StyledCard>
    );
}

export default JobFilterBar;
