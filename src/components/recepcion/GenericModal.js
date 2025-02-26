import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux'; // Importa useDispatch
import {
  setCreatingBoletaFalse,
  setCreatingRevisionFalse,
} from '../../contexts/AppSlice';
import { resetAllStates } from '../../contexts/RevisionSlice';
import { resetBoleta } from '../../contexts/BoletaSlice';

const GenericModal = ({
  visible,
  onClose,
  navigation,
  caseType,
  message = '',
}) => {
  const dispatch = useDispatch(); // Inicializa dispatch

  const handleAccept = () => {
    if (caseType === 'CancelBoleta') {
      navigation.navigate('Dashboard');
      // Limpia el estado de la boleta
      dispatch(resetBoleta());
      dispatch(setCreatingBoletaFalse());
      // Cierra el modal y navega al Dashboard
      onClose();
    } else if (caseType === 'CancelRevision') {
      // Limpia el estado de la revisión
      dispatch(resetAllStates());
      dispatch(setCreatingRevisionFalse());
      // Cierra el modal y navega al CheckOutScreen
      onClose();
      navigation.navigate('CheckOutScreen');
    } else if (caseType === 'Notificacion') {
      // Cierra el modal sin lógica adicional
      onClose();
    }
  };

  // Determina el mensaje basado en el tipo de caso
  const getMessage = () => {
    if (caseType === 'CancelBoleta') {
      return '¿Está seguro de que desea eliminar la boleta?';
    } else if (caseType === 'CancelRevision') {
      return '¿Está seguro de que desea eliminar la revisión?';
    } else if (caseType === 'Notificacion') {
      return message || '';
    }
    return '';
  };

  return (
    <Modal visible={visible} transparent={true} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.message}>{getMessage()}</Text>

          <View style={styles.buttonRow}>
            {caseType !== 'Notificacion' && (
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.acceptButton,
                caseType === 'Notificacion' && {
                  width: 'auto',
                  alignSelf: 'center',
                },
              ]}
              onPress={handleAccept}
            >
              <Text style={styles.acceptText}>Aceptar</Text>
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
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    color: '#333',
  },
  acceptButton: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  acceptText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  fullWidthButton: {
    flex: 0,
    width: '100%',
  },
});

export default GenericModal;
