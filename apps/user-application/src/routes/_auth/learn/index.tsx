import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BookOpen, Brain, Clock, Flame, Target, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getDashboard } from '@/core/functions/learn';

export const Route = createFileRoute('/_auth/learn/')({
  component: LearnDashboard,
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery({
      queryKey: ['dashboard'],
      queryFn: getDashboard,
    });
  },
});

function LearnDashboard() {
  const { data } = useSuspenseQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboard,
  });

  const getReadinessColor = (score: number) => {
    if (score >= 80) { return 'text-green-600'; }
    if (score >= 60) { return 'text-yellow-600'; }
    return 'text-red-600';
  };

  const getReadinessLabel = (score: number) => {
    if (score >= 80) { return 'Excellent'; }
    if (score >= 60) { return 'Bon'; }
    if (score >= 40) { return 'En progression'; }
    return 'À améliorer';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facile': return 'bg-green-100 text-green-800';
      case 'moyen': return 'bg-yellow-100 text-yellow-800';
      case 'difficile': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Bonjour,
          {data.user.name}
          {' '}
          👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Prêt(e) à progresser aujourd'hui ?
        </p>
      </div>

      {/* Exam Countdown */}
      <Card className="border-primary/50 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Temps restant</p>
              <p className="text-2xl font-bold">
                J-
                {data.examCountdown.daysRemaining}
                {' '}
                avant le
                {' '}
                {data.user.grade === '3ème' ? 'BEPC' : 'BAC'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {data.examCountdown.weeksRemaining}
                {' '}
                semaines restantes
              </p>
            </div>
            <div className="text-4xl">📅</div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Série d'étude</p>
                <p className="text-2xl font-bold flex items-center gap-2">
                  <Flame className="w-6 h-6 text-orange-500" />
                  {data.studyStreak.current}
                  {' '}
                  jours
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Record:
                  {' '}
                  {data.studyStreak.longest}
                  {' '}
                  jours
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">Objectif du jour</p>
                <Progress
                  value={(data.todayGoal.completedMinutes / data.todayGoal.targetMinutes) * 100}
                  className="h-2 mb-2"
                />
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    {data.todayGoal.completedMinutes}
                    {' '}
                    /
                    {data.todayGoal.targetMinutes}
                    {' '}
                    min
                  </span>
                  <span className="text-muted-foreground">
                    {data.todayGoal.sessionsCount}
                    {' '}
                    sessions
                  </span>
                </div>
              </div>
              <Clock className="w-6 h-6 text-blue-500 ml-4" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Préparation</p>
                <p className={`text-2xl font-bold ${getReadinessColor(data.readinessScore)}`}>
                  {data.readinessScore}
                  %
                </p>
                <p className={`text-xs ${getReadinessColor(data.readinessScore)}`}>
                  {getReadinessLabel(data.readinessScore)}
                </p>
              </div>
              <Target className="w-6 h-6 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Study */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          À étudier maintenant
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.recommendations.length > 0
            ? (
                data.recommendations.map(rec => (
                  <Card key={rec.chapterId} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {rec.subjectName}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${getDifficultyColor('moyen')}`}>
                          {rec.masteryPercentage}
                          % maîtrise
                        </Badge>
                      </div>
                      <CardTitle className="text-base">{rec.chapterName}</CardTitle>
                      <CardDescription>
                        <Badge variant="outline" className="text-xs">
                          {rec.reason}
                        </Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" disabled>
                        Bientôt disponible
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )
            : (
                <Card className="md:col-span-3">
                  <CardContent className="p-6 text-center">
                    <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Excellent travail !</h3>
                    <p className="text-muted-foreground">
                      Tu maîtrises bien tes chapitres. Continue comme ça ou explore une nouvelle matière !
                    </p>
                  </CardContent>
                </Card>
              )}
        </div>
      </div>

      {/* Your Subjects */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Tes matières
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.subjects.map(subject => (
            <Link key={subject.id} to="/learn/subject/$subjectId" params={{ subjectId: subject.id.toString() }}>
              <Card className="hover:shadow-lg transition-all cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {subject.name}
                    </CardTitle>
                    <Badge variant="outline">
                      Coef.
                      {subject.coefficient}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Maîtrise</span>
                        <span className="font-semibold">
                          {subject.masteryPercentage}
                          %
                        </span>
                      </div>
                      <Progress value={subject.masteryPercentage} className="h-2" />
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>
                        {subject.chaptersCompleted}
                        {' '}
                        /
                        {' '}
                        {subject.totalChapters}
                        {' '}
                        chapitres
                      </span>
                      <span>
                        {Math.floor(subject.totalStudyTime / 60)}
                        h total
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {data.recentActivity.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Activité récente</h2>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {data.recentActivity.map((activity, i) => (
                  <div key={i} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{activity.subjectName}</p>
                        <p className="text-sm text-muted-foreground">{activity.details}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-muted-foreground block">
                        {activity.completedAt
                          ? formatDistanceToNow(activity.completedAt, {
                              addSuffix: true,
                              locale: fr,
                            })
                          : 'Date inconnue'}
                      </span>
                      {activity.accuracyRate && (
                        <span className="text-xs text-muted-foreground">
                          {Math.round(Number(activity.accuracyRate) * 100)}
                          % précision
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
