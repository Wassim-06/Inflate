import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface TrustpilotStepProps {
    onPublish: () => void;
}

export const TrustpilotStep: React.FC<TrustpilotStepProps> = ({ onPublish }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center h-[60vh] gap-8 p-4">
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full"
            >
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Un dernier geste... ✨</h1>
                <p className="text-muted-foreground mt-3 max-w-md mx-auto">Partagez votre expérience sur Trustpilot pour aider notre communauté. Votre avis est précieux !</p>
            </motion.div>

            <motion.div
                animate={{
                    scale: [1, 1.03, 1],
                    y: [0, -5, 0],
                }}
                transition={{
                    duration: 1.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "mirror"
                }}
            >
                <Button 
                    size="lg" 
                    onClick={onPublish}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-10 py-6 text-lg shadow-lg shadow-green-500/20 transition-all hover:shadow-xl hover:shadow-green-500/30"
                >
                    Publier sur Trustpilot
                </Button>
            </motion.div>
        </div>
    );
};