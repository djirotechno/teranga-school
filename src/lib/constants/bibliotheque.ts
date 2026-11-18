export interface DocumentItem {
  id: string;
  title: string;
  matiere: 'Français' | 'Histoire-Géo' | 'Philosophie';
  format: string;
  size: string;
  pagesCount: number;
  description: string;
  content: {
    title: string;
    level: string;
    intro: string;
    sections: {
      heading: string;
      points: string[];
      tip?: string;
    }[];
    retainedPoints: string[];
  };
}

export const BIBLIOTHEQUE_DOCUMENTS: DocumentItem[] = [
  {
    id: 'argumentation-fiche-de-synthese',
    title: "L'argumentation — fiche de synthèse",
    matiere: 'Français',
    format: 'PDF',
    size: '1,2 Mo',
    pagesCount: 6,
    description: "Méthodologie complète pour identifier les types d'arguments, les connecteurs logiques et construire une argumentation persuasive pour le bac.",
    content: {
      title: "L'Argumentation : Stratégies et Procédés Rhétoriques",
      level: "Terminale Littéraire & Scientifique",
      intro: "L'argumentation vise à modifier l'état de croyance d'un destinataire en s'adressant soit à sa raison (convaincre), soit à sa sensibilité (persuader). Elle repose sur une thèse étayée par des arguments illustrés d'exemples précis.",
      sections: [
        {
          heading: "1. Thèse, Arguments et Exemples",
          points: [
            "La thèse : prise de position défendue (thèse soutenue) ou réfutée (thèse adverse).",
            "L'argument : proposition logique abstraite servant de preuve à la thèse.",
            "L'exemple : fait concret, citation, donnée historique ou statistique qui valide et rend tangible l'argument.",
            "Attention : un exemple seul ne vaut pas démonstration sans commentaire explicatif."
          ],
          tip: "Dans une dissertation, ne commencez jamais un paragraphe par un exemple, mais toujours par l'argument théorique."
        },
        {
          heading: "2. Les grands types d'arguments",
          points: [
            "Argument d'autorité : recours à une figure légitime (écrivain, savant, philosophe reconnu).",
            "Argument par analogie : rapprochement avec une situation comparable pour éclairer la thèse.",
            "Argument par l'absurde : démonstration de la fausseté de la thèse opposée par ses conséquences inacceptables.",
            "Argument pragmatique : jugement d'une idée à partir de ses conséquences pratiques bénéfiques ou néfastes."
          ]
        },
        {
          heading: "3. Les connecteurs logiques essentiels",
          points: [
            "Cause : car, en effet, étant donné que, puisque.",
            "Conséquence : ainsi, par conséquent, d'où, c'est pourquoi.",
            "Opposition / Concession : néanmoins, certes... mais, toutefois, bien que.",
            "Addition / Gradation : de plus, en outre, qui plus est, non seulement... mais encore."
          ],
          tip: "Variez vos connecteurs logiques pour structurer rigoureusement les transitions entre vos sous-parties."
        }
      ],
      retainedPoints: [
        "Distinguer convaincre (intellect/raison) et persuader (sentiments/émotions).",
        "Toujours articuler : Thèse ➔ Argument ➔ Exemple analysé ➔ Bilan intermédiaire.",
        "Soigner le circuit argumentatif et le choix des verbes modalisateurs."
      ]
    }
  },
  {
    id: 'dissertation-methode',
    title: 'La dissertation — méthode',
    matiere: 'Français',
    format: 'PDF',
    size: '2,4 Mo',
    pagesCount: 12,
    description: "Guide méthodologique complet pour réussir l'analyse du sujet, la problématisation, le plan détaillé et la rédaction au baccalauréat.",
    content: {
      title: "Méthodologie de la Dissertation Littéraire",
      level: "Terminale toutes séries",
      intro: "La dissertation littéraire est un exercice de réflexion personnelle et critique portant sur une problématique esthétique ou littéraire. Elle évalue la culture littéraire, la rigueur de raisonnement et la clarté de l'expression.",
      sections: [
        {
          heading: "1. L'analyse du sujet au brouillon",
          points: [
            "Définir scrupuleusement chaque mot-clé et repérer les opérateurs de relation (ex : 'toujours', 'uniquement', 'dans quelle mesure').",
            "Identifier le domaine littéraire et le genre concerné (poésie, roman, théâtre, littérature d'idées).",
            "Reformuler le sujet pour en faire émerger la tension ou le paradoxe sous-jacent.",
            "Poser la question problématique directrice."
          ],
          tip: "Consacrez au moins 45 minutes à cette étape préliminaire afin d'éviter tout hors-sujet."
        },
        {
          heading: "2. Les types de plans",
          points: [
            "Plan dialectique (Thèse / Antithèse / Synthèse ou Dépassement) : indiqué pour les sujets sous forme de question fermée ('Peut-on dire que... ?').",
            "Plan thématique : approprié pour analyser différentes facettes d'un même phénomène ('En quoi la poésie permet-elle... ?').",
            "Plan comparatif : confronte deux concepts, œuvres ou perspectives complémentaires."
          ]
        },
        {
          heading: "3. La structure de l'introduction et de la conclusion",
          points: [
            "Introduction (4 étapes obligatoires) : Amorce pertinente, Citation/énoncé du sujet, Problématique explicite, Annonce claire des axes.",
            "Conclusion (2 étapes) : Bilan synthétique répondant à la problématique, Ouverture littéraire élargie vers une autre œuvre ou perspective."
          ],
          tip: "Rédigez toujours entièrement l'introduction et la conclusion au brouillon avant d'entamer le développement."
        }
      ],
      retainedPoints: [
        "Un paragraphe = une idée directrice + un argument + un exemple littéraire analysé.",
        "Transitions soignées à la fin de chaque grande partie.",
        "Éviter les ouvertures par de simples questions rhétoriques en conclusion."
      ]
    }
  },
  {
    id: 'systeme-monde-fascicule',
    title: 'Le système-monde — fascicule',
    matiere: 'Histoire-Géo',
    format: 'PDF',
    size: '3,1 Mo',
    pagesCount: 18,
    description: "Analyse approfondie de l'organisation géopolitique et géoéconomique de la mondialisation, des pôles de puissance aux périphéries.",
    content: {
      title: "Géographie : Des Espaces Mondialisés Inégalement Intégrés",
      level: "Terminale - Géographie",
      intro: "Le système-monde contemporain se caractérise par une interdépendance accrue des territoires sous l'effet des flux matériels et immatériels. Cette dynamique accentue la polarisation spatiale entre centres décisionnels et espaces périphériques.",
      sections: [
        {
          heading: "1. Les centres d'impulsion de l'économie mondiale",
          points: [
            "L'Archipel Mégalopolitain Mondial (AMM) concentre l'essentiel des fonctions de commandement économique, financier et technologique.",
            "Les trois pôles traditionnels (Amérique du Nord, Europe de l'Ouest, Asie de l'Est) continuent de dominer les IDE et la R&D.",
            "Les métropoles globales (New York, Londres, Tokyo, Paris) constituent les nœuds cardinaux des réseaux mondiaux."
          ],
          tip: "Pensez à citer les indices de rayonnement : concentration des sièges de FTN, places boursières, aéroports internationaux de rang mondial."
        },
        {
          heading: "2. L'affirmation des puissances émergentes",
          points: [
            "Les BRICS+ et puissances régionales redéfinissent la géopolitique mondiale et revendiquent une gouvernance multipolaire.",
            "L'Asie Pacifique s'est muée en principal atelier manufacturier et pôle d'échanges maritimes de la planète (détroit de Malacca).",
            "Différenciation interne marquée : insertion industrielle avancée versus dépendance persistante aux cours des matières premières."
          ]
        },
        {
          heading: "3. Périphéries et marges du système-monde",
          points: [
            "Périphéries intégrées : zones franches, hubs logistiques maritimes (ex : Tanger Med, Dakar).",
            "Marges délaissées et Pays les Moins Avancés (PMA) : enclavement, vulnérabilité aux chocs climatiques et instabilité institutionnelle.",
            "Inégalités socio-spatiales à toutes les échelles (villes fragmentées, disparités littoraux / intérieurs)."
          ]
        }
      ],
      retainedPoints: [
        "La mondialisation hiérarchise les territoires : littoralisation et métropolisation.",
        "Savoir mobiliser des études de cas précises (façade maritime, hub portuaire, métropole).",
        "Toujours croiser les dimensions économique, géostratégique et environnementale."
      ]
    }
  },
  {
    id: 'opinion-et-raison-cours',
    title: "L'opinion et la raison — cours",
    matiere: 'Philosophie',
    format: 'PDF',
    size: '850 Ko',
    pagesCount: 8,
    description: "Distinction conceptuelle entre doxa et épistémè, méthode cartésienne du doute et conditions de la vérité rationnelle.",
    content: {
      title: "Philosophie : Vérité, Raison et Opinion",
      level: "Terminale - Philosophie",
      intro: "L'opinion (doxa) est une adhésion immédiate, souvent naïve ou préjugée, tenue pour vraie sans examen critique. La raison (logos) procède au contraire par discernement, argumentation et quête de fondement universellement valide.",
      sections: [
        {
          heading: "1. Platon : La caverne et la rupture avec la doxa",
          points: [
            "Dans l'Allégorie de la Caverne (République, livre VII), les prisonniers prennent les ombres pour la réalité véritable.",
            "L'opinion droite peut par hasard coïncider avec le vrai, mais elle demeure instable faute de lien de cause à effet (Théétète).",
            "La démarche philosophique exige une conversion du regard pour s'élever du monde sensible au monde intelligible."
          ],
          tip: "Utilisez la distinction platonicienne pour montrer que croire n'est pas savoir."
        },
        {
          heading: "2. Descartes : Le doute méthodique comme fondation du savoir",
          points: [
            "Dans les Méditations Métaphysiques, René Descartes entreprend de renverser toutes ses anciennes opinions non démontrées.",
            "Le doute est hyperbolique et radical : il met à l'épreuve les sens, le monde matériel et les démonstrations mathématiques.",
            "Le 'Cogito ergo sum' constitue le premier principe inébranlable : la conscience pensante résiste à toute illusion."
          ]
        },
        {
          heading: "3. Kant et l'usage critique de la raison",
          points: [
            "La devise des Lumières : 'Sapere aude !' (Aie le courage de te servir de ton propre entendement !).",
            "Distinguer la persuasion (valable pour soi seul) et la conviction (fondée sur des motifs objectifs partageables par tout être raisonnable).",
            "La raison doit reconnaître ses propres limites pour ne pas basculer dans le dogmatisme ou le fanatisme."
          ]
        }
      ],
      retainedPoints: [
        "Distinguer rigoureusement : Opinion (croyance sans fondement) vs Science (connaissance démontrée).",
        "La liberté de pensée commence par l'émancipation à l'égard des préjugés acquis.",
        "La vérité rationnelle n'est pas un dogme figé mais une exigence de justification universelle."
      ]
    }
  }
];
