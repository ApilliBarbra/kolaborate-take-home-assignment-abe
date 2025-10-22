import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { v4 as uuidv4 } from 'uuid'; 
import { Button, Stack, Typography, IconButton } from '@mui/material';
import CreateProfileDialog from '@/components/CreateProfileDialog';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

const columns = [
  { field: 'name', headerName: 'Name', width: 130 },
  { field: 'email', headerName: 'Email', width: 250 },
  { field: 'location', headerName: 'Location', width: 130 },
  { field: 'experienceYears', headerName: 'Experience (Yrs)', type: 'number', width: 130 },
  { field: 'availableForWork', headerName: 'Available for Work?', type: 'boolean', renderCell: (params) => params.value ? 'Yes' : 'No', width: 200 },
  { field: 'skills', headerName: 'Skills', width: 300 },
  { field: 'hourlyRate', headerName: 'Hourly Rate (USD)', type: 'number', width: 130 },
    {
    field: 'actions',
    headerName: 'Actions',
    width: 90,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <IconButton size="small" color="primary" onClick={() => params.api.getRow(params.id).__onEdit?.()}>
        <EditIcon fontSize="small" />
      </IconButton>
    )
  },
];

// Seed data
const rows = [
  {
    id: uuidv4(),
    name: "Amina K.",
    email: "amina.k@example.com",
    location: "Kampala, UG",
    skills: ["React", "Node.js", "PostgreSQL"],
    experienceYears: 2,
    availableForWork: true,
    hourlyRate: 15
  },
  {
    id: uuidv4(),
    name: "Brian O.",
    email: "brian.o@example.com",
    location: "Nairobi, KE",
    skills: ["Python", "Django", "Pandas"],
    experienceYears: 3,
    availableForWork: false,
    hourlyRate: 25
  },
  {
    id: uuidv4(),
    name: "Chantal M.",
    email: "chantal.m@example.com",
    location: "Kigali, RW",
    skills: ["Unity", "C#", "3D Graphics"],
    experienceYears: 1,
    availableForWork: true,
    hourlyRate: 18
  },
  {
    id: uuidv4(),
    name: "Daniel T.",
    email: "daniel.t@example.com",
    location: "Remote, EMEA",
    skills: ["React", "TypeScript", "GraphQL"],
    experienceYears: 4,
    availableForWork: true,
    hourlyRate: 30
  },
  {
    id: uuidv4(),
    name: "Evelyn N.",
    email: "evelyn.n@example.com",
    location: "Gulu, UG",
    skills: ["Flask", "PostgreSQL", "Docker"],
    experienceYears: 5,
    availableForWork: false,
    hourlyRate: 28
  },
  {
    id: uuidv4(),
    name: "Felix R.",
    email: "felix.r@example.com",
    location: "Mbarara, UG",
    skills: ["React", "Python", "FastAPI"],
    experienceYears: 2,
    availableForWork: true,
    hourlyRate: 20
  }
];

const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable() {

  const [openCreate, setOpenCreate] = React.useState(false);

  return (
    <Paper sx={{ height: 400, width: '100%', padding:'20px' }}>

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Developer Profiles</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreate(true)}>New Profile</Button>
      </Stack>

      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        sx={{ border: 0 }}
      />

      <CreateProfileDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSaved={() => { setToast({ open: true, message: "Profile created", severity: "success" }); refresh(); }}
      />
    </Paper>
  );
}
