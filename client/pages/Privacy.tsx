import { Layout } from "../components/Layout";
import { motion } from "framer-motion";
import { Shield, Eye, Lock, Users, Mail, Phone } from "lucide-react";

export default function Privacy() {
  return (
    <Layout>
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-full p-4 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-amber-900 mb-4">
              Politique de Confidentialité
            </h1>
            <p className="text-xl text-gray-700">
              Belkhadir Poterie respecte votre vie privée et protège vos données personnelles
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
            </p>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Introduction */}
            <section className="bg-white rounded-2xl p-8 shadow-lg border border-amber-100">
              <h2 className="text-2xl font-bold text-amber-900 mb-4 flex items-center">
                <Eye className="w-6 h-6 mr-3" />
                1. Introduction
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Belkhadir Poterie, dirigée par l'artisan Idriss Belkhadir, s'engage à 
                  protéger et respecter votre vie privée. Cette politique explique comment 
                  nous collectons, utilisons et protégeons vos informations personnelles 
                  lorsque vous utilisez notre site web ou nos services.
                </p>
                <p>
                  En utilisant notre site web ou en nous contactant, vous acceptez les 
                  pratiques décrites dans cette politique de confidentialité.
                </p>
              </div>
            </section>

            {/* Données collectées */}
            <section className="bg-white rounded-2xl p-8 shadow-lg border border-amber-100">
              <h2 className="text-2xl font-bold text-amber-900 mb-4 flex items-center">
                <Users className="w-6 h-6 mr-3" />
                2. Informations que nous collectons
              </h2>
              <div className="space-y-6 text-gray-700">
                <div>
                  <h3 className="text-lg font-semibold text-amber-800 mb-3">
                    📋 Informations que vous nous fournissez directement :
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Nom et prénom</li>
                    <li>Numéro de téléphone</li>
                    <li>Adresse e-mail</li>
                    <li>Adresse de livraison</li>
                    <li>Préférences de personnalisation (couleurs, motifs, tailles)</li>
                    <li>Messages et demandes spéciales</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-amber-800 mb-3">
                    🌐 Informations collectées automatiquement :
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Adresse IP</li>
                    <li>Type de navigateur et version</li>
                    <li>Pages visitées et temps passé</li>
                    <li>Données de navigation (cookies techniques)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Utilisation des données */}
            <section className="bg-white rounded-2xl p-8 shadow-lg border border-amber-100">
              <h2 className="text-2xl font-bold text-amber-900 mb-4 flex items-center">
                <Lock className="w-6 h-6 mr-3" />
                3. Comment nous utilisons vos informations
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="font-medium text-amber-800">
                  Nous utilisons vos informations uniquement pour :
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Traiter et exécuter vos commandes de poterie</li>
                  <li>Communiquer avec vous concernant vos commandes</li>
                  <li>Créer des pièces personnalisées selon vos spécifications</li>
                  <li>Organiser la livraison de vos produits</li>
                  <li>Répondre à vos questions et demandes de support</li>
                  <li>Améliorer notre site web et nos services</li>
                  <li>Respecter nos obligations légales</li>
                </ul>
                
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mt-6">
                  <p className="text-amber-800 font-medium">
                    🔒 <strong>Important :</strong> Nous ne vendons jamais vos données 
                    personnelles à des tiers et nous ne les utilisons jamais à des fins 
                    publicitaires externes.
                  </p>
                </div>
              </div>
            </section>

            {/* WhatsApp */}
            <section className="bg-white rounded-2xl p-8 shadow-lg border border-amber-100">
              <h2 className="text-2xl font-bold text-amber-900 mb-4 flex items-center">
                <Phone className="w-6 h-6 mr-3" />
                4. Communication via WhatsApp
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Lorsque vous utilisez notre formulaire de personnalisation, vos informations 
                  sont transmises via WhatsApp à notre équipe d'artisans (+212 675-202336).
                </p>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">Sécurité WhatsApp :</h3>
                  <ul className="list-disc list-inside space-y-1 text-green-700">
                    <li>Messages chiffrés de bout en bout</li>
                    <li>Aucun stockage sur serveurs intermédiaires</li>
                    <li>Communication directe avec nos artisans</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Protection des données */}
            <section className="bg-white rounded-2xl p-8 shadow-lg border border-amber-100">
              <h2 className="text-2xl font-bold text-amber-900 mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-3" />
                5. Protection de vos données
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Nous mettons en place des mesures techniques et organisationnelles 
                  appropriées pour protéger vos données personnelles :
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Connexions sécurisées HTTPS</li>
                  <li>Accès restreint aux données personnelles</li>
                  <li>Stockage sécurisé et sauvegarde régulière</li>
                  <li>Formation de notre équipe sur la protection des données</li>
                </ul>
              </div>
            </section>

            {/* Vos droits */}
            <section className="bg-white rounded-2xl p-8 shadow-lg border border-amber-100">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">
                6. Vos droits
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>Vous avez le droit de :</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-amber-800 mb-2">✅ Accès</h3>
                    <p className="text-sm">Consulter vos données personnelles</p>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-amber-800 mb-2">✏️ Rectification</h3>
                    <p className="text-sm">Corriger vos informations</p>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-amber-800 mb-2">🗑️ Suppression</h3>
                    <p className="text-sm">Demander l'effacement</p>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-amber-800 mb-2">📤 Portabilité</h3>
                    <p className="text-sm">Récupérer vos données</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-gradient-to-r from-amber-600 to-orange-700 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Mail className="w-6 h-6 mr-3" />
                7. Nous contacter
              </h2>
              <div className="space-y-4">
                <p>
                  Pour toute question concernant cette politique de confidentialité 
                  ou pour exercer vos droits, contactez-nous :
                </p>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>📧 Email :</strong><br />
                      Belkhadir.poterie@gmail.com<br />
                      Belkadi626@gmail.com
                    </div>
                    <div>
                      <strong>📞 Téléphone :</strong><br />
                      +212 661 724 956<br />
                      +212 675 202 336
                    </div>
                  </div>
                  <div className="mt-4">
                    <strong>📍 Adresse :</strong><br />
                    Belkhadir Poterie<br />
                    62, village des potiers<br />
                    Safi, Maroc
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        </div>
      </main>
    </Layout>
  );
}
