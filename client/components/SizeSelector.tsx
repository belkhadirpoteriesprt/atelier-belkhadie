import type { SizeVariant } from "../data/products";
import { useState } from "react";
import { Ruler, ChevronRight } from "lucide-react";
import type { SizeVariant } from "../data/products";

interface SizeSelectorProps {
  sizeVariants: SizeVariant[];
  selectedSizeId: string;
  onSizeChange: (sizeId: string) => void;
  productName: string;
  productImage: string;
}

export function SizeSelector({
  sizeVariants,
  selectedSizeId,
  onSizeChange,
  productName,
  productImage,
}: SizeSelectorProps) {
  const [expanded, setExpanded] = useState(false);
  const selectedVariant = sizeVariants.find((v) => v.id === selectedSizeId);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
        <Ruler className="w-5 h-5 mr-2" />
        📏 Choisissez votre taille / modèle
      </h3>

      {/* Rangée compacte d'icônes (petits carrés) */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 -mx-1 px-1">
        {sizeVariants.map((variant) => (
          <button
            key={variant.id}
            onClick={() => onSizeChange(variant.id)}
            className={`relative flex-shrink-0 w-16 h-16 rounded-md border-2 overflow-hidden transition-all ${
              selectedSizeId === variant.id
                ? "border-amber-600 ring-2 ring-amber-200"
                : "border-gray-300 hover:border-amber-400"
            }`}
            aria-label={`Choisir ${variant.size}${variant.dimensions ? ` (${variant.dimensions})` : ""}`}
            title={`${variant.size}${variant.dimensions ? ` (${variant.dimensions})` : ""}`}
          >
            <img
              src={variant.image || productImage}
              alt={variant.size}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {selectedSizeId === variant.id && (
              <span className="pointer-events-none absolute inset-0 ring-2 ring-offset-1 ring-amber-500 rounded-md" />
            )}
          </button>
        ))}
      </div>

      {/* Barre longue avec flèche pour afficher toutes les images */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 border-amber-200 bg-white hover:bg-amber-50 transition-colors"
      >
        <span className="text-amber-900 font-medium">Afficher toutes les images</span>
        <ChevronRight
          className={`w-5 h-5 text-amber-700 transition-transform ${expanded ? "rotate-90" : ""}`}
        />
      </button>

      {expanded && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {sizeVariants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => onSizeChange(variant.id)}
              className={`group relative rounded-lg border-2 overflow-hidden transition-all ${
                selectedSizeId === variant.id
                  ? "border-amber-600"
                  : "border-gray-200 hover:border-amber-400"
              }`}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={variant.image || productImage}
                  alt={variant.size}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-2 text-left">
                <p className="text-sm font-semibold text-gray-900 line-clamp-1">{variant.size}</p>
                {variant.dimensions && (
                  <p className="text-xs text-gray-600">{variant.dimensions}</p>
                )}
                <p className="text-xs text-amber-700 font-semibold mt-1">
                  {variant.price.toFixed(2)} MAD
                </p>
              </div>
              {selectedSizeId === variant.id && (
                <span className="pointer-events-none absolute inset-0 ring-2 ring-amber-500 rounded-lg" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Récapitulatif de la sélection */}
      {selectedVariant && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
          <h4 className="font-semibold text-green-900 mb-2">✅ Votre sélection</h4>
          <div className="text-sm text-green-800">
            <p>
              <strong>Produit :</strong> {productName}
            </p>
            <p>
              <strong>Taille :</strong> {selectedVariant.size}
              {selectedVariant.dimensions && ` (${selectedVariant.dimensions})`}
            </p>
            {selectedVariant.description && (
              <p>
                <strong>Description :</strong> {selectedVariant.description}
              </p>
            )}
            <p className="text-lg font-bold text-green-900 mt-2">
              Prix : {selectedVariant.price.toFixed(2)} MAD
            </p>
          </div>
        </div>
      )}

      {/* Information sur la fabrication */}
      <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
        <p className="text-sm text-amber-800">
          🏺 <strong>Fabrication artisanale :</strong> Chaque pièce est façonnée à la main. Les dimensions peuvent varier légèrement, témoignant de l'authenticité du travail artisanal.
        </p>
      </div>
    </div>
  );
}
