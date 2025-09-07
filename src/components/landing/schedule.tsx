
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Clock } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

type ScheduleItem = {
    time: string;
    title: string;
    description: string;
};

type SectionContent = {
    title: string;
    description: string;
}

const defaultSchedule: ScheduleItem[] = [
    {
        time: "6:00 PM - 6:30 PM",
        title: "Welcome & Registration",
        description: "Guests arrive, check-in at the registration desk, and receive their welcome kits."
    },
    {
        time: "6:30 PM - 7:00 PM",
        title: "Inauguration & Lamp Lighting",
        description: "The event officially begins with a lamp lighting ceremony by our chief guests and faculty."
    },
    {
        time: "7:00 PM - 7:45 PM",
        title: "Cultural Performances",
        description: "Enjoy a series of mesmerizing dance and music performances by senior students."
    },
    {
        time: "7:45 PM - 8:30 PM",
        title: "Mr. & Ms. Fresher Contest",
        description: "The most anticipated contest of the evening to crown the new faces of the batch."
    },
    {
        time: "8:30 PM - 9:30 PM",
        title: "DJ Night",
        description: "Let loose on the dance floor as our DJ spins the latest tracks."
    },
    {
        time: "9:30 PM - 10:30 PM",
        title: "Dinner & Networking",
        description: "A delicious dinner buffet is served. Mingle with friends, seniors, and faculty."
    },
    {
        time: "10:30 PM",
        title: "Vote of Thanks",
        description: "Concluding the event with a vote of thanks from the event coordinators."
    }
];

const defaultContent = {
    title: "Event Schedule",
    description: "Follow the timeline of events to make sure you don't miss out on any of the fun."
};

function ScheduleSkeleton() {
    return (
        <div className="space-y-2">
            {Array.from({length: 4}).map((_, i) => (
                <div key={i} className="flex items-center p-4 border-b">
                    <Skeleton className="h-6 w-40" />
                    <div className="ml-auto">
                        <Skeleton className="h-5 w-5" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function Schedule({ schedule: serverSchedule, content }: { schedule?: ScheduleItem[], content?: SectionContent }) {
    const scheduleItems = serverSchedule && serverSchedule.length > 0 ? serverSchedule : defaultSchedule;
    const loading = !serverSchedule;
    const { title, description } = content || defaultContent;

    return (
        <section id="schedule" className="bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="font-headline text-4xl md:text-5xl font-bold">{title}</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                       {description}
                    </p>
                </div>
                <div className="max-w-3xl mx-auto">
                    {loading ? (
                        <ScheduleSkeleton />
                    ) : (
                        <Accordion type="single" collapsible className="w-full">
                            {scheduleItems.map((item, index) => (
                                <AccordionItem value={`item-${index}`} key={index}>
                                    <AccordionTrigger className="font-headline text-xl hover:no-underline">
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="flex items-center gap-2 text-accent">
                                                <Clock className="h-5 w-5"/>
                                                <span className="text-sm font-body font-bold whitespace-nowrap">{item.time}</span>
                                            </div>
                                            <span>{item.title}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pl-14 text-muted-foreground">
                                        {item.description}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}
                </div>
            </div>
        </section>
    );
}
