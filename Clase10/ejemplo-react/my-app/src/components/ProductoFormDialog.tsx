import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import type { Producto, ProductoInput } from '../types/producto';

interface Props {
  open: boolean;
  producto: Producto | null;
  onClose: () => void;
  onGuardar: (input: ProductoInput) => void;
}

const valoresIniciales: ProductoInput = {
  nombre: '',
  categoria: '',
  precio: 0,
  stock: 0,
};

export default function ProductoFormDialog({ open, producto, onClose, onGuardar }: Props) {
  const [form, setForm] = useState<ProductoInput>(valoresIniciales);

  useEffect(() => {
    if (open) {
      setForm(producto ? { nombre: producto.nombre, categoria: producto.categoria, precio: producto.precio, stock: producto.stock } : valoresIniciales);
    }
  }, [open, producto]);

  const esValido = form.nombre.trim() !== '' && form.categoria.trim() !== '' && form.precio >= 0 && form.stock >= 0;

  const handleSubmit = () => {
    if (!esValido) return;
    onGuardar(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{producto ? 'Editar producto' : 'Nuevo producto'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            autoFocus
            fullWidth
          />
          <TextField
            label="Categoría"
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            fullWidth
          />
          <TextField
            label="Precio"
            type="number"
            value={form.precio}
            onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })}
            slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
            fullWidth
          />
          <TextField
            label="Stock"
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
            slotProps={{ htmlInput: { min: 0, step: 1 } }}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!esValido}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
