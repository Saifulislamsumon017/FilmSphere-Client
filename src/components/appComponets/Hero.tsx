'use client';

import { motion } from 'framer-motion';
import { Search, Star, TrendingUp, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import herocinema from '../../assets/hero-cinema.jpg';

const stats = [
  { icon: Star, label: 'Ratings', value: '50K+' },
  { icon: TrendingUp, label: 'Reviews', value: '12K+' },
  { icon: Play, label: 'Titles', value: '8K+' },
];

const Hero = () => {
  return (
    <div className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src={herocinema}
          alt="Cinema"
          fill
          priority
          className="object-cover object-[center_35%] scale-105"
        />

        <div className="absolute inset-0 bg-linear-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-background via-transparent to-background/40" />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 mt-10 sm:mt-16 md:mt-20 lg:mt-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl md:max-w-2xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full mb-4 text-xs sm:text-sm"
          >
            Premium FlimSphere Experience
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display leading-tight mb-4"
          >
            DISCOVER. <span className="text-gradient-gold">RATE.</span> STREAM.
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-md sm:max-w-lg"
          >
            Explore thousands of movies & series, share your reviews, and stream
            your favorites — all in one place.
          </motion.p>

          {/* Search + Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 mb-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              <Input
                placeholder="Search movies, series..."
                className="pl-10 h-11 sm:h-12 bg-secondary/50 text-sm"
              />
            </div>

            <Link href="/movies">
              <Button
                size="lg"
                className="h-11 sm:h-12 px-6 sm:px-8 w-full sm:w-auto"
              >
                Explore All
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.2 },
              },
            }}
            className="flex justify-between sm:justify-start sm:gap-8"
          >
            {stats.map(({ icon: Icon, label, value }) => (
              <motion.div
                key={label}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="text-center"
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary mx-auto mb-1" />
                <div className="text-base sm:text-xl font-display">{value}</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">
                  {label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
