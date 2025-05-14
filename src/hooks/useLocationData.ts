
import { useState, useEffect } from 'react';
import { State, City } from '@/types/location';

// Hook to fetch Brazilian states
export const useStates = () => {
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch states: ${response.status}`);
        }
        
        const data = await response.json();
        // Sort states by name for better UX
        const sortedStates = data.sort((a: State, b: State) => 
          a.nome.localeCompare(b.nome)
        );
        
        setStates(sortedStates);
        setError(null);
      } catch (err) {
        console.error('Error fetching states:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch states');
        setStates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, []);

  return { states, loading, error };
};

// Hook to fetch cities based on selected state
export const useCities = (stateId: string | null) => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset cities when state changes
    setCities([]);
    
    if (!stateId) return;

    const fetchCities = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateId}/municipios`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch cities: ${response.status}`);
        }
        
        const data = await response.json();
        // Sort cities by name for better UX
        const sortedCities = data.sort((a: City, b: City) => 
          a.nome.localeCompare(b.nome)
        );
        
        setCities(sortedCities);
        setError(null);
      } catch (err) {
        console.error(`Error fetching cities for state ${stateId}:`, err);
        setError(err instanceof Error ? err.message : 'Failed to fetch cities');
        setCities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [stateId]);

  return { cities, loading, error };
};
