"use client";

import { useRef, type CSSProperties } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import styles from "./JittokLineup.module.css";

const LETTERS = ["J", "I", "T", "T", "O", "K"];

const MODELS = [
  {
    image: "/lineup/model-1.webp",
    alt: "JITTOK model one",
    finalDesktopLeft: "1%",
    finalMobileLeft: "-7%",
    enterSide: -1,
  },
  {
    image: "/lineup/model-2.webp",
    alt: "JITTOK model two",
    finalDesktopLeft: "20%",
    finalMobileLeft: "12%",
    enterSide: 1,
  },
  {
    image: "/lineup/model-3.webp",
    alt: "JITTOK model three",
    finalDesktopLeft: "39%",
    finalMobileLeft: "31%",
    enterSide: -1,
  },
  {
    image: "/lineup/model-4.webp",
    alt: "JITTOK model four",
    finalDesktopLeft: "58%",
    finalMobileLeft: "50%",
    enterSide: 1,
  },
  {
    image: "/lineup/model-5.webp",
    alt: "JITTOK model five",
    finalDesktopLeft: "77%",
    finalMobileLeft: "69%",
    enterSide: 1,
  },
];

export function JittokLineup() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, {
    amount: 0.35,
    once: true,
  });
  const reduceMotion = useReducedMotion();
  const play = Boolean(isInView || reduceMotion);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-label="JITTOK animated model lineup"
    >
      <div className={styles.stage}>
        <div className={styles.word} aria-label="JITTOK">
          {LETTERS.map((letter, index) => (
            <motion.span
              key={`${letter}-${index}`}
              className={styles.letter}
              initial={false}
              animate={
                play
                  ? {
                      x: "0%",
                      opacity: 1,
                      filter: "blur(0px)",
                    }
                  : {
                      x: "120%",
                      opacity: 0,
                      filter: "blur(14px)",
                    }
              }
              transition={{
                duration: reduceMotion ? 0 : 0.72,
                delay: reduceMotion ? 0 : 0.35 + index * 0.58,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        <div className={styles.walkingLayer} aria-hidden="true">
          {MODELS.map((model, index) => (
            <WalkingModel
              key={`walker-${model.image}`}
              image={model.image}
              play={play}
              reduceMotion={Boolean(reduceMotion)}
              delay={0.08 + index * 0.72}
              index={index}
            />
          ))}
        </div>

        <div className={styles.finalLineup}>
          {MODELS.map((model, index) => (
            <FinalModel
              key={`final-${model.image}`}
              image={model.image}
              alt={model.alt}
              play={play}
              reduceMotion={Boolean(reduceMotion)}
              delay={4.45 + index * 0.13}
              desktopLeft={model.finalDesktopLeft}
              mobileLeft={model.finalMobileLeft}
              enterSide={model.enterSide}
              zIndex={20 + index}
            />
          ))}
        </div>

        <motion.div
          className={styles.floorLine}
          initial={false}
          animate={play ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.9,
            delay: reduceMotion ? 0 : 4.85,
            ease: [0.22, 1, 0.36, 1],
          }}
        />

        <motion.div
          className={styles.finalGlow}
          initial={false}
          animate={play ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
          transition={{
            duration: reduceMotion ? 0 : 1.1,
            delay: reduceMotion ? 0 : 4.55,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </div>
    </section>
  );
}

export default JittokLineup;

function WalkingModel({
  image,
  play,
  reduceMotion,
  delay,
  index,
}: {
  image: string;
  play: boolean;
  reduceMotion: boolean;
  delay: number;
  index: number;
}) {
  const verticalOffset = index % 2 === 0 ? "0vh" : "-1.5vh";

  return (
    <motion.div
      className={styles.walker}
      initial={false}
      animate={
        play
          ? {
              x: ["-28vw", "118vw"],
              y: [verticalOffset, "-1.2vh", "1vh", verticalOffset],
              rotate: [-2, 2, -2, 0],
              opacity: [0, 1, 1, 0],
              scale: [0.96, 1, 1.02, 1.03],
            }
          : {
              x: "-28vw",
              y: verticalOffset,
              rotate: -2,
              opacity: 0,
              scale: 0.96,
            }
      }
      transition={{
        duration: reduceMotion ? 0 : 2.25,
        delay: reduceMotion ? 0 : delay,
        times: [0, 0.12, 0.82, 1],
        ease: "linear",
      }}
    >
      <img src={image} alt="" draggable={false} />
    </motion.div>
  );
}

function FinalModel({
  image,
  alt,
  play,
  reduceMotion,
  delay,
  desktopLeft,
  mobileLeft,
  enterSide,
  zIndex,
}: {
  image: string;
  alt: string;
  play: boolean;
  reduceMotion: boolean;
  delay: number;
  desktopLeft: string;
  mobileLeft: string;
  enterSide: number;
  zIndex: number;
}) {
  const customStyle = {
    "--desktop-left": desktopLeft,
    "--mobile-left": mobileLeft,
    zIndex,
  } as CSSProperties;

  return (
    <motion.div
      className={styles.model}
      style={customStyle}
      initial={false}
      animate={
        play
          ? {
              x: "0vw",
              y: "0vh",
              opacity: 1,
              scale: 1,
              rotate: 0,
            }
          : {
              x: enterSide < 0 ? "-24vw" : "24vw",
              y: "12vh",
              opacity: 0,
              scale: 0.9,
              rotate: enterSide < 0 ? -3 : 3,
            }
      }
      transition={{
        duration: reduceMotion ? 0 : 0.78,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <img src={image} alt={alt} draggable={false} />
    </motion.div>
  );
}
