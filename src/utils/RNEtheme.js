//Elementos personalizados:
//Button
//Input
//CheckBox
//Icon
//Slider
//ListItem
//Card
//Dialog
//Divider
//Switch
//Tooltip

const theme = {
  // Paleta de colores

  colors: {
    primary: 'red',
    secondary: '#2ecc71',
  },

  // Estilos del componente Button

  Button: {
    titleStyle: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
    buttonStyle: {
      backgroundColor: 'green',
      borderRadius: 10,
      paddingHorizontal: 20,
      paddingVertical: 12,
      shadowColor: 'rgba(0, 0, 0, 0.2)',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.8,
      elevation: 8,
    },
  },

  // Estilos del componente Input

  Input: {
    inputContainerStyle: {
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      marginBottom: 10,
    },
    inputStyle: {
      fontSize: 16,
      color: '#333',
    },
    placeholderTextColor: '#aaa',
  },

  // Estilos del componente CheckBox

  CheckBox: {
    textStyle: {
      fontSize: 16,
      color: '#555',
    },
    containerStyle: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      margin: 0,
      padding: 0,
    },
    checkedColor: 'green',
  },

  // Estilos del componente Icon

  Icon: {
    type: 'material',
    size: 28,
    color: '#555',
  },

  // Estilos del componente Slider

  Slider: {
    thumbTintColor: 'green',
    minimumTrackTintColor: 'green',
    maximumTrackTintColor: '#ccc',
  },

  // Estilos del componente ListItem

  ListItem: {
    containerStyle: {
      backgroundColor: '#fff',
      borderRadius: 8,
      marginBottom: 10,
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.8,
      elevation: 4,
    },
    titleStyle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    subtitleStyle: {
      fontSize: 14,
      color: '#666',
    },
    chevronColor: 'green',
  },

  // Estilos del componente Card

  Card: {
    containerStyle: {
      backgroundColor: '#fff',
      borderRadius: 8,
      marginHorizontal: 10,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 5,
    },
    titleStyle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
    },
    imageStyle: {
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    },
    dividerStyle: {
      backgroundColor: '#ccc',
    },
  },

  // Estilos del componente Dialog

  Dialog: {
    containerStyle: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
      width: '80%',
      alignSelf: 'center',
    },
    titleStyle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
    },
    contentStyle: {
      fontSize: 16,
      color: '#555',
      marginBottom: 20,
    },
    buttonStyle: {
      backgroundColor: 'green',
      borderRadius: 8,
      paddingVertical: 12,
    },
    buttonTextStyle: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  },

  // Estilos del componente Divider

  Divider: {
    style: {
      backgroundColor: '#ccc',
      marginVertical: 10,
    },
  },

  // Estilos del componente Switch

  Switch: {
    trackColor: {
      false: '#ccc',
      true: 'green',
    },
    thumbColor: '#fff',
    ios_backgroundColor: '#ccc',
  },

  // Estilos del componente ToolTip

  Tooltip: {
    containerStyle: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 10,
      borderRadius: 8,
    },
    withPointer: true,
    pointerColor: 'rgba(0, 0, 0, 0.8)',
    popover: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderRadius: 8,
    },
    highlightColor: 'transparent',
  },
};

export default theme;
