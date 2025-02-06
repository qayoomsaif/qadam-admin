import { useMemo, useState } from 'react'
import { Input } from '../inputs/Input'
import { Button, IconButton } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import { AddVariantProps } from './interface'

export const AddVariant = ({
  onRemoveVariant,
  onAddOption,
  onRemoveOption,
  variantData,
  onUpdateVariantType,
  onUpdateOption,
}: AddVariantProps) => {
  return (
    <div className="w-full border-2 border-primary-blue-600 rounded-xl p-4 flex flex-col">
      <div className="w-full flex justify-end">
        <IconButton
          size="sm"
          icon={<CloseIcon />}
          aria-label="close"
          onClick={() => onRemoveVariant()}
        />
      </div>
      <Input
        label="Variant Type"
        value={variantData.type}
        onChange={(e) => onUpdateVariantType(e.target.value)}
      />
      <span className="font-semibold mt-4">Options</span>
      {Object.keys(variantData.options)?.map((option) => (
        <div className="flex items-end gap-2">
          <Input
            label=""
            value={variantData.options[option]}
            onChange={(e) => onUpdateOption(option, e.target.value)}
          />
          <IconButton
            icon={<CloseIcon />}
            aria-label="close"
            onClick={() => onRemoveOption(option)}
          />
        </div>
      ))}
      <Button mt="1rem" onClick={onAddOption}>
        Add Option
      </Button>
    </div>
  )
}
