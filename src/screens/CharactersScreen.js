import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { COLORS, DEBOUNCE_MS } from '../config/constants';
import { getCharacters } from '../services/charactersService';
import CharacterCard from '../components/CharacterCard';
import StateMessage from '../components/StateMessage';

const ItemSeparator = () => <View style={styles.separator} />;

export default function CharactersScreen() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(null);

  const [refreshing, setRefreshing] = useState(false);

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce: oha'arõ DEBOUNCE_MS oñembohasa hag̃ua pe texto ojeheka hag̃ua
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timerId);
  }, [searchInput]);

  // Carga inicial ha carga oñemoambue jave búsqueda térã ojejopy Reintentar
  useEffect(() => {
    let isCancelled = false;

    async function loadInitialCharacters() {
      setLoading(true);
      setError(null);
      setLoadMoreError(null);

      try {
        const data = await getCharacters({ page: 1, name: debouncedSearch });
        if (!isCancelled) {
          setCharacters(data.results);
          setPage(1);
          setHasNextPage(data.hasNextPage);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message || 'No se pudieron cargar los personajes.');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadInitialCharacters();

    return () => {
      isCancelled = true;
    };
  }, [debouncedSearch, retryCount]);

  // Paginación infinita
  const handleLoadMore = async () => {
    if (loading || refreshing || isLoadingMore || !hasNextPage) {
      return;
    }

    setIsLoadingMore(true);
    setLoadMoreError(null);
    const nextPage = page + 1;

    try {
      const data = await getCharacters({ page: nextPage, name: debouncedSearch });
      setCharacters((prev) => [...prev, ...data.results]);
      setPage(nextPage);
      setHasNextPage(data.hasNextPage);
    } catch (err) {
      setLoadMoreError(err.message || 'Error al cargar más personajes.');
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Pull to refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    setLoadMoreError(null);

    try {
      const data = await getCharacters({ page: 1, name: debouncedSearch });
      setCharacters(data.results);
      setPage(1);
      setHasNextPage(data.hasNextPage);
      setError(null);
    } catch (err) {
      setError(err.message || 'No se pudo actualizar la lista.');
    } finally {
      setRefreshing(false);
    }
  };

  const renderFooter = () => {
    if (isLoadingMore) {
      return (
        <ActivityIndicator
          style={styles.footer}
          size="small"
          color={COLORS.primary}
        />
      );
    }

    if (loadMoreError) {
      return <Text style={styles.footerError}>{loadMoreError}</Text>;
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rick and Morty</Text>

      <TextInput
        style={styles.input}
        placeholder="Buscar personaje por nombre..."
        placeholderTextColor={COLORS.textMuted}
        autoCorrect={false}
        value={searchInput}
        onChangeText={setSearchInput}
      />

      {loading ? (
        <ActivityIndicator
          style={styles.loader}
          size="large"
          color={COLORS.primary}
        />
      ) : error && characters.length === 0 ? (
        <StateMessage
          message={error}
          actionLabel="Reintentar"
          onAction={() => setRetryCount((c) => c + 1)}
        />
      ) : (
        <FlatList
          data={characters}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <CharacterCard character={item} />}
          ItemSeparatorComponent={ItemSeparator}
          ListEmptyComponent={
            <StateMessage message="No se encontraron personajes." />
          }
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 16 },
  title: {
    color: COLORS.primary,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 12,
  },
  input: {
    backgroundColor: COLORS.card,
    color: COLORS.text,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  loader: { marginTop: 40 },
  separator: { height: 10 },
  listContent: { paddingBottom: 24 },
  footer: { marginVertical: 16 },
  footerError: { color: COLORS.danger, textAlign: 'center', marginVertical: 16 },
  placeholder: { color: COLORS.textMuted, fontSize: 16, marginTop: 24 },
});