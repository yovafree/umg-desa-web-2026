import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import ProductoFormDialog from './ProductoFormDialog';
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  listarProductos,
} from '../services/productosApi';
import type { Producto, ProductoInput } from '../types/producto';

const formatoMoneda = new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' });

export default function ProductosCrud() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(false);
  const [formAbierto, setFormAbierto] = useState(false);
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null);
  const [productoEliminar, setProductoEliminar] = useState<Producto | null>(null);
  const [mensaje, setMensaje] = useState<{ texto: string; severidad: 'success' | 'error' } | null>(null);

  const cargarProductos = async () => {
    setCargando(true);
    try {
      const datos = await listarProductos();
      setProductos(datos);
    } catch {
      setMensaje({ texto: 'No se pudieron cargar los productos', severidad: 'error' });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const abrirNuevo = () => {
    setProductoEditar(null);
    setFormAbierto(true);
  };

  const abrirEditar = (producto: Producto) => {
    setProductoEditar(producto);
    setFormAbierto(true);
  };

  const handleGuardar = async (input: ProductoInput) => {
    try {
      if (productoEditar) {
        await actualizarProducto(productoEditar.id, input);
        setMensaje({ texto: 'Producto actualizado correctamente', severidad: 'success' });
      } else {
        await crearProducto(input);
        setMensaje({ texto: 'Producto creado correctamente', severidad: 'success' });
      }
      setFormAbierto(false);
      await cargarProductos();
    } catch {
      setMensaje({ texto: 'Ocurrió un error al guardar el producto', severidad: 'error' });
    }
  };

  const confirmarEliminar = async () => {
    if (!productoEliminar) return;
    try {
      await eliminarProducto(productoEliminar.id);
      setMensaje({ texto: 'Producto eliminado correctamente', severidad: 'success' });
      setProductoEliminar(null);
      await cargarProductos();
    } catch {
      setMensaje({ texto: 'Ocurrió un error al eliminar el producto', severidad: 'error' });
    }
  };

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto', p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h4" component="h1">
          Gestión de productos
        </Typography>
        <Stack direction="row" spacing={1}>
          <IconButton onClick={cargarProductos} disabled={cargando} title="Refrescar">
            <RefreshIcon />
          </IconButton>
          <Button variant="contained" startIcon={<AddIcon />} onClick={abrirNuevo}>
            Nuevo producto
          </Button>
        </Stack>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell align="right">Precio</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cargando && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            )}
            {!cargando && productos.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  No hay productos registrados
                </TableCell>
              </TableRow>
            )}
            {!cargando &&
              productos.map((producto) => (
                <TableRow key={producto.id} hover>
                  <TableCell>{producto.nombre}</TableCell>
                  <TableCell>{producto.categoria}</TableCell>
                  <TableCell align="right">{formatoMoneda.format(producto.precio)}</TableCell>
                  <TableCell align="right">{producto.stock}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => abrirEditar(producto)} title="Editar">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setProductoEliminar(producto)}
                      title="Eliminar"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ProductoFormDialog
        open={formAbierto}
        producto={productoEditar}
        onClose={() => setFormAbierto(false)}
        onGuardar={handleGuardar}
      />

      <Dialog open={Boolean(productoEliminar)} onClose={() => setProductoEliminar(null)}>
        <DialogTitle>Eliminar producto</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Seguro que deseas eliminar "{productoEliminar?.nombre}"? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProductoEliminar(null)}>Cancelar</Button>
          <Button onClick={confirmarEliminar} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(mensaje)}
        autoHideDuration={3000}
        onClose={() => setMensaje(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {mensaje ? (
          <Alert severity={mensaje.severidad} onClose={() => setMensaje(null)} sx={{ width: '100%' }}>
            {mensaje.texto}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
}
