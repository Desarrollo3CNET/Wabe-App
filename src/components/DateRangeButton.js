import React, { useState, useEffect } from 'react';
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
import colors from '../utils/colors';

const { width, height } = Dimensions.get('window');

const DateRangeButton = ({ onRangeSelect }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [step, setStep] = useState(1); // 1: Fecha inicial, 2: Fecha final
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [displayText, setDisplayText] = useState(null);

  const handleDateSelect = (date) => {
    if (step === 1) {
      setStartDate(new Date(date)); // Crear una nueva instancia para forzar re-render
      setStep(2);
    } else if (step === 2) {
      setEndDate(new Date(date));
      setStep(1);
    }
  };

  const handleConfirm = () => {
    setModalVisible(false); // Cerrar modal después de confirmar
    if (startDate && endDate && onRangeSelect) {
      onRangeSelect(startDate, endDate);
    }
  };

  const handleCancel = () => {
    setModalVisible(false); // Solo cerrar el modal sin realizar ninguna acción
    setStartDate(null); // Resetear fecha inicial
    setEndDate(null); // Resetear fecha final
    setDisplayText(null); // Limpiar texto mostrado
  };

  const formatDate = (date) => {
    if (!date || !(date instanceof Date)) return 'Fecha inválida';
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  useEffect(() => {
    if (startDate && endDate) {
      setDisplayText(`${formatDate(startDate)} - ${formatDate(endDate)}`);
    }
  }, [startDate, endDate]);

  return (
    <View>
      {/* Botón de rango de fechas */}
      <TouchableOpacity
        style={styles.rangeButton}
        onPress={() => setModalVisible(true)}
      >
        {displayText ? (
          <Text style={styles.rangeText}>{displayText}</Text>
        ) : (
          <Ionicons name="calendar-outline" size={20} color="#000" />
        )}
      </TouchableOpacity>

      {/* Modal para seleccionar rango */}
      <Modal
        visible={modalVisible}
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

            {/* Mostrar las fechas seleccionadas */}
            <View style={styles.selectedDates}>
              <Text style={styles.dateText}>
                Fecha inicial: {formatDate(startDate) || 'No seleccionada'}
              </Text>
              <Text style={styles.dateText}>
                Fecha final: {formatDate(endDate) || 'No seleccionada'}
              </Text>
            </View>

            {/* Contenedor para los botones confirm y cancel */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleConfirm}
                disabled={!startDate || !endDate} // Deshabilitar si falta alguna fecha
              >
                <Text style={styles.buttonText}>
                  {startDate && endDate ? 'Confirmar' : 'Seleccionar'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={[styles.buttonText, styles.cancelText]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  rangeButton: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5', // Gris claro como en los otros botones
    borderRadius: 10, // Bordes redondeados para consistencia
    paddingVertical: 10,
  },
  rangeText: {
    fontSize: 14,
    color: '#333', // Texto en negro para uniformidad
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
  selectedDates: {
    marginBottom: 16,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 8, // Espacio entre los botones
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  cancelButton: {
    backgroundColor: '#D1D1D1', // Gris para el botón de cancelar
  },
  cancelText: {
    color: '#555', // Texto gris para "Cancelar"
  },
});

export default DateRangeButton;
