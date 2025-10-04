import { createFileRoute } from '@tanstack/react-router';
import { BookOpen, Brain, Briefcase, Globe, Target, Users } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export const Route = createFileRoute('/_onboarding/series')({
  component: SeriesSelection,
  beforeLoad: () => {
    // Verify grade was selected
    const grade = localStorage.getItem('onboarding_grade');
    if (!grade || grade !== 'Terminale') {
      throw new Error('Invalid onboarding state');
    }
  },
});

function SeriesSelection() {
  // const navigate = useNavigate();
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);
  const [secondLanguage, setSecondLanguage] = useState<string | null>(null);

  const series = [
    {
      value: 'A',
      title: 'Série A - Littéraire',
      description: 'Spécialisation en lettres, philosophie et langues',
      needsLanguage: true,
      badge: 'Humanités',
      icon: BookOpen,
      color: 'from-amber-50 to-amber-100',
      textColor: 'text-amber-900',
      features: [
        'Français approfondi',
        'Philosophie',
        'Littérature comparée',
        'Deux langues vivantes',
      ],
      subjects: ['Français', 'Philosophie', 'Langues', 'Histoire-Géographie'],
      careerPaths: ['Lettres', 'Journalisme', 'Enseignement', 'Communication'],
      difficulty: 'Écrit intense',
    },
    {
      value: 'C',
      title: 'Série C - Sciences Exactes',
      description: 'Mathématiques, physique et chimie avancées',
      needsLanguage: true,
      badge: 'Sciences',
      icon: Brain,
      color: 'from-cyan-50 to-cyan-100',
      textColor: 'text-cyan-900',
      features: [
        'Mathématiques expertes',
        'Physique-chimie',
        'Langue vivante',
        'Informatique',
      ],
      subjects: ['Maths', 'Physique-Chimie', 'Langue', 'Informatique'],
      careerPaths: ['Ingénierie', 'Recherche', 'Informatique', 'Architecture'],
      difficulty: 'Analyse rigoureuse',
    },
    {
      value: 'D',
      title: 'Série D - Sciences Naturelles',
      description: 'Biologie, géologie et sciences naturelles',
      needsLanguage: true,
      badge: 'Biosciences',
      icon: Globe,
      color: 'from-green-50 to-green-100',
      textColor: 'text-green-900',
      features: [
        'SVT approfondies',
        'Physique-chimie',
        'Langue vivante',
        'Mathématiques',
      ],
      subjects: ['SVT', 'Physique-Chimie', 'Langue', 'Mathématiques'],
      careerPaths: ['Médecine', 'Biologie', 'Pharmacie', 'Recherche'],
      difficulty: 'Sciences appliquées',
    },
    {
      value: 'E',
      title: 'Série E - Économie',
      description: 'Économie, gestion et droit des affaires',
      needsLanguage: false,
      badge: 'Économie',
      icon: Target,
      color: 'from-indigo-50 to-indigo-100',
      textColor: 'text-indigo-900',
      features: [
        'Économie générale',
        'Comptabilité',
        'Droit',
        'Statistiques',
      ],
      subjects: ['Économie', 'Comptabilité', 'Droit', 'Mathématiques'],
      careerPaths: ['Commerce', 'Finance', 'Gestion', 'Marketing'],
      difficulty: 'Analyse économique',
    },
    {
      value: 'G',
      title: 'Série G - Gestion',
      description: 'Gestion administrative et droit des affaires',
      needsLanguage: false,
      badge: 'Gestion',
      icon: Briefcase,
      color: 'from-rose-50 to-rose-100',
      textColor: 'text-rose-900',
      features: [
        'Comptabilité approfondie',
        'Droit des affaires',
        'Économie',
        'Gestion',
      ],
      subjects: ['Comptabilité', 'Droit', 'Économie', 'Mathématiques'],
      careerPaths: ['Audit', 'Contrôle de gestion', 'RH', 'Entrepreneuriat'],
      difficulty: 'Pratique orientée',
    },
  ];

  const languages = [
    {
      value: 'ALL',
      title: 'Allemand',
      description: 'Allemand niveau avancé',
      flag: '🇩🇪',
      countries: ['Allemagne', 'Autriche', 'Suisse'],
      careerBenefit: 'Essentiel pour ingénierie automobile et mécanique',
    },
    {
      value: 'ESP',
      title: 'Espagnol',
      description: 'Espagnol niveau avancé',
      flag: '🇪🇸',
      countries: ['Espagne', 'Amérique Latine', 'États-Unis'],
      careerBenefit: 'Important pour relations internationales',
    },
  ];

  const needsLanguageChoice = selectedSeries && ['A', 'C', 'D'].includes(selectedSeries);
  const canContinue = selectedSeries && (!needsLanguageChoice || secondLanguage);

  const handleContinue = () => {
    if (!canContinue) { return; }

    localStorage.setItem('onboarding_series', selectedSeries!);
    if (secondLanguage) {
      localStorage.setItem('onboarding_language', secondLanguage);
    }

    // navigate({ to: '/onboarding/complete' });
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
          ✓
        </div>
        <div className="w-16 h-1 bg-primary rounded-full"></div>
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
          2
        </div>
        <div className="w-16 h-1 bg-muted rounded-full"></div>
        <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-semibold text-sm">
          3
        </div>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl">Quelle série BAC ?</CardTitle>
          <CardDescription className="text-base">
            Sélectionne ta filière BAC pour un apprentissage spécialisé
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pb-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {series.map((s) => {
              const isSelected = selectedSeries === s.value;

              return (
                <Card
                  key={s.value}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-xl border-2 ${
                    isSelected
                      ? 'border-primary bg-primary/5 scale-105'
                      : 'border-transparent hover:border-gray-200'
                  }`}
                  onClick={() => {
                    setSelectedSeries(s.value);
                    // Reset language choice if series doesn't need it
                    if (!s.needsLanguage) {
                      setSecondLanguage(null);
                    }
                  }}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant={isSelected ? 'default' : 'outline'} className="font-medium">
                        Série
                        {' '}
                        {s.value}
                      </Badge>
                      {isSelected && (
                        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 01-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-bold text-lg">{s.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {s.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full">
                          <s.icon className="w-3 h-3" />
                          <span>{s.badge}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full">
                          <Users className="w-3 h-3" />
                          <span>
                            {s.subjects.length}
                            {' '}
                            matières
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full">
                          <Target className="w-3 h-3" />
                          <span>{s.difficulty}</span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="mt-4 p-3 rounded-lg bg-gradient-to-r border-2 border-primary/20">
                          <h4 className="font-semibold text-sm mb-2 text-primary">Carrières possibles :</h4>
                          <div className="flex flex-wrap gap-2 text-xs">
                            {s.careerPaths.map(path => (
                              <span
                                key={path}
                                className="bg-primary/10 text-primary px-2 py-1 rounded-full"
                              >
                                {path}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Language choice for series A, C, D */}
          {needsLanguageChoice && (
            <Card className={`bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 ${
              secondLanguage ? 'ring-2 ring-amber-500' : ''
            }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-5 h-5 text-orange-600" />
                  <h4 className="font-semibold text-lg text-orange-900">
                    Choix de la deuxième langue
                  </h4>
                  <Badge variant="outline" className="text-orange-600 border-orange-200">
                    Obligatoire
                  </Badge>
                </div>
                <RadioGroup value={secondLanguage || ''} onValueChange={setSecondLanguage}>
                  <div className="flex items-center space-x-6">
                    {languages.map(lang => (
                      <div key={lang.value} className="flex items-center space-x-3">
                        <RadioGroupItem
                          value={lang.value}
                          id={lang.value}
                          className="text-orange-600 border-orange-300 focus:border-orange-500"
                        />
                        <Label
                          htmlFor={lang.value}
                          className="flex items-center gap-2 cursor-pointer text-sm font-medium"
                        >
                          <span className="text-lg">{lang.flag}</span>
                          <div>
                            <div className="font-semibold">{lang.title}</div>
                            <div className="text-xs text-muted-foreground">{lang.description}</div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>

                {secondLanguage && (
                  <div className="mt-4 p-3 bg-white rounded-lg border border-orange-200">
                    <p className="text-sm text-orange-800">
                      <strong>Avantage carrière :</strong>
                      {' '}
                      {languages.find(l => l.value === secondLanguage)?.careerBenefit}
                    </p>
                    <p className="text-xs text-orange-600 mt-1">
                      Utile pour les relations avec
                      {' '}
                      {languages.find(l => l.value === secondLanguage)?.countries.join(', ')}
                      .
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              // onClick={() => navigate({ to: '/onboarding/grade' })}
              className="flex-1 h-12"
            >
              Retour
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!canContinue}
              className="flex-1 h-12 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {canContinue ? 'Continuer' : 'Sélection requise'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
