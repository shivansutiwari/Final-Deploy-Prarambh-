
"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { format, parseISO } from 'date-fns';
import { Skeleton } from "../ui/skeleton";

type Settings = {
    eventDate: string;
    eventTime: string;
    venue: string;
}

const initialTimeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
};

const initialSettings: Settings = {
    eventDate: "2025-08-20",
    eventTime: "18:00",
    venue: "College Auditorium"
};

export function Countdown({ settings: serverSettings, loading: parentLoading = false }: { settings?: Settings, loading?: boolean }) {
  const [settings, setSettings] = useState(initialSettings);
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft);
  const [isClient, setIsClient] = useState(false);
  const loading = parentLoading || !serverSettings;

  // Update settings when serverSettings changes
  useEffect(() => {
    if (serverSettings) {
      setSettings(serverSettings);
    }
  }, [serverSettings]);
  
  const eventDate = new Date(`${settings.eventDate}T${settings.eventTime}:00`);
  
  const calculateTimeLeft = () => {
    const difference = +eventDate - +new Date();
    let timeLeft = { ...initialTimeLeft };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  useEffect(() => {
    setIsClient(true);
    if (!loading) {
      setTimeLeft(calculateTimeLeft());
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [loading, settings]);

  const timerComponents = Object.entries(timeLeft).map(([interval, value]) => {
    return (
      <div key={interval} className="flex flex-col items-center">
        <span className="font-headline text-4xl md:text-6xl font-bold text-primary">
          {String(value).padStart(2, '0')}
        </span>
        <span className="text-sm md:text-base font-medium text-muted-foreground uppercase tracking-widest">
          {interval}
        </span>
      </div>
    );
  });
  
  const formatEventDate = () => {
    if (!settings.eventDate) return "";
    try {
        const date = parseISO(settings.eventDate);
        return format(date, "MMMM d, yyyy");
    } catch (e) {
        return settings.eventDate;
    }
  }

  const formatEventTime = () => {
    if (!settings.eventTime) return "";
    try {
        const [hour, minute] = settings.eventTime.split(':');
        const date = new Date();
        date.setHours(parseInt(hour, 10));
        date.setMinutes(parseInt(minute, 10));
        return format(date, "h:mm a") + " Onwards";
    } catch(e) {
        return settings.eventTime;
    }
  }

  return (
    <section className="bg-background">
      <div className="container mx-auto px-4">
        <div className="bg-card shadow-lg rounded-xl p-6 md:p-10 -mt-20 relative z-20 border-2 border-primary/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
             {loading ? (
                <>
                    <Skeleton className="h-10 w-48 mx-auto" />
                    <Skeleton className="h-10 w-48 mx-auto" />
                    <Skeleton className="h-10 w-48 mx-auto" />
                </>
             ) : (
                <>
                    <div className="flex items-center justify-center gap-3">
                        <Calendar className="w-8 h-8 text-accent" />
                        <div>
                            <h3 className="font-headline text-xl font-semibold">Event Date</h3>
                            <p className="text-muted-foreground">{formatEventDate()}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                        <Clock className="w-8 h-8 text-accent" />
                        <div>
                            <h3 className="font-headline text-xl font-semibold">Starting Time</h3>
                            <p className="text-muted-foreground">{formatEventTime()}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                        <MapPin className="w-8 h-8 text-accent" />
                        <div>
                            <h3 className="font-headline text-xl font-semibold">Location</h3>
                            <p className="text-muted-foreground">{settings.venue}</p>
                        </div>
                    </div>
                </>
             )}
          </div>
          <div className="mt-8 pt-8 border-t border-border">
            <h2 className="text-center font-headline text-3xl font-bold mb-6">Event Starts In</h2>
            <div className="flex justify-center gap-4 md:gap-8">
              {isClient && !loading ? timerComponents : <Skeleton className="h-20 w-80" />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
