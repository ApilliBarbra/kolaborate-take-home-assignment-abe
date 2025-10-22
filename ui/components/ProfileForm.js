
import * as React from 'react';
import {
  Box, Stack, TextField, Typography, Chip, Button,
  FormControlLabel, Switch, Alert
} from '@mui/material';

/**
 * Reusable form for creating/updating a Developer Profile.
 *
 * Props:
 *  - initial: {
 *      id?, name, email, location, skills: string[],
 *      experienceYears: number, availableForWork: boolean, hourlyRate: number
 *    }
 *  - onSubmit: async (values) => void | Promise<void>
 *  - submitLabel?: string  (default: "Save")
 *  - loading?: boolean
 */
export default function ProfileForm({ initial, onSubmit, submitLabel = "Save", loading = false }) {
  const [values, setValues] = React.useState(() => (initial ?? {
    name: '', email: '', location: '', skills: [],
    experienceYears: 0, availableForWork: true, hourlyRate: 0
  }));
  const [skillInput, setSkillInput] = React.useState('');
  const [errors, setErrors] = React.useState({});
  const [formError, setFormError] = React.useState("");

  React.useEffect(() => {
    setValues(initial ?? {
      name: '', email: '', location: '', skills: [],
      experienceYears: 0, availableForWork: true, hourlyRate: 0
    });
    setErrors({});
    setFormError("");
    setSkillInput("");
  }, [initial]);

  const setField = (field) => (e) => setValues(v => ({ ...v, [field]: e.target.value }));
  const setSwitch = (field) => (e) => setValues(v => ({ ...v, [field]: e.target.checked }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !values.skills.includes(s)) {
      setValues(v => ({ ...v, skills: [...v.skills, s] }));
    }
    setSkillInput('');
  };

  const removeSkill = (s) => setValues(v => ({ ...v, skills: v.skills.filter(x => x !== s) }));

  const validate = () => {
    const e = {};
    if (!values.name || values.name.trim().length < 2) e.name = "Name must be at least 2 characters";
    if (!values.email || !values.email.includes("@")) e.email = "Provide a valid email";
    if (!values.location || values.location.trim().length < 2) e.location = "Location is required";
    if (!values.skills || values.skills.length === 0) e.skills = "Add at least one skill";
    if (values.experienceYears === "" || Number(values.experienceYears) < 0) e.experienceYears = "Experience cannot be negative";
    if (values.hourlyRate === "" || Number(values.hourlyRate) < 0) e.hourlyRate = "Hourly rate cannot be negative";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;
    try {
      const payload = {
        name: values.name.trim(),
        email: values.email.trim(),
        location: values.location.trim(),
        skills: values.skills,
        experienceYears: Number(values.experienceYears),
        availableForWork: !!values.availableForWork,
        hourlyRate: Number(values.hourlyRate),
        ...(values.id ? { id: values.id } : {}),
      };
      await onSubmit?.(payload);
    } catch (err) {
      setFormError(err?.message || "Failed to submit");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          label="Name"
          value={values.name}
          onChange={setField("name")}
          error={!!errors.name}
          helperText={errors.name}
          fullWidth
        />
        <TextField
          label="Email"
          value={values.email}
          onChange={setField("email")}
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
        />
        <TextField
          label="Location"
          value={values.location}
          onChange={setField("location")}
          error={!!errors.location}
          helperText={errors.location}
          fullWidth
        />

      <Box>
        <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>Skills</Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
          {values.skills.map(s => <Chip key={s} label={s} onDelete={() => removeSkill(s)} />)}
        </Stack>
        <Stack direction="row" spacing={1}>
          <TextField
            label="Add skill"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
          />
          <Button onClick={addSkill}>Add</Button>
        </Stack>
        {!!errors.skills && <Typography color="error" variant="caption">{errors.skills}</Typography>}
      </Box>

        <TextField
          type="number"
          label="Experience (years)"
          value={values.experienceYears}
          onChange={setField("experienceYears")}
          error={!!errors.experienceYears}
          helperText={errors.experienceYears}
          inputProps={{ min: 0 }}
        />

        <FormControlLabel
          control={<Switch checked={!!values.availableForWork} onChange={setSwitch("availableForWork")} />}
          label="Available for work"
        />

        <TextField
          type="number"
          label="Hourly rate (USD)"
          value={values.hourlyRate}
          onChange={setField("hourlyRate")}
          error={!!errors.hourlyRate}
          helperText={errors.hourlyRate}
          inputProps={{ min: 0 }}
        />

        {formError && <Alert severity="error">{formError}</Alert>}

        <Stack direction="row" spacing={1}>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Saving..." : submitLabel}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
