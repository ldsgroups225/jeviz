import { createFileRoute } from '@tanstack/react-router';
import { BookOpen, GraduationCap, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const Route = createFileRoute('/_onboarding/grade')({
  component: GradeSelection,
});

function GradeSelection() {
  // const navigate = useNavigate();
  const [selectedGrade, setSelectedGrade] = useState<'3ème' | 'Terminale' | null>(null);

  const grades = [
    {
      value: '3ème' as const,
      title: '3ème - BEPC',
      description: 'Prépare ton Brevet d\'Études du Premier Cycle',
      icon: BookOpen,
      badge: 'Collège',
      subjects: 12,
      exam: 'Brevet',
      duration: '3 jours',
      features: [
        '12 matières obligatoires',
        'Examen écrit',
        'Focus sur les fondamentaux',
        'Préparation au lycée',
      ],
      color: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-900',
      iconColor: 'text-blue-600',
    },
    {
      value: 'Terminale' as const,
      title: 'Terminale - BAC',
      description: 'Prépare ton Baccalauréat selon ta série',
      icon: GraduationCap,
      badge: 'Lycée',
      subjects: '10-15',
      exam: 'Baccalauréat',
      duration: '1 semaine',
      features: [
        'Séries A, C, D, E, G',
        'Spécialisation par domaine',
        'Orientation post-BAC',
        'Accès à l\'université',
      ],
      color: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-900',
      iconColor: 'text-purple-600',
    },
  ];

  const handleContinue = () => {
    if (!selectedGrade) { return; }

    // Store in localStorage temporarily
    localStorage.setItem('onboarding_grade', selectedGrade);

    // Navigate based on selection
    if (selectedGrade === '3ème') {
      // For 3ème, skip series selection and go directly to completion
      // navigate({ to: '/onboarding/complete' });
    }
    else {
      // navigate({ to: '/onboarding/series' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
          1
        </div>
        <div className="w-16 h-1 bg-muted rounded-full"></div>
        <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-semibold text-sm">
          2
        </div>
        <div className="w-16 h-1 bg-muted rounded-full"></div>
        <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-semibold text-sm">
          3
        </div>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl">Quelle est ta classe ?</CardTitle>
          <CardDescription className="text-base">
            Sélectionne ton niveau d'études pour commencer ton parcours d'apprentissage personnalisé
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pb-6">
          <div className="grid gap-4 md:grid-cols-1">
            {grades.map((grade) => {
              const Icon = grade.icon;
              const isSelected = selectedGrade === grade.value;

              return (
                <Card
                  key={grade.value}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-xl border-2 ${
                    isSelected
                      ? 'border-primary bg-primary/5 scale-105'
                      : 'border-transparent hover:border-gray-200'
                  }`}
                  onClick={() => setSelectedGrade(grade.value)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-4 rounded-xl transition-all duration-300 ${
                        isSelected
                          ? 'bg-primary text-primary-foreground shadow-lg'
                          : 'bg-muted'
                      }`}
                      >
                        <Icon className="w-8 h-8" />
                      </div>

                      <div className="flex-1 space-y-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-xl">{grade.title}</h3>
                            <Badge variant="secondary" className="font-medium">
                              {grade.badge}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {grade.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            <span>
                              {grade.subjects}
                              {' '}
                              matières
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            <span>{grade.exam}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{grade.duration}</span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="mt-4 space-y-2">
                            <div className={`p-3 rounded-lg bg-gradient-to-r ${grade.color}`}>
                              <h4 className="font-semibold text-sm mb-2">Ce que tu vas apprendre :</h4>
                              <ul className="text-sm space-y-1">
                                {grade.features.map((feature, index) => (
                                  <li key={index} className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></span>
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end mt-4">
                        {isSelected && (
                          <div className="text-primary">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 01-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Button
            onClick={handleContinue}
            disabled={!selectedGrade}
            className="w-full h-14 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            {selectedGrade ? `Continuer avec ${selectedGrade}` : 'Sélectionne ta classe'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
