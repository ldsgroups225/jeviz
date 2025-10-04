import { createFileRoute, Link } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Circle,
  Clock,
  Flame,
  TrendingUp,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { getSubjectDetail } from '@/core/functions/learn';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/_auth/learn/subject/$subjectId')({
  component: SubjectDetail,
  loader: async ({ context, params }) => {
    await context.queryClient.prefetchQuery({
      queryKey: ['subject', parseInt(params.subjectId)],
      queryFn: () => getSubjectDetail({ data: { subjectId: parseInt(params.subjectId) } }),
    });
  },
});

function SubjectDetail() {
  const { subjectId } = Route.useParams();
  const { data } = useSuspenseQuery({
    queryKey: ['subject', parseInt(subjectId)],
    queryFn: () => getSubjectDetail({ data: { subjectId: parseInt(subjectId) } }),
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facile': return 'bg-green-100 text-green-800 border-green-200';
      case 'moyen': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'difficile': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getChapterIcon = (chapter: typeof data.chapters[0]) => {
    if (chapter.isCompleted) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    if (chapter.isStarted) {
      return <Flame className="w-5 h-5 text-orange-500" />;
    }
    return <Circle className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link to="/learn">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
      </Link>

      {/* Subject Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{data.name}</h1>
            <Badge variant="secondary">Coefficient {data.coefficient}</Badge>
          </div>
          <p className="text-muted-foreground">
            {data.completedChapters} / {data.totalChapters} chapitres complétés
          </p>
        </div>
      </div>

      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Vue d'ensemble</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Progress Circle */}
            <div className="flex items-center justify-center">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-muted stroke-current"
                    strokeWidth="10"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-primary stroke-current"
                    strokeWidth="10"
                    strokeLinecap="round"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 40}`,
                      strokeDashoffset: `${2 * Math.PI * 40 * (1 - data.masteryPercentage / 100)}`,
                      transform: 'rotate(-90deg)',
                      transformOrigin: '50% 50%',
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{data.masteryPercentage}%</div>
                    <div className="text-xs text-muted-foreground">Maîtrise</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{data.totalChapters}</div>
                <div className="text-sm text-muted-foreground">Chapitres</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{data.completedChapters}</div>
                <div className="text-sm text-muted-foreground">Complétés</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{data.estimatedHoursRemaining}h</div>
                <div className="text-sm text-muted-foreground">Restantes</div>
              </div>
            </div>

            {/* Last Studied */}
            {data.lastStudied && (
              <div className="text-center text-sm text-muted-foreground">
                Dernière étude {formatDistanceToNow(data.lastStudied, { addSuffix: true, locale: fr })}
              </div>
            )}

            {/* Performance Chart */}
            {data.recentQuizScores.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Évolution des scores
                </h3>
                <div className="flex items-end gap-2 h-20">
                  {data.recentQuizScores.reverse().map((score, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-primary rounded-t"
                        style={{ height: `${score}%` }}
                      />
                      <span className="text-xs mt-1">{score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-primary/5 border-primary/20 hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Révision rapide</h3>
                <p className="text-sm text-muted-foreground">
                  Flashcards aléatoires de tous les chapitres
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/5 border-secondary/20 hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Quiz complet</h3>
                <p className="text-sm text-muted-foreground">
                  Testez toute la matière
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chapters List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Chapitres</h2>
        <div className="space-y-3">
          {data.chapters.map((chapter) => (
            <Link
              key={chapter.id}
              to="/learn/study/$subjectId/$chapterId/mode"
              params={{
                subjectId: subjectId,
                chapterId: chapter.id.toString()
              }}
            >
              <Card className={cn(
                "cursor-pointer hover:shadow-lg transition-all",
                chapter.isCompleted && "border-green-500/50 bg-green-50/50 dark:bg-green-950/20"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Chapter Icon */}
                    <div className="mt-1">
                      {getChapterIcon(chapter)}
                    </div>

                    {/* Chapter Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          Chapitre {chapter.order}
                        </Badge>
                        <Badge className={cn("text-xs", getDifficultyColor(chapter.difficulty))}>
                          {chapter.difficulty}
                        </Badge>
                      </div>

                      <h3 className="font-semibold mb-1">{chapter.title}</h3>

                      {chapter.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {chapter.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {chapter.flashcardCount} cartes
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          {chapter.quizQuestionCount} questions
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {chapter.estimatedHours}h
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Maîtrise</span>
                          <span className="font-semibold">{chapter.masteryPercentage}%</span>
                        </div>
                        <Progress value={chapter.masteryPercentage} className="h-2" />
                      </div>

                      {chapter.lastStudied && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Étudié {formatDistanceToNow(chapter.lastStudied, { addSuffix: true, locale: fr })}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}