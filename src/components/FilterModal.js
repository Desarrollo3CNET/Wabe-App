import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import CustomInput from './CustomInput';
import DateRangeButton from './DateRangeButton';

const FilterModal = ({ visible, onClose, onApplyFilters }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [estado, setEstado] = useState(null);
  const [sucursal, setSucursal] = useState(null);

  const handleApply = () => {
    onApplyFilters({ startDate, endDate, estado, sucursal });
    onClose();
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setEstado('');
    setSucursal('');
  };

  return (
    <Modal visible={visible} transparent={true} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Filtrar Citas</Text>

          {/* Selector de estado */}
          <CustomInput
            label="Estado"
            type="select"
            value={estado}
            options={['Todos', 'Activo', 'Finalizado']}
            onChange={setEstado}
          />

          {/* Selector de sucursal */}
          <CustomInput
            label="Sucursal"
            type="select"
            value={sucursal}
            options={['Sucursal A', 'Sucursal B', 'Sucursal C']}
            onChange={setSucursal}
          />

          {/* Selector de rango de fechas */}
          <DateRangeButton
            onRangeSelect={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
          />

          {/* Botones de acción */}
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
