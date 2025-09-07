
"use client";

import { Sparkles, type LucideProps } from "lucide-react";
import * as icons from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";

type Highlight = {
  icon: string;
  title: string;
  description: string;
};

type SectionContent = {
    title: string;
    description: string;
};

const initialHighlights: Highlight[] = [
  {
    icon: "Award",
    title: "Awards & Recognition",
    description: "Celebrating the academic and extra-curricular achievements of our talented students.",
  },
  {
    icon: "Music",
    title: "Live DJ & Music",
    description: "Get ready to groove to the beats of a renowned DJ and live band performances.",
  },
  {
    icon: "Camera",
    title: "Photo Booth",
    description: "Capture fun moments with your friends at our themed photo booths.",
  },
  {
    icon: "Utensils",
    title: "Gala Dinner",
    description: "Enjoy a delectable spread of gourmet dishes and refreshing beverages.",
  },
  {
    icon: "Users",
    title: "Networking",
    description: "A great opportunity to connect with peers, seniors, and faculty members.",
  },
  {
    icon: "Sparkles",
    title: "Surprise Events",
    description: "Stay tuned for exciting surprise events and flash mobs throughout the evening.",
  },
];

const defaultContent = {
    title: "Why This Year is Special",
    description: "A glimpse into the spectacular experiences awaiting you at Prarambh."
};


const DynamicIcon = ({ name, ...props }: {name: string} & LucideProps) => {
    const LucideIcon = (icons as any)[name];
    if (!LucideIcon) {
        return <Sparkles {...props} />; // Fallback icon
    }
    return <LucideIcon {...props} />;
};


export function Highlights({ highlights: serverHighlights, content }: { highlights?: Highlight[], content?: SectionContent }) {
  const highlights = serverHighlights && serverHighlights.length > 0 ? serverHighlights : initialHighlights;
  const loading = !serverHighlights;
  const { title, description } = content || defaultContent;

  return (
    <section id="highlights">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-headline text-4xl md:text-5xl font-bold">{title}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            {description}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
             Array.from({length: 6}).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)
          ) : (
            highlights.map((highlight, index) => (
              <Card key={index} className="text-center bg-card group transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <CardHeader className="items-center">
                  <div className="p-4 bg-accent/10 rounded-full mb-4">
                    <DynamicIcon name={highlight.icon} className="h-10 w-10 text-accent transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <CardTitle className="font-headline text-2xl">{highlight.title}</CardTitle>
                  <CardDescription className="pt-2 text-base">
                    {highlight.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
