import React, { useState } from 'react';
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

const { width, height } = Dimensions.get('window');

const AppointmentScheduler = ({ onAppointmentSelect }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null); // Fecha seleccionada
  const [selectedTime, setSelectedTime] = useState(null); // Hora seleccionada

  const handleDateSelect = (date) => {
    setSelectedDate(date); // Actualizar la fecha seleccionada
  };

  const handleConfirm = () => {
    setModalVisible(false); // Cerrar modal después de confirmar
    if (selectedDate && selectedTime && onAppointmentSelect) {
      onAppointmentSelect(selectedDate, selectedTime);
    }
  };

  const formatDate = (date) => {
    return date
      ? date.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      : 'No seleccionada';
  };

  const hours = Array.from({ length: 12 }, (_, i) => {
    const hour = 8 + i;
    const amPm = hour < 12 ? 'AM' : 'PM';
    const formattedHour = hour > 12 ? hour - 12 : hour;
    return `${formattedHour}:00 ${amPm}`;
  });

  return (
    <View>
      {/* Botón para abrir el modal */}
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

      {/* Modal para seleccionar fecha y hora */}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Selección de fecha */}
            <Text style={styles.modalTitle}>Selecciona una fecha</Text>
            <View style={styles.calendarContainer}>
              <Calendar
                currentMonth={new Date()}
                onDateSelect={handleDateSelect}
              />
            </View>
            <Text style={styles.selectedText}>
              Fecha seleccionada: {formatDate(selectedDate)}
            </Text>

            {/* Carrusel de horas */}
            <Text style={styles.modalTitle}>Selecciona una hora</Text>
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

            {/* Botón para confirmar */}
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
              disabled={!selectedDate || !selectedTime} // Deshabilitar si falta alguna selección
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
  timeButton: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    alignItems: 'center',
  },
  timeButtonSelected: {
    backgroundColor: '#FFD700',
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
    backgroundColor: '#FFD700',
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
