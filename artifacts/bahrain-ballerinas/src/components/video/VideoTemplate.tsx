// Video Template - Replace ReplitLoadingScene with your scenes

import { AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { BahrainScene } from './BahrainScene';

const SCENE_DURATIONS = {
  bahrain: 999999999,
};

export default function VideoTemplate() {
  const { currentScene } = useVideoPlayer({
    durations: SCENE_DURATIONS,
  });

  return (
    <div
      className="w-full h-screen overflow-hidden relative bg-black"
    >
      <AnimatePresence mode="wait">
        {currentScene === 0 && (
          <BahrainScene key="bahrain" />
        )}
      </AnimatePresence>
    </div>
  );
}
