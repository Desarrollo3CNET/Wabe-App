import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Calendar from './Calendar'; // Asegúrate de importar correctamente el componente del calendario
import { getHorasDisponibles } from '../services/CitaService';
import colors from '../utils/colors';

const { width } = Dimensions.get('window');

const AppointmentScheduler = ({ onAppointmentSelect }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [hours, setHours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableHours(selectedDate);
    }
  }, [selectedDate]);

  const fetchAvailableHours = async (date) => {
    setLoading(true);
    setErrorMessage('');
    setHours([]);

    try {
      const formattedDate = date.toISOString().split('T')[0]; // AAAA-MM-DD
      const availableHours = await getHorasDisponibles(formattedDate);

      if (!availableHours || availableHours.length === 0) {
        setErrorMessage(
          `No hay horas disponibles para la fecha: ${formattedDate}`,
        );
      } else {
        const formattedHours = availableHours.map((time) => {
          const [hour, minutes] = time.split(':').map(Number);
          const amPm = hour < 12 ? 'AM' : 'PM';
          const formattedHour = hour % 12 || 12; // Convertir 0 y 12 a 12, 13 a 1, etc.

          return `${formattedHour}:${minutes.toString().padStart(2, '0')} ${amPm}`;
        });

        setHours(formattedHours);
      }
    } catch (error) {
      setErrorMessage(
        `No hay horas disponibles para la fecha: ${date.toISOString().split('T')[0]}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    setModalVisible(false);
    if (selectedDate && selectedTime && onAppointmentSelect) {
      onAppointmentSelect(selectedDate, selectedTime);
    }
  };

  const formatDate = (date) =>
    date
      ? date.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      : 'No seleccionada';

  return (
    <View>
      <TouchableOpacity
        style={styles.openButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>
          {selectedDate && selectedTime
            ? `${formatDate(selectedDate)} - ${selectedTime}`
            : 'Selecciona una fecha y hora'}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#000" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona una fecha</Text>
            <View style={styles.calendarContainer}>
              <Calendar
                currentMonth={new Date()}
                onDateSelect={setSelectedDate}
              />
            </View>
            <Text style={styles.selectedText}>
              Fecha seleccionada: {formatDate(selectedDate)}
            </Text>

            <Text style={styles.modalTitle}>Selecciona una hora</Text>

            {loading ? (
              <Text style={styles.loadingText}>
                Cargando horas disponibles...
              </Text>
            ) : errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : (
              <FlatList
                horizontal
                data={hours}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.timeButton,
                      item === selectedTime && styles.timeButtonSelected,
                    ]}
                    onPress={() => setSelectedTime(item)}
                  >
                    <Text
                      style={[
                        styles.timeText,
                        item === selectedTime && styles.timeTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
              />
            )}

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
              disabled={!selectedDate || !selectedTime}
            >
              <Text style={styles.confirmText}>
                {selectedDate && selectedTime
                  ? 'Confirmar'
                  : 'Selecciona fecha y hora'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  openButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 14,
    color: '#333',
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
  selectedText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginVertical: 10,
  },
  errorText: {
    fontSize: 14,
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  timeButton: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    alignItems: 'center',
  },
  timeButtonSelected: {
    backgroundColor: colors.primary,
  },
  timeText: {
    fontSize: 14,
    color: '#333',
  },
  timeTextSelected: {
    fontWeight: 'bold',
    color: '#000',
  },
  confirmButton: {
    backgroundColor: colors.primary,
    marginTop: 10,
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

export default AppointmentScheduler;
