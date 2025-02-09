import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Picker,
} from 'react-native';
import DateRangeButton from './DateRangeButton'; // Se vuelve a importar
import { getSucursales } from '../../src/services/BoletaService';
import { useSelector } from 'react-redux';

const FilterModal = ({ visible, onClose, onApplyFilters }) => {
  const user = useSelector((state) => state.app.user);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [estado, setEstado] = useState(null);
  const [sucursal, setSucursal] = useState(-1);
  const [sucursalOptions, setSucursalOptions] = useState([]);

  useEffect(() => {
    if (user?.EMP_CODE) {
      const fetchSucursales = async () => {
        try {
          const data = await getSucursales(user.EMP_CODE);
          const formattedOptions = data.map((s) => ({
            label: s.SUR_NAME,
            value: s.SUR_CODE,
          }));
          // Agregar la opción "Todas las sucursales"
          const allOption = { label: 'Todas las sucursales', value: -1 };
          setSucursalOptions([allOption, ...formattedOptions]); // Agrega al inicio
        } catch (error) {
          console.error('Error al cargar sucursales:', error);
        }
      };
      fetchSucursales();
    }
  }, [user]);

  const handleApply = () => {
    const normalizedStartDate =
      startDate && !isNaN(new Date(startDate))
        ? new Date(startDate).toISOString().split('T')[0]
        : null;

    const normalizedEndDate =
      endDate && !isNaN(new Date(endDate))
        ? new Date(endDate).toISOString().split('T')[0]
        : null;

    onApplyFilters({
      startDate: normalizedStartDate,
      endDate: normalizedEndDate,
      estado,
      sucursal,
    });
    onClose();
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setEstado('Todos');
    setSucursal(-1);

    onApplyFilters({
      startDate: null,
      endDate: null,
      estado: 'Todos',
      sucursal: -1,
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Filtrar Citas</Text>

          {/* Estado */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Estado</Text>
            <Picker
              selectedValue={estado}
              onValueChange={(itemValue) => setEstado(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Todas las citas" value="Todos" />
              <Picker.Item label="Activo" value="Activo" />
              <Picker.Item label="Finalizado" value="Finalizado" />
            </Picker>
          </View>

          {/* Sucursal */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Sucursal</Text>
            <Picker
              selectedValue={sucursal}
              onValueChange={(itemValue) => setSucursal(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Seleccione una sucursal" value="" />
              {sucursalOptions.map((option, index) => (
                <Picker.Item
                  key={index}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
          </View>

          {/* Rango de fechas */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Rango de Fechas</Text>
            <DateRangeButton
              onRangeSelect={(start, end) => {
                setStartDate(start);
                setEndDate(end);
              }}
            />
          </View>

          {/* Botones */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetText}>Resetear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#FFF',
    padding: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  resetButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  resetText: {
    fontSize: 14,
    color: '#333',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    color: '#333',
  },
  applyButton: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  applyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default FilterModal;
