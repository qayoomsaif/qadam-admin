import { SelectProps } from './interface'

export const Select = ({ label, value, onChange, options }: SelectProps) => {
  return (
    <div className="relative mt-4 w-full">
      <label className="font-semibold absolute ml-2 px-1 z-10 bg-white block top-[-0.8rem]">
        {label}
      </label>
      <select
        className="border-2 rounded-lg border-primary-blue-300 px-2 py-1 text-lg w-full"
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <option key={option.key + option.value} value={option.value}>
            {option.key}
          </option>
        ))}
      </select>
    </div>
  )
}
