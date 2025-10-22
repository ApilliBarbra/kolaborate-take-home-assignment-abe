
import * as React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';
import ProfileForm from './ProfileForm';

const API_BASE = 'http://localhost:8000';

export default function CreateProfileDialog({ open, onClose, onSaved }) {
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (payload) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/profiles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Request failed");
      }
      const saved = await res.json();
      onSaved?.(saved);
      onClose?.();
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Profile</DialogTitle>
      <DialogContent dividers>
        <ProfileForm onSubmit={handleSubmit} submitLabel="Create" loading={loading} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
