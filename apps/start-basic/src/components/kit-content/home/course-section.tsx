import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export function CourseSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/cloudflare.png" alt="Cloudflare" className="w-8 h-8" />
            <h2 className="text-3xl font-bold tracking-tight">
              Master SaaS Development on Cloudflare
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn to build production-ready SaaS applications from scratch using Cloudflare's edge platform
          </p>
        </div>

        <div className="space-y-8">
          {/* Video Section */}
          <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
            <iframe
              src="https://www.youtube.com/embed/1-dXh8J08UI?si=tlmf9sMd6VrCiUt0"
              title="End-to-End SaaS Course Preview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          {/* Button Section */}
          <div className="text-center">
            <Button size="lg" asChild>
              <a href="https://learn.backpine.com/?ref=saas-kit" target="_blank" rel="noopener noreferrer">
                <Play className="w-5 h-5 mr-2" />
                Start Learning
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}