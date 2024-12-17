import React from 'react';
import {
  View,
  Text,
  TextInput,
  Picker,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Calendar from '../Calendar';
import DateTimePicker from '@react-native-community/datetimepicker';

const CustomInput = ({ label, type, value, options, onChange }) => {
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const renderInput = () => {
    switch (type) {
      case 'text':
        return (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={(text) => onChange(text)}
          />
        );

      case 'select':
        return (
          <Picker
            selectedValue={value}
            style={styles.input}
            onValueChange={(itemValue) => onChange(itemValue)}
          >
            {options.map((option, index) => (
              <Picker.Item key={index} label={option} value={option} />
            ))}
          </Picker>
        );
      case 'date':
        return (
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.input}
          >
            <Text>{value || 'Selecciona una fecha'}</Text>
            {showDatePicker && (
              <Calendar
                currentMonth={new Date()}
                onDateSelect={(date) => {
                  setShowDatePicker(false);

                  const formattedDate = new Intl.DateTimeFormat('es-ES', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  }).format(date);

                  onChange(formattedDate);
                }}
              />
            )}
          </TouchableOpacity>
        );
      case 'time':
        return (
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.input}
          >
            <Text>{value || 'Selecciona una hora'}</Text>
            {showDatePicker && (
              <DateTimePicker
                value={value ? new Date(`1970-01-01T${value}:00`) : new Date()}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={(event, selectedTime) => {
                  setShowDatePicker(false);
                  if (selectedTime) {
                    const formattedTime = selectedTime.toLocaleTimeString(
                      'es-ES',
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                      },
                    );
                    onChange(formattedTime);
                  }
                }}
              />
            )}
          </TouchableOpacity>
        );

      default:
        return null;
    }
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
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#F2F2F2',
  },
});

export default CustomInput;
