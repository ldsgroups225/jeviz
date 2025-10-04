import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Award, BookOpen, CheckCircle, Sparkles, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const Route = createFileRoute('/_onboarding/complete')({
  component: CompleteOnboarding,
});

function CompleteOnboarding() {
  const [isProcessing, setIsProcessing] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onboardingData = {
    grade: localStorage.getItem('onboarding_grade') as '3ème' | 'Terminale',
    series: localStorage.getItem('onboarding_series') as string | undefined,
    secondLanguage: localStorage.getItem('onboarding_language') as string | undefined,
  };

  const mutation = useMutation({
    mutationFn: async (data: typeof onboardingData) => {
      // This will be implemented with the actual server function
      console.log('Saving onboarding data:', data);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      return { success: true, subjectCount: data.grade === '3ème' ? 12 : 10 };
    },
    onSuccess: () => {
      setIsCompleted(true);

      // Clear localStorage
      localStorage.removeItem('onboarding_grade');
      localStorage.removeItem('onboarding_series');
      localStorage.removeItem('onboarding_language');

      // Redirect to main app after a short delay
      setTimeout(() => {
        // navigate({ to: '/learn', replace: true });
      }, 2000);
    },
    onError: (error: Error) => {
      setError(error.message);
      setIsProcessing(false);
    },
  });

  useEffect(() => {
    if (!onboardingData.grade) {
      // navigate({ to: '/onboarding/grade' });
      return;
    }

    mutation.mutate(onboardingData);
  }, []);

  const getGradeInfo = () => {
    if (onboardingData.grade === '3ème') {
      return {
        title: 'Préparation au BEPC',
        exam: 'Brevet d\'Études du Premier Cycle',
        subjectCount: 12,
        subjects: ['Maths', 'Français', 'SVT', 'Physique-Chimie', 'HG', 'Anglais', 'ECM', 'Technologie', 'Arts', 'EPS', 'Musique', 'EFS'],
        color: 'from-blue-50 to-blue-100',
        textColor: 'text-blue-900',
      };
    }

    const series = onboardingData.series;
    const seriesInfo = {
      A: {
        title: 'Série A - Littéraire',
        exam: 'Baccalauréat',
        subjectCount: 13,
        color: 'from-purple-50 to-purple-100',
        textColor: 'text-purple-900',
      },
      C: {
        title: 'Série C - Sciences Exactes',
        exam: 'Baccalauréat',
        subjectCount: 11,
        color: 'from-cyan-50 to-cyan-100',
        textColor: 'text-cyan-900',
      },
      D: {
        title: 'Série D - Sciences Naturelles',
        exam: 'Baccalauréat',
        subjectCount: 11,
        color: 'from-green-50 to-green-100',
        textColor: 'text-green-900',
      },
      E: {
        title: 'Série E - Économie',
        exam: 'Baccalauréat',
        subjectCount: 10,
        color: 'from-indigo-50 to-indigo-100',
        textColor: 'text-indigo-900',
      },
      G: {
        title: 'Série G - Gestion',
        exam: 'Baccalauréat',
        subjectCount: 11,
        color: 'from-rose-50 to-rose-100',
        textColor: 'text-rose-900',
      },
    };

    return seriesInfo[series as keyof typeof seriesInfo] || seriesInfo.A;
  };

  const gradeInfo = getGradeInfo();

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl">
        <CardContent className="p-8 text-center space-y-6">
          {isProcessing && (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Configuration en cours...</h2>
                <p className="text-muted-foreground">
                  Nous personnalisons ton espace d'apprentissage
                </p>
              </div>
            </>
          )}

          {isCompleted && (
            <>
              <div className="flex justify-center mb-6">
                <CheckCircle className="w-20 h-20 text-green-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">Configuration terminée !</h2>
                <p className="text-muted-foreground">
                  Redirection vers ton tableau de bord...
                </p>
              </div>

              <div className={`p-6 rounded-2xl bg-gradient-to-r ${gradeInfo.color} border border-green-200`}>
                <div className="flex items-center justify-center mb-4">
                  <BookOpen className={`w-8 h-8 ${gradeInfo.textColor} mr-3`} />
                  <h3 className={`text-xl font-bold ${gradeInfo.textColor}`}>
                    Tu prépares le
                    {' '}
                    {gradeInfo.exam}
                  </h3>
                </div>
                <div className="text-center">
                  <p className={`${gradeInfo.textColor} font-medium`}>
                    {gradeInfo.title}
                  </p>
                  <Badge variant="outline" className={`mt-2 ${gradeInfo.textColor} border-current`}>
                    {mutation.data?.subjectCount || gradeInfo.subjectCount}
                    {' '}
                    matières à maîtriser
                  </Badge>
                </div>
              </div>
            </>
          )}

          {error && (
            <>
              <div className="text-red-500 text-center">
                <p className="font-semibold">Une erreur est survenue</p>
                <p className="text-sm mt-2">{error}</p>
              </div>
              <Button
                onClick={() => mutation.mutate(onboardingData)}
                className="mt-4"
              >
                Réessayer
              </Button>
            </>
          )}

          {!isProcessing && !isCompleted && !error && (
            <>
              <div className="text-4xl mb-4">🎉</div>
              <div>
                <h2 className="text-2xl font-bold text-primary mb-2">
                  Tu prépares le
                  {' '}
                  {gradeInfo.exam}
                </h2>
                <p className="text-muted-foreground">
                  {onboardingData.series ? `${gradeInfo.title} (Série ${onboardingData.series})` : gradeInfo.title}
                  {onboardingData.secondLanguage && ` - ${onboardingData.secondLanguage === 'ALL' ? 'Allemand' : 'Espagnol'}`}
                </p>
              </div>

              <div className={`p-6 rounded-2xl bg-gradient-to-r ${gradeInfo.color} border border-blue-200`}>
                <h3 className="font-semibold text-lg mb-4 text-center text-blue-900">
                  Avec Jeviz, tu vas :
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Apprendre avec des flashcards intelligentes basées sur la science</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Réviser avec des quiz adaptatifs à ton niveau</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Suivre ta progression en temps réel</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Rejoindre des groupes d'étude pour collaborer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Débloquer des achievements et récompenses</span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-blue-900 text-center">Apprentissage adaptif</h4>
                  <p className="text-xs text-blue-700 text-center mt-1">
                    Notre IA ajuste la difficulté à ton rythme
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-green-900 text-center">Progression visible</h4>
                  <p className="text-xs text-green-700 text-center mt-1">
                    Visualise tes progrès en temps réel
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-purple-900 text-center">Gamification</h4>
                  <p className="text-xs text-purple-700 text-center mt-1">
                    Gagne des XP et débloque des succès
                  </p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <Users className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-amber-900 text-center">Communauté</h4>
                  <p className="text-xs text-amber-700 text-center mt-1">
                    Étudie avec d'autres élèves
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
