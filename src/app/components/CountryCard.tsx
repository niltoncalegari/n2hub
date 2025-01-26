'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CountryCardProps {
  country: 'russia' | 'usa';
  name: string;
  score: number;
}

export default function CountryCard({ country, name, score }: CountryCardProps) {
  return (
    <Card className={`w-full ${country}`}>
      <CardHeader>
        <CardTitle className="text-white text-center drop-shadow-md">
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <span className="text-2xl font-bold text-white drop-shadow-md">
            {score}
          </span>
        </div>
      </CardContent>
    </Card>
  );
} 