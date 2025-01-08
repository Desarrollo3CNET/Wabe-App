import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Calendar from './Calendar';

const { width, height } = Dimensions.get('window');

const DateRangeButton = ({ onRangeSelect }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [step, setStep] = useState(1); // 1: Fecha inicial, 2: Fecha final
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateSelect = (date) => {
    if (step === 1) {
      setStartDate(date);
      setStep(2); // Cambiar al paso para seleccionar la fecha final
    } else if (step === 2) {
      setEndDate(date);
      setStep(1); // Resetear al paso inicial
      setModalVisible(false); // Cerrar modal después de seleccionar ambas fechas
      if (startDate && date && onRangeSelect) {
        onRangeSelect(startDate, date);
      }
    }
  };

  const handleConfirm = () => {
    setModalVisible(false);
    if (startDate && endDate && onRangeSelect) {
      onRangeSelect(startDate, endDate);
    }
  };

  const formatDate = (date) => {
    return date
      ? date.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      : null;
  };

  return (
    <View>
      {/* Botón de rango de fechas */}
      <TouchableOpacity
        style={styles.rangeButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.rangeText}>
          {startDate && endDate
            ? `${formatDate(startDate)} - ${formatDate(endDate)}`
            : 'Selecciona un rango de fechas'}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#000" />
      </TouchableOpacity>

      {/* Modal para seleccionar rango */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {step === 1
                ? 'Selecciona la fecha inicial'
                : 'Selecciona la fecha final'}
            </Text>
            <View style={styles.calendarContainer}>
              <Calendar
                currentMonth={new Date()}
                onDateSelect={handleDateSelect}
              />
            </View>
            {step === 2 && (
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmText}>Confirmar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  rangeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5', // Gris claro como en los otros botones
    borderRadius: 10, // Bordes redondeados para consistencia
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 5, // Espaciado con el siguiente botón en la fila
  },
  rangeText: {
    fontSize: 14,
    color: '#333', // Texto en negro para uniformidad
    flex: 1,
    marginRight: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  calendarContainer: {
    justifyContent: 'center',
    marginBottom: 16,
  },
  confirmButton: {
    backgroundColor: '#FFD700', // Amarillo para consistencia
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default DateRangeButton;
