const mockAutocompleteAPI = async (query: string) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const suggestions = [
    'Revenue', 'Cost', 'Profit', 'Margin', 'Growth Rate', 'Units Sold',
    'Price per Unit', 'Total Expenses', 'Net Income', 'Gross Revenue',
    'Customer Count', 'Average Order Value', 'Conversion Rate', 'Traffic'
  ];
  
  return suggestions.filter(s => s.toLowerCase().includes(query.toLowerCase())).slice(0, 6);
};

export default mockAutocompleteAPI
