import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Calendar = ({ currentMonth, onDateSelect }) => {
  const [month, setMonth] = useState(currentMonth || new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const changeMonth = (direction) => {
    const newMonth = new Date(month);
    newMonth.setMonth(month.getMonth() + direction);
    setMonth(newMonth);
    setSelectedDate(null);
  };

  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();
  const firstDayOfMonth = new Date(
    month.getFullYear(),
    month.getMonth(),
    1,
  ).getDay();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleDaySelect = (day) => {
    const date = new Date(month.getFullYear(), month.getMonth(), day);
    setSelectedDate(date);
    onDateSelect(date);
  };

  return (
    <View style={styles.calendarContainer}>
      <View style={styles.monthHeader}>
        <TouchableOpacity onPress={() => changeMonth(-1)}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.monthText}>
          {month
            .toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
            .toUpperCase()}
        </Text>
        <TouchableOpacity onPress={() => changeMonth(1)}>
          <Ionicons name="chevron-forward" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.daysContainer}>
        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, index) => (
          <Text key={index} style={styles.dayLabel}>
            {day}
          </Text>
        ))}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <View key={`empty-${index}`} style={styles.emptyDay} />
        ))}
        {daysArray.map((day) => {
          const isSelected =
            selectedDate &&
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === month.getMonth() &&
            selectedDate.getFullYear() === month.getFullYear();

          return (
            <TouchableOpacity
              key={day}
              style={[styles.day, isSelected && styles.selectedDay]}
              onPress={() => handleDaySelect(day)}
            >
              <Text
                style={[styles.dayText, isSelected && styles.selectedDayText]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayLabel: {
    width: '14.28%',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#555',
  },
  emptyDay: {
    width: '14.28%',
    height: 40,
  },
  day: {
    width: '14.28%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayText: {
    fontSize: 14,
    color: '#000',
  },
  selectedDay: {
    backgroundColor: '#FFD700',
    borderRadius: 20,
  },
  selectedDayText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default Calendar;
