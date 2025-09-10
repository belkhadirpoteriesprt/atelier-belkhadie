import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { patterns } from "../data/products";

interface ColorPatternCustomizerProps {
  availablePatterns: string[];
  selectedPattern: string;
  onPatternChange: (patternId: string) => void;
}

export function ColorPatternCustomizer({
  availablePatterns,
  selectedPattern,
  onPatternChange,
}: ColorPatternCustomizerProps) {
  const [expandedColors, setExpandedColors] = useState(false);
  const [expandedMotifs, setExpandedMotifs] = useState(false);

  // Filtrer les patterns disponibles
  const availablePatternObjects = availablePatterns.includes("tous")
    ? patterns
    : patterns.filter((p) => availablePatterns.includes(p.id));

  // Séparer couleurs et motifs spéciaux
  const colorPatterns = availablePatternObjects.filter(
    (p) => !["parentheses", "geometrique", "motif_traditionnel"].includes(p.id),
  );
  const specialMotifs = availablePatternObjects.filter((p) =>
    ["parentheses", "geometrique", "motif_traditionnel"].includes(p.id),
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
        <h3 className="text-xl font-semibold text-purple-900 mb-4 flex items-center">
          🎨 Couleurs & Motifs
        </h3>

        {/* Barre compacte des couleurs */}
        <div className="mb-3">
          <p className="text-purple-800 mb-2 font-medium">Couleurs</p>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 -mx-1 px-1">
            {colorPatterns.map((pattern) => (
              <button
                key={pattern.id}
                onClick={() => onPatternChange(pattern.id)}
                className={`relative flex-shrink-0 w-10 h-10 rounded-md border-2 transition-all ${
                  selectedPattern === pattern.id
                    ? "border-purple-600 ring-2 ring-purple-200"
                    : "border-gray-300 hover:border-purple-400"
                }`}
                aria-label={`Choisir ${pattern.name}`}
                title={pattern.name}
              >
                <span
                  className="block w-full h-full rounded-sm"
                  style={{ backgroundColor: pattern.primaryColor }}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setExpandedColors((v) => !v)}
            className="mt-2 w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 border-purple-200 bg-white hover:bg-purple-50 transition-colors"
          >
            <span className="text-purple-900 font-medium">Afficher toutes les couleurs</span>
            <ChevronRight
              className={`w-5 h-5 text-purple-700 transition-transform ${expandedColors ? "rotate-90" : ""}`}
            />
          </button>
          {expandedColors && (
            <div className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-3">
              {colorPatterns.map((pattern) => (
                <button
                  key={pattern.id}
                  onClick={() => onPatternChange(pattern.id)}
                  className={`group relative p-3 rounded-lg border-2 transition-all ${
                    selectedPattern === pattern.id
                      ? "border-purple-600 bg-purple-100"
                      : "border-gray-200 hover:border-purple-400 bg-white"
                  }`}
                >
                  <div
                    className="w-full h-16 rounded-md mb-2 border-2 border-gray-200"
                    style={{ backgroundColor: pattern.primaryColor }}
                  />
                  <p className="text-sm font-medium text-gray-900 mb-1">{pattern.name}</p>
                  <div className="flex justify-center space-x-1">
                    {pattern.colors.slice(0, 3).map((color, index) => (
                      <span
                        key={index}
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  {selectedPattern === pattern.id && (
                    <span className="pointer-events-none absolute inset-0 ring-2 ring-purple-500 rounded-lg" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Barre compacte des motifs spéciaux */}
        <div className="mt-6">
          <p className="text-purple-800 mb-2 font-medium">Motifs spéciaux</p>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 -mx-1 px-1">
            {specialMotifs.map((pattern) => (
              <button
                key={pattern.id}
                onClick={() => onPatternChange(pattern.id)}
                className={`relative flex-shrink-0 w-16 h-16 rounded-md border-2 overflow-hidden transition-all ${
                  selectedPattern === pattern.id
                    ? "border-purple-600 ring-2 ring-purple-200"
                    : "border-gray-300 hover:border-purple-400"
                }`}
                aria-label={`Choisir motif ${pattern.name}`}
                title={pattern.name}
              >
                <img src={pattern.thumbnail} alt={pattern.name} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setExpandedMotifs((v) => !v)}
            className="mt-2 w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 border-purple-200 bg-white hover:bg-purple-50 transition-colors"
          >
            <span className="text-purple-900 font-medium">Afficher tous les motifs</span>
            <ChevronRight
              className={`w-5 h-5 text-purple-700 transition-transform ${expandedMotifs ? "rotate-90" : ""}`}
            />
          </button>
          {expandedMotifs && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {specialMotifs.map((pattern) => (
                <button
                  key={pattern.id}
                  onClick={() => onPatternChange(pattern.id)}
                  className={`relative p-4 rounded-lg border-2 transition-all ${
                    selectedPattern === pattern.id
                      ? "border-purple-600 bg-purple-100"
                      : "border-gray-200 hover:border-purple-400 bg-white"
                  }`}
                >
                  <img
                    src={pattern.thumbnail}
                    alt={pattern.name}
                    className="w-full aspect-square object-cover rounded-md mb-3"
                  />
                  <p className="font-semibold text-gray-900 mb-1">{pattern.name}</p>
                  <p className="text-sm text-gray-600">{pattern.description}</p>
                  {selectedPattern === pattern.id && (
                    <span className="pointer-events-none absolute inset-0 ring-2 ring-purple-500 rounded-lg" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Note importante */}
        <div className="mt-6 bg-amber-50 rounded-lg p-4 border border-amber-200">
          <p className="text-amber-800 text-sm leading-relaxed">
            <strong>📝 Note :</strong> Ces sélections seront transmises à l'artisan lors de la finalisation de votre commande.
            Chaque pièce sera personnalisée selon vos préférences de couleurs et motifs.
          </p>
        </div>
      </div>
    </div>
  );
}
