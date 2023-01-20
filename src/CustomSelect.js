import Select from 'react-select';

// const options = [
//   { value: 'chocolate', label: 'Chocolate', url: 'abc' },
//   { value: 'strawberry', label: 'Strawberry', url: 'cba' },
//   { value: 'vanilla', label: 'Vanilla', url: 'xyz' },
// ];

export const MyComponent = ({ options }) => {
  console.log(options);
  return <Select options={options} />;
};
