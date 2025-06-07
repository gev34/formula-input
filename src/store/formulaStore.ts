import { create } from 'zustand';

type Token = string;

interface FormulaState {
  formula: Token[];
  variables: Record<string, number>;
  setFormula: (formula: Token[]) => void;
  addToken: (token: Token) => void;
  removeToken: (index: number) => void;
  updateToken: (index: number, newToken: Token) => void;
  calculateResult: () => number | null;
}

const useFormulaStore = create<FormulaState>((set, get) => ({
  formula: [],
  variables: {
    'Revenue': 10000,
    'Cost': 6000,
    'Units Sold': 500,
    'Price per Unit': 20,
    'Growth Rate': 0.15
  },
  setFormula: (formula) => set({ formula }),
  addToken: (token) => set(state => ({ formula: [...state.formula, token] })),
  removeToken: (index) => set(state => ({
    formula: state.formula.filter((_, i) => i !== index)
  })),
  updateToken: (index, newToken) => set(state => ({
    formula: state.formula.map((token, i) => i === index ? newToken : token)
  })),
  calculateResult: () => {
    const { formula, variables } = get();
    try {
      let expression = formula.map(token => {
        if (variables[token] !== undefined) return variables[token];
        return token;
      }).join(' ');

      // eslint-disable-next-line no-new-func
      const result = Function('"use strict"; return (' + expression + ')')();
      return isNaN(result) ? null : result;
    } catch {
      return null;
    }
  }
}));

export default useFormulaStore