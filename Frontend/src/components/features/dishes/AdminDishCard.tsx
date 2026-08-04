import React from "react";
import { Card, CardContent } from "@/components/shared/ui/card";
import { ImageWithFallback } from "@/components/shared/common/image-with-fallbacks";
import { Flame, Beef, Wheat, Droplet } from "lucide-react";

// Define Dish type
type Dish = {
  id: number;
  title: string;
  image: string;
  calories: number | string;
  protein: number | string;
  carbs: number | string;
  fat: number | string;
  cookTime?: string;
};

export const AdminDishCard: React.FC<{ dish: Dish; onClick?: () => void }> = ({ dish, onClick }) => {
  const stats = [
    { label: "Calo", value: dish.calories, icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Protein", value: dish.protein, icon: Beef, color: "text-red-500", bg: "bg-red-500/10" },
    { label: "Fat", value: dish.fat, icon: Droplet, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Carbs", value: dish.carbs, icon: Wheat, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  ];

  return (
    <Card
      className="group gap-0 overflow-hidden rounded-2xl border border-border bg-card/80 py-0 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-60 w-full overflow-hidden bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0)_52%,rgba(255,255,255,0.08))]">
        <ImageWithFallback
          src={dish.image}
          alt={dish.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="font-display line-clamp-2 text-xl font-semibold leading-tight drop-shadow-sm">
            {dish.title}
          </div>
        </div>
        {dish.cookTime && (
          <div className="absolute right-3 top-3 rounded-full border border-white/25 bg-black/70 px-2.5 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">
            {dish.cookTime}
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="min-w-0 rounded-xl border border-border bg-muted/30 p-2.5">
                <div className="flex items-center gap-1.5">
                  <span className={`flex size-7 shrink-0 items-center justify-center rounded-full ${stat.bg}`}>
                    <Icon className={stat.color} size={16} />
                  </span>
                  <span className="truncate text-sm font-semibold text-foreground">{stat.value}</span>
                </div>
                <span className="mt-1 block text-xs font-medium text-muted-foreground">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
