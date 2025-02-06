import { InputProps } from './interface'

export const Input = ({ label, value, onChange, type }: InputProps) => {
  return (
    <div className="relative mt-4 w-full">
      <label className="font-semibold absolute ml-2 px-1 z-10 bg-white block top-[-0.8rem]">
        {label}
      </label>
      <input
        type={type ? type : ''}
        className="border-2 rounded-lg border-primary-blue-300 px-2 py-1 text-lg w-full"
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
