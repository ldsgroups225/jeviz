import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowLeft, BookOpen, Clock, HelpCircle, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getChapterModes } from '@/core/functions/learn';

export const Route = createFileRoute('/_auth/learn/study/$subjectId/$chapterId/mode')({
  component: ModeSelection,
  loader: async ({ context, params }) => {
    await context.queryClient.prefetchQuery({
      queryKey: ['chapter-modes', Number.parseInt(params.chapterId)],
      queryFn: () => getChapterModes({ data: { chapterId: Number.parseInt(params.chapterId) } }),
    });
  },
});

function ModeSelection() {
  const { subjectId, chapterId } = Route.useParams();
  const { data } = useSuspenseQuery({
    queryKey: ['chapter-modes', Number.parseInt(chapterId)],
    queryFn: () => getChapterModes({ data: { chapterId: Number.parseInt(chapterId) } }),
  });

  const modes = [
    {
      type: 'flashcards',
      icon: BookOpen,
      title: 'Flashcards',
      description: 'Mémorise avec la répétition espacée',
      color: 'blue',
      stats: [
        { label: 'Total', value: `${data.flashcardStats.total} cartes` },
        { label: 'Nouvelles', value: `${data.flashcardStats.newCards} cartes`, highlight: data.flashcardStats.newCards > 0 },
        { label: 'À réviser', value: `${data.flashcardStats.reviewCards} cartes`, highlight: data.flashcardStats.reviewCards > 0 },
        { label: 'Maîtrisées', value: `${data.flashcardStats.masteredCards} cartes`, highlight: false },
      ],
      estimatedMinutes: data.flashcardStats.estimatedMinutes,
      route: `/learn/study/${subjectId}/${chapterId}/flashcards`,
      disabled: data.flashcardStats.total === 0,
    },
    {
      type: 'quiz',
      icon: HelpCircle,
      title: 'Quiz',
      description: 'Teste tes connaissances',
      color: 'purple',
      stats: [
        { label: 'Questions', value: `${data.quizStats.totalQuestions}` },
        { label: 'Tentatives', value: `${data.quizStats.attempts}`, highlight: false },
        { label: 'Score moyen', value: data.quizStats.averageScore ? `${data.quizStats.averageScore}%` : 'Pas encore', highlight: false },
        ...(data.quizStats.lastAttemptDate
          ? [{
              label: 'Dernière tentative',
              value: formatDistanceToNow(data.quizStats.lastAttemptDate, { addSuffix: true, locale: fr }),
              highlight: false,
            }]
          : []),
      ],
      estimatedMinutes: data.quizStats.estimatedMinutes,
      route: `/learn/study/${subjectId}/${chapterId}/quiz`,
      disabled: data.quizStats.totalQuestions === 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link to="/learn/subject/$subjectId" params={{ subjectId }}>
        <Button variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
      </Link>

      {/* Header */}
      <div>
        <Badge variant="secondary" className="mb-2">{data.chapter.subjectName}</Badge>
        <h1 className="text-3xl font-bold">{data.chapter.title}</h1>
        <p className="text-muted-foreground mt-1">
          Choisis ta méthode d'apprentissage
        </p>
      </div>

      {/* Mode Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modes.map((mode) => {
          const Icon = mode.icon;

          return (
            <Card
              key={mode.type}
              className={`hover:shadow-xl transition-all ${mode.disabled ? 'opacity-60' : 'cursor-pointer'}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-${mode.color}-100 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${mode.color}-600`} />
                  </div>
                </div>
                <CardTitle>{mode.title}</CardTitle>
                <CardDescription>{mode.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="space-y-2">
                  {mode.stats.map((stat, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{stat.label}</span>
                      <span className={`font-semibold ${
                        stat.highlight ? 'text-orange-600' : ''
                      }`}
                      >
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Estimated Time */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                  <Clock className="w-4 h-4" />
                  <span>
                    ~
                    {mode.estimatedMinutes}
                    {' '}
                    min
                  </span>
                </div>

                {/* Action Button */}
                <Button
                  className="w-full"
                  disabled={mode.disabled}
                  onClick={() => {
                    // For now, just log a message since we haven't implemented these routes yet
                    console.log(`Mode ${mode.type} sera bientôt disponible!`);
                  }}
                >
                  {mode.disabled ? 'Contenu indisponible' : 'Bientôt disponible'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Option */}
      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Leçon</h3>
                <p className="text-sm text-muted-foreground">
                  Lire le résumé du chapitre
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" disabled>
              Bientôt disponible
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Help Text */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
        <CardContent className="p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>💡 Conseil:</strong>
            {' '}
            Utilise les flashcards pour mémoriser, puis teste-toi avec le quiz pour vérifier ta compréhension.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
