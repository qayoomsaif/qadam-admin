export interface AddVariantProps {
  onRemoveVariant: () => void
  onUpdateVariantType: (type: string) => void
  onAddOption: () => void
  onRemoveOption: (optionId: string) => void
  onUpdateOption: (optionId: string, updatedOption: string) => void
  variantData: { type: string; options: { [key: string]: string } }
}
