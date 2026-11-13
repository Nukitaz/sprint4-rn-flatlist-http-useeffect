import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS } from '../config/constants';

// ✅ YA VIENE HECHO: tarjeta que dibuja UN personaje.
// Recibe la prop `character` con la forma que devuelve la API:
// { id, name, status, species, image, ... }

const STATUS_COLORS = {
  Alive: '#55cc44',
  Dead: '#d63d2e',
  unknown: '#9e9e9e',
};

export default function CharacterCard({ character }) {
  const { name, status, species, image } = character;
  const statusColor = STATUS_COLORS[status] ?? STATUS_COLORS.unknown;

  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <View style={styles.statusRow}>
          <View style={[styles.dot, { backgroundColor: statusColor }]} />
          <Text style={styles.status}>
            {status} · {species}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    overflow: 'hidden',
  },
  image: { width: 84, height: 84, backgroundColor: '#222a35' },
  info: { flex: 1, paddingHorizontal: 14 },
  name: { color: COLORS.text, fontSize: 17, fontWeight: '700' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  dot: { width: 9, height: 9, borderRadius: 5, marginRight: 8 },
  status: { color: COLORS.textMuted, fontSize: 14 },
});
