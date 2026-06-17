import React from "react"
import { useIngredientUnits } from "@/hooks/queries/dishes/useIngredientUnits"

type Ingredient = {
  id: number
  quantity: number
  unit: string
  preparationNote?: string
  ingredient: {
    id: number
    name: string
    image?: string
    standardUnit?: string
    caloriesPerUnit?: number
  }
}

export const IngredientItem: React.FC<{
  item: Ingredient
}> = ({ item }) => {
  const { ingredient } = item
  const { data: unitsOptions } = useIngredientUnits()

  // Map unit value to label
  const getUnitLabel = (unitValue?: string) => {
    if (!unitValue || !unitsOptions) return unitValue
    const option = unitsOptions.find((opt) => opt.value === unitValue)
    return option?.label || unitValue
  }

  const unitLabel = getUnitLabel(item.unit)
  const standardUnitLabel = getUnitLabel(ingredient.standardUnit)
  return (
    <div className="flex items-center gap-4 p-3 bg-white/6 rounded-md">
      {ingredient.image && (
        <img src={ingredient.image} alt={ingredient.name} className="w-12 h-12 object-cover rounded" />
      )}
      {!ingredient.image && (
        <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center text-white/60 text-xs">
          No img
        </div>
      )}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="text-white font-medium">{ingredient.name}</div>
          <div className="text-white/60 text-sm">
            {item.quantity} {unitLabel}
          </div>
        </div>
        {item.preparationNote && <div className="text-white/60 text-xs mt-1">{item.preparationNote}</div>}
        {ingredient.caloriesPerUnit != null && (
          <div className="text-white/60 text-xs mt-1">
            {ingredient.caloriesPerUnit} kcal / {standardUnitLabel}
          </div>
        )}
      </div>
    </div>
  )
}
