import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import Calendar from './Calendar'; // Si usas un componente personalizado para el calendario

const CustomInput = ({ label, type, value, options, onChange }) => {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  // Generar lista de horas cada media hora
  const generateTimeOptions = () => {
    const times = [];
    const start = new Date();
    start.setHours(8, 0, 0, 0); // 8:00 AM
    const end = new Date();
    end.setHours(20, 0, 0, 0); // 8:00 PM

    while (start <= end) {
      times.push(
        start.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      );
      start.setMinutes(start.getMinutes() + 30); // Incrementar por 30 minutos
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  const renderInput = () => {
    switch (type) {
      case 'text':
        return (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={(text) => onChange(text)}
            placeholder="Ingresa un valor"
            placeholderTextColor="#aaa"
            keyboardType="default"
          />
        );

      case 'number':
        return (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={(text) => onChange(text)}
            placeholder="Ingresa un número"
            placeholderTextColor="#aaa"
            keyboardType="numeric" // Teclado numérico
          />
        );

      case 'select':
        return (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={value}
              style={styles.input}
              onValueChange={(itemValue) => onChange(itemValue)}
            >
              {options.map((option, index) => (
                <Picker.Item key={index} label={option} value={option} />
              ))}
            </Picker>
          </View>
        );

      case 'date':
        return (
          <TouchableOpacity
            onPress={() => setIsCalendarVisible(true)}
            style={styles.input}
          >
            <Text style={{ color: value ? '#000' : '#aaa' }}>
              {value || 'Selecciona una fecha'}
            </Text>
            {isCalendarVisible && (
              <View style={styles.calendarOverlay}>
                <Calendar
                  currentMonth={new Date()}
                  onDateSelect={(date) => {
                    setIsCalendarVisible(false);
                    const formattedDate = new Intl.DateTimeFormat('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    }).format(date);
                    onChange(formattedDate);
                  }}
                />
              </View>
            )}
          </TouchableOpacity>
        );

      case 'time':
        return (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={value}
              style={styles.input}
              onValueChange={(itemValue) => onChange(itemValue)}
            >
              {timeOptions.map((option, index) => (
                <Picker.Item key={index} label={option} value={option} />
              ))}
            </Picker>
          </View>
        );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {renderInput()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    fontSize: 14,
    color: '#000',
    height: 40,
    justifyContent: 'center',
  },
  pickerContainer: {
    justifyContent: 'center',
  },
  calendarOverlay: {
    position: 'absolute',
    top: 45,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#fff',
    elevation: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    padding: 10,
  },
  confirmButton: {
    marginTop: 10,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 14,
    color: '#FFF',
  },
});

export default CustomInput;
