import FormulaInput from "./components/FormulaInput";

const QueryClient = () => null;
const QueryClientProvider = ({ children }: { children: any; client: () => null; }) => children;

export default function App() {
  return (
    <QueryClientProvider client={QueryClient}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <FormulaInput />
      </div>
    </QueryClientProvider>
  );
}