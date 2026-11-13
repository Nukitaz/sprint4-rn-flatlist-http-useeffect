import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS } from '../config/constants';

// ✅ YA VIENE HECHO: mensaje centrado con botón opcional.
// Úsalo para errores ("Reintentar") y para listas vacías.
//
// Props:
//   message      (string)   texto a mostrar
//   actionLabel  (string)   texto del botón (opcional)
//   onAction     (function) lo que hace el botón al presionarlo (opcional)

export default function StateMessage({ message, actionLabel, onAction }) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction ? (
        <Pressable style={styles.button} onPress={onAction}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 16 },
  message: { color: COLORS.textMuted, fontSize: 16, textAlign: 'center' },
  button: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonText: { color: '#10200a', fontWeight: '700', fontSize: 15 },
});
