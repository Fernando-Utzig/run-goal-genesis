
export interface Region {
  id: number;
  sigla: string;
  nome: string;
}

export interface State {
  id: number;
  sigla: string;
  nome: string;
  regiao: Region;
}

export interface Microregion {
  id: number;
  nome: string;
  mesorregiao: {
    id: number;
    nome: string;
    UF: State;
  };
}

export interface City {
  id: number;
  nome: string;
  microrregiao: Microregion;
}
